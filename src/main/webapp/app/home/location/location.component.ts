import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { IVille } from 'app/entities/ville/ville.model';
import { Voyage } from 'app/entities/voyage/voyage.model';
import { FormBuilder, Validators } from '@angular/forms';

import { VilleService } from 'app/entities/ville/service/ville.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { DatePipe } from '@angular/common';
import { VoyageService } from 'app/entities/voyage/service/voyage.service';

@Component({
  selector: 'jhi-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  providers: [DatePipe],
})
export class LocationComponent implements OnInit, OnDestroy {
  isSaving = false;
  successLocation:any;
  account: Account | null = null;
  authSubscription?: Subscription;
  villes: IVille[] = [];
  editForm = this.fb.group({
    id: [],
    nomEntreprise: [],
    mailEntreprise: [null, [Validators.required]],
    telEntreprise: [],
    message: [],
  });
  
  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    protected villeService: VilleService,
    protected voyageService: VoyageService,
    private router: Router
  ) {
  }

  ngOnInit(): void { 
    this.isSaving = false;
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  sendMail(): void {
    const nom = this.editForm.get(['nomEntreprise'])!.value;
    const mail = this.editForm.get(['mailEntreprise'])!.value;
    const tel =  this.editForm.get(['telEntreprise'])!.value;
    const message = this.editForm.get(['message'])!.value;
    this.successLocation = this.voyageService.louerBus(nom, mail, tel, message).subscribe();

  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }




}
