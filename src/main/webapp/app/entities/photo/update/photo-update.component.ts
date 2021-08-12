import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPhoto, Photo } from '../photo.model';
import { PhotoService } from '../service/photo.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ITransporteur } from 'app/entities/transporteur/transporteur.model';
import { TransporteurService } from 'app/entities/transporteur/service/transporteur.service';

@Component({
  selector: 'jhi-photo-update',
  templateUrl: './photo-update.component.html',
})
export class PhotoUpdateComponent implements OnInit {
  isSaving = false;

  transporteursSharedCollection: ITransporteur[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    image: [null, [Validators.required]],
    imageContentType: [],
    uploaded: [],
    transporteur: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected photoService: PhotoService,
    protected transporteurService: TransporteurService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ photo }) => {
      if (photo.id === undefined) {
        const today = dayjs().startOf('day');
        photo.uploaded = today;
      }

      this.updateForm(photo);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('heybusApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const photo = this.createFromForm();
    if (photo.id !== undefined) {
      this.subscribeToSaveResponse(this.photoService.update(photo));
    } else {
      this.subscribeToSaveResponse(this.photoService.create(photo));
    }
  }

  trackTransporteurById(index: number, item: ITransporteur): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPhoto>>): void {
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

  protected updateForm(photo: IPhoto): void {
    this.editForm.patchValue({
      id: photo.id,
      title: photo.title,
      image: photo.image,
      imageContentType: photo.imageContentType,
      uploaded: photo.uploaded ? photo.uploaded.format(DATE_TIME_FORMAT) : null,
      transporteur: photo.transporteur,
    });

    this.transporteursSharedCollection = this.transporteurService.addTransporteurToCollectionIfMissing(
      this.transporteursSharedCollection,
      photo.transporteur
    );
  }

  protected loadRelationshipsOptions(): void {
    this.transporteurService
      .query()
      .pipe(map((res: HttpResponse<ITransporteur[]>) => res.body ?? []))
      .pipe(
        map((transporteurs: ITransporteur[]) =>
          this.transporteurService.addTransporteurToCollectionIfMissing(transporteurs, this.editForm.get('transporteur')!.value)
        )
      )
      .subscribe((transporteurs: ITransporteur[]) => (this.transporteursSharedCollection = transporteurs));
  }

  protected createFromForm(): IPhoto {
    return {
      ...new Photo(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      uploaded: this.editForm.get(['uploaded'])!.value ? dayjs(this.editForm.get(['uploaded'])!.value, DATE_TIME_FORMAT) : undefined,
      transporteur: this.editForm.get(['transporteur'])!.value,
    };
  }
}
