import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { finalize, map } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { LANGUAGES } from 'app/config/language.constants';
import { Observable } from 'rxjs';
import { PasswordService } from '../password/password.service';
import { ITransporteur, Transporteur } from 'app/entities/transporteur/transporteur.model';
import { TransporteurService } from 'app/entities/transporteur/service/transporteur.service';
import { HttpResponse } from '@angular/common/http';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  isSaving = false;
  account!: Account;
  success = false;
  languages = LANGUAGES;
  settingsForm = this.fb.group({
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    langKey: [undefined],
  });
  doNotMatch = false;
  errorPass = false;
  successPass = false;
  account$?: Observable<Account | null>;
  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
  });
  
  editFormTransporteur = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    telephone: [null, [Validators.required]],
    responsable: [null, [Validators.required]],
    mail: [],
    adresse: [null, [Validators.required]],
    logo: [],
    logoContentType: [],
    user: [],
  });
  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private passwordService: PasswordService,
    private transporteurService: TransporteurService,
    protected dataUtils: DataUtils,
    protected elementRef: ElementRef,
    protected eventManager: EventManager,
    protected activatedRoute: ActivatedRoute,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          langKey: account.langKey,
        });

        this.account = account;
      }
    });
    this.account$ = this.accountService.identity();

  this.transporteurService.findByUser(this.account.login).subscribe( transporteur =>{
    this.updateForm(transporteur);
  });

  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editFormTransporteur, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('heybusApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editFormTransporteur.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }
  save(): void {
    this.success = false;

    this.account.firstName = this.settingsForm.get('firstName')!.value;
    this.account.lastName = this.settingsForm.get('lastName')!.value;
    this.account.email = this.settingsForm.get('email')!.value;
    this.account.langKey = this.settingsForm.get('langKey')!.value;

    this.accountService.save(this.account).subscribe(() => {
      this.success = true;

      this.accountService.authenticate(this.account);

      if (this.account.langKey !== this.translateService.currentLang) {
        this.translateService.use(this.account.langKey);
      }
    });
  }
  saveTransporteur(): void {
    this.isSaving = true;
    const transporteur = this.createFromForm();
    if (transporteur.id !== undefined) {
      this.subscribeToSaveResponse(this.transporteurService.update(transporteur));
    } else {
      this.subscribeToSaveResponse(this.transporteurService.create(transporteur));
    }
  }

  changePassword(): void {
    this.errorPass = false;
    this.successPass = false;
    this.doNotMatch = false;

    const newPassword = this.passwordForm.get(['newPassword'])!.value;
    if (newPassword !== this.passwordForm.get(['confirmPassword'])!.value) {
      this.doNotMatch = true;
    } else {
      this.passwordService.save(newPassword, this.passwordForm.get(['currentPassword'])!.value).subscribe(
        () => (this.successPass = true),
        () => (this.errorPass = true)
      );
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransporteur>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
  protected onSaveSuccess(): void {
    this.router.navigate(['/account/settings']);

  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(transporteur: HttpResponse<Transporteur>): void {
    this.editFormTransporteur.patchValue({
      id: transporteur.body?.id,
      nom: transporteur.body?.nom,
      telephone: transporteur.body?.telephone,
      responsable: transporteur.body?.responsable,
      mail: transporteur.body?.mail,
      adresse: transporteur.body?.adresse,
      logo: transporteur.body?.logo,
      logoContentType: transporteur.body?.logoContentType,
      user: transporteur.body?.user,
    });

  }

  protected createFromForm(): ITransporteur {
    return {
      ...new Transporteur(),
      id: this.editFormTransporteur.get(['id'])!.value,
      nom: this.editFormTransporteur.get(['nom'])!.value,
      telephone: this.editFormTransporteur.get(['telephone'])!.value,
      responsable: this.editFormTransporteur.get(['responsable'])!.value,
      mail: this.editFormTransporteur.get(['mail'])!.value,
      adresse: this.editFormTransporteur.get(['adresse'])!.value,
      logoContentType: this.editFormTransporteur.get(['logoContentType'])!.value,
      logo: this.editFormTransporteur.get(['logo'])!.value,
      user: this.editFormTransporteur.get(['user'])!.value,
    };
  }
}
