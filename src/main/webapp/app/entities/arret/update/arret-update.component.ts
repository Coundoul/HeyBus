import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IArret, Arret } from '../arret.model';
import { ArretService } from '../service/arret.service';
import { IVille } from 'app/entities/ville/ville.model';
import { VilleService } from 'app/entities/ville/service/ville.service';

@Component({
  selector: 'jhi-arret-update',
  templateUrl: './arret-update.component.html',
})
export class ArretUpdateComponent implements OnInit {
  isSaving = false;

  nomarretVillesCollection: IVille[] = [];

  editForm = this.fb.group({
    id: [],
    description: [],
    nomarretVille: [],
  });

  constructor(
    protected arretService: ArretService,
    protected villeService: VilleService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ arret }) => {
      this.updateForm(arret);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const arret = this.createFromForm();
    if (arret.id !== undefined) {
      this.subscribeToSaveResponse(this.arretService.update(arret));
    } else {
      this.subscribeToSaveResponse(this.arretService.create(arret));
    }
  }

  trackVilleById(index: number, item: IVille): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IArret>>): void {
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

  protected updateForm(arret: IArret): void {
    this.editForm.patchValue({
      id: arret.id,
      description: arret.description,
      nomarretVille: arret.nomarretVille,
    });

    this.nomarretVillesCollection = this.villeService.addVilleToCollectionIfMissing(this.nomarretVillesCollection, arret.nomarretVille);
  }

  protected loadRelationshipsOptions(): void {
    this.villeService
      .query({ filter: 'nomarret-is-null' })
      .pipe(map((res: HttpResponse<IVille[]>) => res.body ?? []))
      .pipe(map((villes: IVille[]) => this.villeService.addVilleToCollectionIfMissing(villes, this.editForm.get('nomarretVille')!.value)))
      .subscribe((villes: IVille[]) => (this.nomarretVillesCollection = villes));
  }

  protected createFromForm(): IArret {
    return {
      ...new Arret(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      nomarretVille: this.editForm.get(['nomarretVille'])!.value,
    };
  }
}
