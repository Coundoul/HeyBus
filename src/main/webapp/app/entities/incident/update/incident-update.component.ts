import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IIncident, Incident } from '../incident.model';
import { IncidentService } from '../service/incident.service';
import { IVehicule } from 'app/entities/vehicule/vehicule.model';
import { VehiculeService } from 'app/entities/vehicule/service/vehicule.service';

@Component({
  selector: 'jhi-incident-update',
  templateUrl: './incident-update.component.html',
})
export class IncidentUpdateComponent implements OnInit {
  isSaving = false;

  vehiculesSharedCollection: IVehicule[] = [];

  editForm = this.fb.group({
    id: [],
    gravite: [],
    chauffeur: [null, [Validators.required]],
    responsableincident: [null, [Validators.required]],
    reporteurincident: [],
    vehicule: [],
  });

  constructor(
    protected incidentService: IncidentService,
    protected vehiculeService: VehiculeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ incident }) => {
      this.updateForm(incident);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const incident = this.createFromForm();
    if (incident.id !== undefined) {
      this.subscribeToSaveResponse(this.incidentService.update(incident));
    } else {
      this.subscribeToSaveResponse(this.incidentService.create(incident));
    }
  }

  trackVehiculeById(index: number, item: IVehicule): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIncident>>): void {
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

  protected updateForm(incident: IIncident): void {
    this.editForm.patchValue({
      id: incident.id,
      gravite: incident.gravite,
      chauffeur: incident.chauffeur,
      responsableincident: incident.responsableincident,
      reporteurincident: incident.reporteurincident,
      vehicule: incident.vehicule,
    });

    this.vehiculesSharedCollection = this.vehiculeService.addVehiculeToCollectionIfMissing(
      this.vehiculesSharedCollection,
      incident.vehicule
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

  protected createFromForm(): IIncident {
    return {
      ...new Incident(),
      id: this.editForm.get(['id'])!.value,
      gravite: this.editForm.get(['gravite'])!.value,
      chauffeur: this.editForm.get(['chauffeur'])!.value,
      responsableincident: this.editForm.get(['responsableincident'])!.value,
      reporteurincident: this.editForm.get(['reporteurincident'])!.value,
      vehicule: this.editForm.get(['vehicule'])!.value,
    };
  }
}
