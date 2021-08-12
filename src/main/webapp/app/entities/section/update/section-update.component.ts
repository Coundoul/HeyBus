import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISection, Section } from '../section.model';
import { SectionService } from '../service/section.service';

@Component({
  selector: 'jhi-section-update',
  templateUrl: './section-update.component.html',
})
export class SectionUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    description: [],
    reference: [null, []],
    niveau: [],
  });

  constructor(protected sectionService: SectionService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ section }) => {
      this.updateForm(section);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const section = this.createFromForm();
    if (section.id !== undefined) {
      this.subscribeToSaveResponse(this.sectionService.update(section));
    } else {
      this.subscribeToSaveResponse(this.sectionService.create(section));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISection>>): void {
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

  protected updateForm(section: ISection): void {
    this.editForm.patchValue({
      id: section.id,
      nom: section.nom,
      description: section.description,
      reference: section.reference,
      niveau: section.niveau,
    });
  }

  protected createFromForm(): ISection {
    return {
      ...new Section(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      description: this.editForm.get(['description'])!.value,
      reference: this.editForm.get(['reference'])!.value,
      niveau: this.editForm.get(['niveau'])!.value,
    };
  }
}
