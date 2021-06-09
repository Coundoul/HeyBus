import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';

import { IVoyage, Voyage } from 'app/entities/voyage/voyage.model';
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
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';


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
  date: any;
  dateRetour: any;
  depart: any;
  voyages?: IVoyage[];
  nbrePassagers?: number;
  nbrePlace!: number;
  villes: IVille[] = [];
  arrive: any;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

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
  _currentValues?: number[];


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
    this.nbrePassagers=1;
    this.date = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['date'] ? this.activatedRoute.snapshot.params['date'] : '';
    this.dateRetour = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['dateRetour'] ? this.activatedRoute.snapshot.params['dateRetour'] : '';
    this.depart = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['depart'] ? this.activatedRoute.snapshot.params['depart'] : '';
    this.arrive = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['arrive'] ? this.activatedRoute.snapshot.params['arrive'] : '';
    this.nbrePassagers = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['nbrePassagers'] ? this.activatedRoute.snapshot.params['nbrePassagers'] : '';



  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    if(this.activatedRoute.snapshot.params['dateRetour']){
      this.voyageService
      .searchVoyageRetour({
        date : this.date,
        dateRetour : this.dateRetour,
        departVille : this.depart,
        arriveVille :this.arrive,
        nbrePassagers : this.nbrePassagers,
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IVoyage[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
      
    }
    else{
      this.voyageService
      .searchVoyage({
        date : String(this.activatedRoute.snapshot.paramMap.get('date')),
        depart : Number(this.activatedRoute.snapshot.paramMap.get('depart')),
        arrive : Number(this.activatedRoute.snapshot.paramMap.get('arrive')),
        nbrePassagers : Number(this.activatedRoute.snapshot.paramMap.get('nbrePassagers')),
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IVoyage[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
    }
    
  }

  ngOnInit(): void {
    this.villeService.query().subscribe((res: HttpResponse<IVille[]>) => {
      this.villes = res.body ?? [];
    });
    //this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));

    // const date = String(this.activatedRoute.snapshot.paramMap.get('date'));
    // const depart = Number(this.activatedRoute.snapshot.paramMap.get('depart'));
    // const arrive = Number(this.activatedRoute.snapshot.paramMap.get('arrive'));
    // this.nbrePassagers = Number(this.activatedRoute.snapshot.paramMap.get('nbrePassagers'));
    // this.nbrePlace = Number(this.activatedRoute.snapshot.paramMap.get('nbrePlace'));
    // this.voyageService.searchVoyage(date, depart, arrive,this.nbrePassagers).subscribe(rest => (this.voyages = rest.body!));

    this.handleNavigation();
  }
  trackId(index: number, item: Voyage): number {
    return item.id!;
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
 /*Method to listen for onChange event from slider*/
 onSliderChange(selectedValues: number[]):void {
  this._currentValues = selectedValues;
}
  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IVoyage[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    const date = String(this.activatedRoute.snapshot.paramMap.get('date'));
    const depart = String(this.activatedRoute.snapshot.paramMap.get('depart'));
    const arrive = String(this.activatedRoute.snapshot.paramMap.get('arrive'));
    this.nbrePassagers = Number(this.activatedRoute.snapshot.paramMap.get('nbrePassagers'));
    if (navigate) {
      this.router.navigate(['/search/'+date+'/'+depart+'/'+arrive+'/'+String(this.nbrePassagers)], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.voyages = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }



}