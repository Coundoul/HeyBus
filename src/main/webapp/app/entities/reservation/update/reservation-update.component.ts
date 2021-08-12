import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IReservation, Reservation } from '../reservation.model';
import { ReservationService } from '../service/reservation.service';
import { IVoyage } from 'app/entities/voyage/voyage.model';
import { VoyageService } from 'app/entities/voyage/service/voyage.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

@Component({
  selector: 'jhi-reservation-update',
  templateUrl: './reservation-update.component.html',
})
export class ReservationUpdateComponent implements OnInit {
  isSaving = false;

  voyagesSharedCollection: IVoyage[] = [];
  customersSharedCollection: ICustomer[] = [];

  editForm = this.fb.group({
    id: [],
    dateDeReservation: [],
    nbrePassagers: [],
    prixReservation: [],
    voyage: [],
    customer: [],
  });

  constructor(
    protected reservationService: ReservationService,
    protected voyageService: VoyageService,
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reservation }) => {
      this.updateForm(reservation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reservation = this.createFromForm();
    if (reservation.id !== undefined) {
      this.subscribeToSaveResponse(this.reservationService.update(reservation));
    } else {
      this.subscribeToSaveResponse(this.reservationService.create(reservation));
    }
  }

  trackVoyageById(index: number, item: IVoyage): number {
    return item.id!;
  }

  trackCustomerById(index: number, item: ICustomer): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReservation>>): void {
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

  protected updateForm(reservation: IReservation): void {
    this.editForm.patchValue({
      id: reservation.id,
      dateDeReservation: reservation.dateDeReservation,
      nbrePassagers: reservation.nbrePassagers,
      prixReservation: reservation.prixReservation,
      voyage: reservation.voyage,
      customer: reservation.customer,
    });

    this.voyagesSharedCollection = this.voyageService.addVoyageToCollectionIfMissing(this.voyagesSharedCollection, reservation.voyage);
    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing(
      this.customersSharedCollection,
      reservation.customer
    );
  }

  protected loadRelationshipsOptions(): void {
    this.voyageService
      .query()
      .pipe(map((res: HttpResponse<IVoyage[]>) => res.body ?? []))
      .pipe(map((voyages: IVoyage[]) => this.voyageService.addVoyageToCollectionIfMissing(voyages, this.editForm.get('voyage')!.value)))
      .subscribe((voyages: IVoyage[]) => (this.voyagesSharedCollection = voyages));

    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing(customers, this.editForm.get('customer')!.value)
        )
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));
  }

  protected createFromForm(): IReservation {
    return {
      ...new Reservation(),
      id: this.editForm.get(['id'])!.value,
      dateDeReservation: this.editForm.get(['dateDeReservation'])!.value,
      nbrePassagers: this.editForm.get(['nbrePassagers'])!.value,
      prixReservation: this.editForm.get(['prixReservation'])!.value,
      voyage: this.editForm.get(['voyage'])!.value,
      customer: this.editForm.get(['customer'])!.value,
    };
  }
}
