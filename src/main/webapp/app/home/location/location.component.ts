import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { IEmploye } from 'app/entities/employe/employe.model';
import { IArret } from 'app/entities/arret/arret.model';
import { IVehicule } from 'app/entities/vehicule/vehicule.model';
import { IVille } from 'app/entities/ville/ville.model';
import { Voyage } from 'app/entities/voyage/voyage.model';
import { FormBuilder, Validators } from '@angular/forms';
import { VoyageService } from 'app/entities/voyage/service/voyage.service';
import { EmployeService } from 'app/entities/employe/service/employe.service';
import { ArretService } from 'app/entities/arret/service/arret.service';
import { VehiculeService } from 'app/entities/vehicule/service/vehicule.service';
import { VilleService } from 'app/entities/ville/service/ville.service';
import { HttpResponse } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'jhi-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  providers: [DatePipe],
})
export class LocationComponent implements OnInit, OnDestroy {
 
  account: Account | null = null;
  authSubscription?: Subscription;
 

  editForm = this.fb.group({
    nomEntreprise: [],
    mailEntreprise: [null, [Validators.required]],
    telEntreprise: [null, [Validators.required]],
    message: [],
  });

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
   this.louer();
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.router.navigate(['/login']);
  }
  louer(): void {
    const nom = this.editForm.get(['dateDeVoyage'])!.value;
    const mail = this.editForm.get(['departVille'])!.value;
    const tel =  this.editForm.get(['arriveVille'])!.value;
    const message = this.editForm.get(['nbrePassagers'])!.value;
    
    //this.voyageService.searchVoyage(date, depart.id, arrive.id).subscribe(rest => (this.voyages = rest.body!));
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  trackId(_index: number, item: Voyage): number {
    return item.id!;
  }


}
