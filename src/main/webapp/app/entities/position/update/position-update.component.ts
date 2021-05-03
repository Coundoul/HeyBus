import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPosition, Position } from '../position.model';
import { PositionService } from '../service/position.service';
import { ISection } from 'app/entities/section/section.model';
import { SectionService } from 'app/entities/section/service/section.service';

@Component({
  selector: 'jhi-position-update',
  templateUrl: './position-update.component.html',
})
export class PositionUpdateComponent implements OnInit {
  isSaving = false;

  sectionsSharedCollection: ISection[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    description: [],
    reference: [null, []],
    niveau: [],
    section: [],
  });

  constructor(
    protected positionService: PositionService,
    protected sectionService: SectionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ position }) => {
      this.updateForm(position);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const position = this.createFromForm();
    if (position.id !== undefined) {
      this.subscribeToSaveResponse(this.positionService.update(position));
    } else {
      this.subscribeToSaveResponse(this.positionService.create(position));
    }
  }

  trackSectionById(index: number, item: ISection): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPosition>>): void {
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

  protected updateForm(position: IPosition): void {
    this.editForm.patchValue({
      id: position.id,
      nom: position.nom,
      description: position.description,
      reference: position.reference,
      niveau: position.niveau,
      section: position.section,
    });

    this.sectionsSharedCollection = this.sectionService.addSectionToCollectionIfMissing(this.sectionsSharedCollection, position.section);
  }

  protected loadRelationshipsOptions(): void {
    this.sectionService
      .query()
      .pipe(map((res: HttpResponse<ISection[]>) => res.body ?? []))
      .pipe(
        map((sections: ISection[]) => this.sectionService.addSectionToCollectionIfMissing(sections, this.editForm.get('section')!.value))
      )
      .subscribe((sections: ISection[]) => (this.sectionsSharedCollection = sections));
  }

  protected createFromForm(): IPosition {
    return {
      ...new Position(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      description: this.editForm.get(['description'])!.value,
      reference: this.editForm.get(['reference'])!.value,
      niveau: this.editForm.get(['niveau'])!.value,
      section: this.editForm.get(['section'])!.value,
    };
  }
}
