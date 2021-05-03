import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITypeDePaiement, TypeDePaiement } from '../type-de-paiement.model';
import { TypeDePaiementService } from '../service/type-de-paiement.service';

@Component({
  selector: 'jhi-type-de-paiement-update',
  templateUrl: './type-de-paiement-update.component.html',
})
export class TypeDePaiementUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    paiement: [null, [Validators.required]],
  });

  constructor(
    protected typeDePaiementService: TypeDePaiementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeDePaiement }) => {
      this.updateForm(typeDePaiement);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeDePaiement = this.createFromForm();
    if (typeDePaiement.id !== undefined) {
      this.subscribeToSaveResponse(this.typeDePaiementService.update(typeDePaiement));
    } else {
      this.subscribeToSaveResponse(this.typeDePaiementService.create(typeDePaiement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeDePaiement>>): void {
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

  protected updateForm(typeDePaiement: ITypeDePaiement): void {
    this.editForm.patchValue({
      id: typeDePaiement.id,
      paiement: typeDePaiement.paiement,
    });
  }

  protected createFromForm(): ITypeDePaiement {
    return {
      ...new TypeDePaiement(),
      id: this.editForm.get(['id'])!.value,
      paiement: this.editForm.get(['paiement'])!.value,
    };
  }
}
