import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDepense, Depense } from '../depense.model';
import { DepenseService } from '../service/depense.service';

@Component({
  selector: 'jhi-depense-update',
  templateUrl: './depense-update.component.html',
})
export class DepenseUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    category: [null, [Validators.required]],
    type: [null, [Validators.required]],
    montant: [null, [Validators.required]],
    description: [],
  });

  constructor(protected depenseService: DepenseService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ depense }) => {
      this.updateForm(depense);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const depense = this.createFromForm();
    if (depense.id !== undefined) {
      this.subscribeToSaveResponse(this.depenseService.update(depense));
    } else {
      this.subscribeToSaveResponse(this.depenseService.create(depense));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDepense>>): void {
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

  protected updateForm(depense: IDepense): void {
    this.editForm.patchValue({
      id: depense.id,
      date: depense.date,
      category: depense.category,
      type: depense.type,
      montant: depense.montant,
      description: depense.description,
    });
  }

  protected createFromForm(): IDepense {
    return {
      ...new Depense(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      category: this.editForm.get(['category'])!.value,
      type: this.editForm.get(['type'])!.value,
      montant: this.editForm.get(['montant'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
