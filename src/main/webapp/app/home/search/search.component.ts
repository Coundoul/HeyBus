import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Voyage } from 'app/entities/voyage/voyage.model';
import { IVille } from 'app/entities/ville/ville.model';

import { VoyageService } from 'app/entities/voyage/service/voyage.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { EmployeService } from 'app/entities/employe/service/employe.service';
import { ArretService } from 'app/entities/arret/service/arret.service';
import { VehiculeService } from 'app/entities/vehicule/service/vehicule.service';
import { VilleService } from 'app/entities/ville/service/ville.service';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'jhi-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [DatePipe],
})
export class SearchComponent implements OnInit, OnDestroy {
  myDate: any = new Date();
  account: Account | null = null;
  authSubscription?: Subscription;
  depart: [] | undefined;
  voyages!: Voyage[];
  nbrePassagers!: number;
  villes: IVille[] = [];
  arrive: [] | undefined;
  editForm = this.fb.group({
    id: [],
    dateDeVoyage: [null, [Validators.required]],
    employes: [],
    arrets: [],
    vehicule: [],
    departVille: [],
    arriveVille: [],
    nbrePassagers: [null, [Validators.required]]
  });


  constructor(
    private datePipe: DatePipe,
    private accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected voyageService: VoyageService,
    private fb: FormBuilder,
    protected employeService: EmployeService,
    protected arretService: ArretService,
    protected vehiculeService: VehiculeService,
    protected villeService: VilleService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.villeService.query().subscribe((res: HttpResponse<IVille[]>) => {
      this.villes = res.body ?? [];
    });
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));

    const date = String(this.activatedRoute.snapshot.paramMap.get('date'));
    const depart = Number(this.activatedRoute.snapshot.paramMap.get('depart'));
    const arrive = Number(this.activatedRoute.snapshot.paramMap.get('arrive'));
    this.nbrePassagers = Number(this.activatedRoute.snapshot.paramMap.get('nbrePassagers'));
    this.voyageService.searchVoyage(date, depart, arrive,this.nbrePassagers).subscribe(rest => (this.voyages = rest.body!));
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.router.navigate(['/login']);
  }
  recherche(): void {
    const date = this.editForm.get(['dateDeVoyage'])!.value;
    const depart = this.editForm.get(['departVille'])!.value;
    const arrive =  this.editForm.get(['arriveVille'])!.value;
    const nbrePassagers = this.editForm.get(['nbrePassagers'])!.value;
    window.location.assign('/search/'+String(date)+'/'+String(depart.id)+'/'+String(arrive.id)+'/'+String(nbrePassagers));
    //this.voyageService.searchVoyage(date, depart.id, arrive.id).subscribe(rest => (this.voyages = rest.body!));
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
