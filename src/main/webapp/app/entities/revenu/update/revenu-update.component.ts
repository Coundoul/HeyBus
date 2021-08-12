import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRevenu, Revenu } from '../revenu.model';
import { RevenuService } from '../service/revenu.service';

@Component({
  selector: 'jhi-revenu-update',
  templateUrl: './revenu-update.component.html',
})
export class RevenuUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    type: [null, [Validators.required]],
    montant: [null, [Validators.required]],
    description: [],
  });

  constructor(protected revenuService: RevenuService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ revenu }) => {
      this.updateForm(revenu);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const revenu = this.createFromForm();
    if (revenu.id !== undefined) {
      this.subscribeToSaveResponse(this.revenuService.update(revenu));
    } else {
      this.subscribeToSaveResponse(this.revenuService.create(revenu));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRevenu>>): void {
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

  protected updateForm(revenu: IRevenu): void {
    this.editForm.patchValue({
      id: revenu.id,
      date: revenu.date,
      type: revenu.type,
      montant: revenu.montant,
      description: revenu.description,
    });
  }

  protected createFromForm(): IRevenu {
    return {
      ...new Revenu(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      type: this.editForm.get(['type'])!.value,
      montant: this.editForm.get(['montant'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
