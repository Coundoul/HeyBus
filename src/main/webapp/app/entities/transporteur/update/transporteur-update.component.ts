import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITransporteur, Transporteur } from '../transporteur.model';
import { TransporteurService } from '../service/transporteur.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-transporteur-update',
  templateUrl: './transporteur-update.component.html',
})
export class TransporteurUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
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

  closeModal!: string;

  @ViewChild('login', { static: false })
  login?: ElementRef;

  doNotMatch = false;
  error = false;
  success = false;


  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected transporteurService: TransporteurService,
    protected userService: UserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    protected fb: FormBuilder
  ) { 
   
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transporteur }) => {
      this.updateForm(transporteur);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('heybusApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transporteur = this.createFromForm();
    if (transporteur.id !== undefined) {
      this.subscribeToSaveResponse(this.transporteurService.update(transporteur));
    } else {
      this.subscribeToSaveResponse(this.transporteurService.create(transporteur));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }
  ngAfterViewInit(): void {
    if (this.login) {
      this.login.nativeElement.focus();
    }
  }


  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransporteur>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(transporteur: ITransporteur): void {
    this.editForm.patchValue({
      id: transporteur.id,
      nom: transporteur.nom,
      telephone: transporteur.telephone,
      responsable: transporteur.responsable,
      mail: transporteur.mail,
      adresse: transporteur.adresse,
      logo: transporteur.logo,
      logoContentType: transporteur.logoContentType,
      user: transporteur.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, transporteur.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): ITransporteur {
    return {
      ...new Transporteur(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      responsable: this.editForm.get(['responsable'])!.value,
      mail: this.editForm.get(['mail'])!.value,
      adresse: this.editForm.get(['adresse'])!.value,
      logoContentType: this.editForm.get(['logoContentType'])!.value,
      logo: this.editForm.get(['logo'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
