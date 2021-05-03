import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAgence, Agence } from '../agence.model';
import { AgenceService } from '../service/agence.service';
import { IRevenu } from 'app/entities/revenu/revenu.model';
import { RevenuService } from 'app/entities/revenu/service/revenu.service';
import { IDepense } from 'app/entities/depense/depense.model';
import { DepenseService } from 'app/entities/depense/service/depense.service';

@Component({
  selector: 'jhi-agence-update',
  templateUrl: './agence-update.component.html',
})
export class AgenceUpdateComponent implements OnInit {
  isSaving = false;

  revenusSharedCollection: IRevenu[] = [];
  depensesSharedCollection: IDepense[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    telephone: [null, [Validators.required]],
    responsable: [],
    revenu: [],
    depense: [],
  });

  constructor(
    protected agenceService: AgenceService,
    protected revenuService: RevenuService,
    protected depenseService: DepenseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agence }) => {
      this.updateForm(agence);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const agence = this.createFromForm();
    if (agence.id !== undefined) {
      this.subscribeToSaveResponse(this.agenceService.update(agence));
    } else {
      this.subscribeToSaveResponse(this.agenceService.create(agence));
    }
  }

  trackRevenuById(index: number, item: IRevenu): number {
    return item.id!;
  }

  trackDepenseById(index: number, item: IDepense): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAgence>>): void {
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

  protected updateForm(agence: IAgence): void {
    this.editForm.patchValue({
      id: agence.id,
      nom: agence.nom,
      telephone: agence.telephone,
      responsable: agence.responsable,
      revenu: agence.revenu,
      depense: agence.depense,
    });

    this.revenusSharedCollection = this.revenuService.addRevenuToCollectionIfMissing(this.revenusSharedCollection, agence.revenu);
    this.depensesSharedCollection = this.depenseService.addDepenseToCollectionIfMissing(this.depensesSharedCollection, agence.depense);
  }

  protected loadRelationshipsOptions(): void {
    this.revenuService
      .query()
      .pipe(map((res: HttpResponse<IRevenu[]>) => res.body ?? []))
      .pipe(map((revenus: IRevenu[]) => this.revenuService.addRevenuToCollectionIfMissing(revenus, this.editForm.get('revenu')!.value)))
      .subscribe((revenus: IRevenu[]) => (this.revenusSharedCollection = revenus));

    this.depenseService
      .query()
      .pipe(map((res: HttpResponse<IDepense[]>) => res.body ?? []))
      .pipe(
        map((depenses: IDepense[]) => this.depenseService.addDepenseToCollectionIfMissing(depenses, this.editForm.get('depense')!.value))
      )
      .subscribe((depenses: IDepense[]) => (this.depensesSharedCollection = depenses));
  }

  protected createFromForm(): IAgence {
    return {
      ...new Agence(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      responsable: this.editForm.get(['responsable'])!.value,
      revenu: this.editForm.get(['revenu'])!.value,
      depense: this.editForm.get(['depense'])!.value,
    };
  }
}
