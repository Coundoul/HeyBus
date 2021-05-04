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
  selector: 'jhi-search',
  templateUrl: './search.component.html',
  providers: [DatePipe],
})
export class SearchComponent implements OnInit, OnDestroy {
  myDate: any = new Date();
  account: Account | null = null;
  authSubscription?: Subscription;
  depart: [] | undefined;
  voyages!: Voyage[];

  constructor(
    private datePipe: DatePipe,
    private accountService: AccountService,
    private fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    protected voyageService: VoyageService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
 
    const date = String(this.activatedRoute.snapshot.paramMap.get('date'));
    const depart = Number(this.activatedRoute.snapshot.paramMap.get('depart'));
    const arrive = Number(this.activatedRoute.snapshot.paramMap.get('arrive'));

    this.voyageService.searchVoyage(date, depart, arrive).subscribe(rest => (this.voyages = rest.body!));
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.router.navigate(['/login']);
  }
 
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  trackId(index: number, item: Voyage): number {
    return item.id!;
  }
}
