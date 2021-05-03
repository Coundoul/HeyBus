import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IVoyage, Voyage } from '../voyage.model';
import { VoyageService } from '../service/voyage.service';
import { IEmploye } from 'app/entities/employe/employe.model';
import { EmployeService } from 'app/entities/employe/service/employe.service';
import { IArret } from 'app/entities/arret/arret.model';
import { ArretService } from 'app/entities/arret/service/arret.service';
import { IVehicule } from 'app/entities/vehicule/vehicule.model';
import { VehiculeService } from 'app/entities/vehicule/service/vehicule.service';
import { IVille } from 'app/entities/ville/ville.model';
import { VilleService } from 'app/entities/ville/service/ville.service';
import { ITransporteur } from 'app/entities/transporteur/transporteur.model';
import { TransporteurService } from 'app/entities/transporteur/service/transporteur.service';

@Component({
  selector: 'jhi-voyage-update',
  templateUrl: './voyage-update.component.html',
})
export class VoyageUpdateComponent implements OnInit {
  isSaving = false;

  employesSharedCollection: IEmploye[] = [];
  arretsSharedCollection: IArret[] = [];
  vehiculesSharedCollection: IVehicule[] = [];
  villesSharedCollection: IVille[] = [];
  transporteursSharedCollection: ITransporteur[] = [];

  editForm = this.fb.group({
    id: [],
    dateDeVoyage: [null, [Validators.required]],
    prix: [],
    nbrePlace: [],
    quartier: [],
    description: [],
    climatisation: [],
    wifi: [],
    toilette: [],
    adresseDepart: [],
    adresseArrive: [],
    employes: [],
    arrets: [],
    vehicule: [],
    departVille: [],
    arriveVille: [],
    transporteur: [],
  });

