import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMaintenance, Maintenance } from '../maintenance.model';
import { MaintenanceService } from '../service/maintenance.service';
import { IVehicule } from 'app/entities/vehicule/vehicule.model';
import { VehiculeService } from 'app/entities/vehicule/service/vehicule.service';

@Component({
  selector: 'jhi-maintenance-update',
  templateUrl: './maintenance-update.component.html',
})
export class MaintenanceUpdateComponent implements OnInit {
  isSaving = false;

  vehiculesSharedCollection: IVehicule[] = [];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    type: [],
    nbreKmMoteur: [],
    vehicule: [],
  });

  constructor(
    protected maintenanceService: MaintenanceService,
    protected vehiculeService: VehiculeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ maintenance }) => {
      this.updateForm(maintenance);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const maintenance = this.createFromForm();
    if (maintenance.id !== undefined) {
      this.subscribeToSaveResponse(this.maintenanceService.update(maintenance));
    } else {
      this.subscribeToSaveResponse(this.maintenanceService.create(maintenance));
    }
  }

  trackVehiculeById(index: number, item: IVehicule): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMaintenance>>): void {
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

  protected updateForm(maintenance: IMaintenance): void {
    this.editForm.patchValue({
      id: maintenance.id,
      date: maintenance.date,
      type: maintenance.type,
      nbreKmMoteur: maintenance.nbreKmMoteur,
      vehicule: maintenance.vehicule,
    });

    this.vehiculesSharedCollection = this.vehiculeService.addVehiculeToCollectionIfMissing(
      this.vehiculesSharedCollection,
      maintenance.vehicule
    );
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

  protected createFromForm(): IMaintenance {
    return {
      ...new Maintenance(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      type: this.editForm.get(['type'])!.value,
      nbreKmMoteur: this.editForm.get(['nbreKmMoteur'])!.value,
      vehicule: this.editForm.get(['vehicule'])!.value,
    };
  }
}
