import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFuel, Fuel } from '../fuel.model';
import { FuelService } from '../service/fuel.service';
import { IVehicule } from 'app/entities/vehicule/vehicule.model';
import { VehiculeService } from 'app/entities/vehicule/service/vehicule.service';

@Component({
  selector: 'jhi-fuel-update',
  templateUrl: './fuel-update.component.html',
})
export class FuelUpdateComponent implements OnInit {
  isSaving = false;

  vehiculesSharedCollection: IVehicule[] = [];

  editForm = this.fb.group({
    id: [],
    typeDeCarburant: [null, [Validators.required]],
    date: [null, [Validators.required]],
    km: [null, [Validators.required]],
    nbLitre: [null, [Validators.required]],
    montant: [null, [Validators.required]],
    vehicule: [null, Validators.required],
  });

  constructor(
    protected fuelService: FuelService,
    protected vehiculeService: VehiculeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fuel }) => {
      this.updateForm(fuel);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fuel = this.createFromForm();
    if (fuel.id !== undefined) {
      this.subscribeToSaveResponse(this.fuelService.update(fuel));
    } else {
      this.subscribeToSaveResponse(this.fuelService.create(fuel));
    }
  }

  trackVehiculeById(index: number, item: IVehicule): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFuel>>): void {
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

  protected updateForm(fuel: IFuel): void {
    this.editForm.patchValue({
      id: fuel.id,
      typeDeCarburant: fuel.typeDeCarburant,
      date: fuel.date,
      km: fuel.km,
      nbLitre: fuel.nbLitre,
      montant: fuel.montant,
      vehicule: fuel.vehicule,
    });

    this.vehiculesSharedCollection = this.vehiculeService.addVehiculeToCollectionIfMissing(this.vehiculesSharedCollection, fuel.vehicule);
  }

  protected loadRelationshipsOptions(): void {
    this.vehiculeService
      .query()
      .pipe(map((res: HttpResponse<IVehicule[]>) => res.body ?? []))
      .pipe(
        map((vehicules: IVehicule[]) =>
          this.vehiculeService.addVehiculeToCollectionIfMissing(vehicules, this.editForm.get('vehicule')!.value)
        )
      )
      .subscribe((vehicules: IVehicule[]) => (this.vehiculesSharedCollection = vehicules));
  }

  protected createFromForm(): IFuel {
    return {
      ...new Fuel(),
      id: this.editForm.get(['id'])!.value,
      typeDeCarburant: this.editForm.get(['typeDeCarburant'])!.value,
      date: this.editForm.get(['date'])!.value,
      km: this.editForm.get(['km'])!.value,
      nbLitre: this.editForm.get(['nbLitre'])!.value,
      montant: this.editForm.get(['montant'])!.value,
      vehicule: this.editForm.get(['vehicule'])!.value,
    };
  }
}
