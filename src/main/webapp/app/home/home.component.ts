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
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DatePipe],
})
export class HomeComponent implements OnInit, OnDestroy {
  myDate: any = new Date();
  account: Account | null = null;
  authSubscription?: Subscription;
  employes: IEmploye[] = [];
  arrets: IArret[] = [];
  vehicules: IVehicule[] = [];
  villes: IVille[] = [];
  voyages!: Voyage[];
  arrive: [] | undefined;
  depart: [] | undefined;
  editForm = this.fb.group({
    id: [],
    dateDeVoyage: [null, [Validators.required]],
    employes: [],
    arrets: [],
    vehicule: [],
    departVille: [],
    arriveVille: [],
    nbrePassagers: [1, [Validators.required]]
  });

  constructor(
    private datePipe: DatePipe,
    private accountService: AccountService,
    private fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    protected voyageService: VoyageService,
    protected employeService: EmployeService,
    protected arretService: ArretService,
    protected vehiculeService: VehiculeService,
    protected villeService: VilleService,
    private router: Router
  ) {
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.villeService.query().subscribe((res: HttpResponse<IVille[]>) => {
      this.villes = res.body ?? [];
    });
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    // this.editForm.get('departVille')?.valueChanges.subscribe((data)=>{
    // this.villes2.splice(this.villes2.indexOf(this.editForm.get(['departVille'])!.value),1);
    // eslint-disable-next-line no-console
    // console.log(this.villes)
    // })
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
    this.router.navigate(['/search/'+String(date)+'/'+String(depart.id)+'/'+String(arrive.id)+'/'+String(nbrePassagers)]);

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