  constructor(
    protected voyageService: VoyageService,
    protected employeService: EmployeService,
    protected arretService: ArretService,
    protected vehiculeService: VehiculeService,
    protected villeService: VilleService,
    protected transporteurService: TransporteurService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voyage }) => {
      if (voyage.id === undefined) {
        const today = dayjs().startOf('day');
        voyage.dateDeVoyage = today;
      }

      this.updateForm(voyage);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const voyage = this.createFromForm();
    if (voyage.id !== undefined) {
      this.subscribeToSaveResponse(this.voyageService.update(voyage));
    } else {
      this.subscribeToSaveResponse(this.voyageService.create(voyage));
    }
  }

  trackEmployeById(index: number, item: IEmploye): number {
    return item.id!;
  }

  trackArretById(index: number, item: IArret): number {
    return item.id!;
  }

  trackVehiculeById(index: number, item: IVehicule): number {
    return item.id!;
  }

  trackVilleById(index: number, item: IVille): number {
    return item.id!;
  }

  trackTransporteurById(index: number, item: ITransporteur): number {
    return item.id!;
  }

  getSelectedEmploye(option: IEmploye, selectedVals?: IEmploye[]): IEmploye {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedArret(option: IArret, selectedVals?: IArret[]): IArret {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVoyage>>): void {
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

  protected updateForm(voyage: IVoyage): void {
    this.editForm.patchValue({
      id: voyage.id,
      dateDeVoyage: voyage.dateDeVoyage ? voyage.dateDeVoyage.format(DATE_TIME_FORMAT) : null,
      prix: voyage.prix,
      nbrePlace: voyage.nbrePlace,
      quartier: voyage.quartier,
      description: voyage.description,
      climatisation: voyage.climatisation,
      wifi: voyage.wifi,
      toilette: voyage.toilette,
      adresseDepart: voyage.adresseDepart,
      adresseArrive: voyage.adresseArrive,
      employes: voyage.employes,
      arrets: voyage.arrets,
      vehicule: voyage.vehicule,
      departVille: voyage.departVille,
      arriveVille: voyage.arriveVille,
      transporteur: voyage.transporteur,
    });

    this.employesSharedCollection = this.employeService.addEmployeToCollectionIfMissing(
      this.employesSharedCollection,
      ...(voyage.employes ?? [])
    );
    this.arretsSharedCollection = this.arretService.addArretToCollectionIfMissing(this.arretsSharedCollection, ...(voyage.arrets ?? []));
    this.vehiculesSharedCollection = this.vehiculeService.addVehiculeToCollectionIfMissing(this.vehiculesSharedCollection, voyage.vehicule);
    this.villesSharedCollection = this.villeService.addVilleToCollectionIfMissing(
      this.villesSharedCollection,
      voyage.departVille,
      voyage.arriveVille
    );
    this.transporteursSharedCollection = this.transporteurService.addTransporteurToCollectionIfMissing(
      this.transporteursSharedCollection,
      voyage.transporteur
    );
  }

  protected loadRelationshipsOptions(): void {
    this.employeService
      .query()
      .pipe(map((res: HttpResponse<IEmploye[]>) => res.body ?? []))
      .pipe(
        map((employes: IEmploye[]) =>
          this.employeService.addEmployeToCollectionIfMissing(employes, ...(this.editForm.get('employes')!.value ?? []))
        )
      )
      .subscribe((employes: IEmploye[]) => (this.employesSharedCollection = employes));

    this.arretService
      .query()
      .pipe(map((res: HttpResponse<IArret[]>) => res.body ?? []))
      .pipe(
        map((arrets: IArret[]) => this.arretService.addArretToCollectionIfMissing(arrets, ...(this.editForm.get('arrets')!.value ?? [])))
      )
      .subscribe((arrets: IArret[]) => (this.arretsSharedCollection = arrets));

    this.vehiculeService
      .query()
      .pipe(map((res: HttpResponse<IVehicule[]>) => res.body ?? []))
      .pipe(
        map((vehicules: IVehicule[]) =>
          this.vehiculeService.addVehiculeToCollectionIfMissing(vehicules, this.editForm.get('vehicule')!.value)
        )
      )
      .subscribe((vehicules: IVehicule[]) => (this.vehiculesSharedCollection = vehicules));

    this.villeService
      .query()
      .pipe(map((res: HttpResponse<IVille[]>) => res.body ?? []))
      .pipe(
        map((villes: IVille[]) =>
          this.villeService.addVilleToCollectionIfMissing(
            villes,
            this.editForm.get('departVille')!.value,
            this.editForm.get('arriveVille')!.value
          )
        )
      )
      .subscribe((villes: IVille[]) => (this.villesSharedCollection = villes));

    this.transporteurService
      .query()
      .pipe(map((res: HttpResponse<ITransporteur[]>) => res.body ?? []))
      .pipe(
        map((transporteurs: ITransporteur[]) =>
          this.transporteurService.addTransporteurToCollectionIfMissing(transporteurs, this.editForm.get('transporteur')!.value)
        )
      )
      .subscribe((transporteurs: ITransporteur[]) => (this.transporteursSharedCollection = transporteurs));
  }

  protected createFromForm(): IVoyage {
    return {
      ...new Voyage(),
      id: this.editForm.get(['id'])!.value,
      dateDeVoyage: this.editForm.get(['dateDeVoyage'])!.value
        ? dayjs(this.editForm.get(['dateDeVoyage'])!.value, DATE_TIME_FORMAT)
        : undefined,
      prix: this.editForm.get(['prix'])!.value,
      nbrePlace: this.editForm.get(['nbrePlace'])!.value,
      quartier: this.editForm.get(['quartier'])!.value,
      description: this.editForm.get(['description'])!.value,
      climatisation: this.editForm.get(['climatisation'])!.value,
      wifi: this.editForm.get(['wifi'])!.value,
      toilette: this.editForm.get(['toilette'])!.value,
      adresseDepart: this.editForm.get(['adresseDepart'])!.value,
      adresseArrive: this.editForm.get(['adresseArrive'])!.value,
      employes: this.editForm.get(['employes'])!.value,
      arrets: this.editForm.get(['arrets'])!.value,
      vehicule: this.editForm.get(['vehicule'])!.value,
      departVille: this.editForm.get(['departVille'])!.value,
      arriveVille: this.editForm.get(['arriveVille'])!.value,
      transporteur: this.editForm.get(['transporteur'])!.value,
    };
  }
}
