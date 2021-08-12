import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVehicule, Vehicule } from '../vehicule.model';
import { VehiculeService } from '../service/vehicule.service';
import { ITransporteur } from 'app/entities/transporteur/transporteur.model';
import { TransporteurService } from 'app/entities/transporteur/service/transporteur.service';

@Component({
  selector: 'jhi-vehicule-update',
  templateUrl: './vehicule-update.component.html',
})
export class VehiculeUpdateComponent implements OnInit {
  isSaving = false;

  transporteursSharedCollection: ITransporteur[] = [];

  editForm = this.fb.group({
    id: [],
    reference: [null, [Validators.required]],
    numChassis: [],
    numCarteGrise: [],
    nbrePlace: [],
    marqueVoiture: [],
    photo: [],
    refcartetotal: [],
    typemoteur: [],
    transporteur: [],
  });

  constructor(
    protected vehiculeService: VehiculeService,
    protected transporteurService: TransporteurService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vehicule }) => {
      this.updateForm(vehicule);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vehicule = this.createFromForm();
    if (vehicule.id !== undefined) {
      this.subscribeToSaveResponse(this.vehiculeService.update(vehicule));
    } else {
      this.subscribeToSaveResponse(this.vehiculeService.create(vehicule));
    }
  }

  trackTransporteurById(index: number, item: ITransporteur): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVehicule>>): void {
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

  protected updateForm(vehicule: IVehicule): void {
    this.editForm.patchValue({
      id: vehicule.id,
      reference: vehicule.reference,
      numChassis: vehicule.numChassis,
      numCarteGrise: vehicule.numCarteGrise,
      nbrePlace: vehicule.nbrePlace,
      marqueVoiture: vehicule.marqueVoiture,
      photo: vehicule.photo,
      refcartetotal: vehicule.refcartetotal,
      typemoteur: vehicule.typemoteur,
      transporteur: vehicule.transporteur,
    });

    this.transporteursSharedCollection = this.transporteurService.addTransporteurToCollectionIfMissing(
      this.transporteursSharedCollection,
      vehicule.transporteur
    );
  }

  protected loadRelationshipsOptions(): void {
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

  protected createFromForm(): IVehicule {
    return {
      ...new Vehicule(),
      id: this.editForm.get(['id'])!.value,
      reference: this.editForm.get(['reference'])!.value,
      numChassis: this.editForm.get(['numChassis'])!.value,
      numCarteGrise: this.editForm.get(['numCarteGrise'])!.value,
      nbrePlace: this.editForm.get(['nbrePlace'])!.value,
      marqueVoiture: this.editForm.get(['marqueVoiture'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      refcartetotal: this.editForm.get(['refcartetotal'])!.value,
      typemoteur: this.editForm.get(['typemoteur'])!.value,
      transporteur: this.editForm.get(['transporteur'])!.value,
    };
  }
}
