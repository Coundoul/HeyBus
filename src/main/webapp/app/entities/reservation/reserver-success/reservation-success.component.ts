import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IReservation, Reservation } from '../reservation.model';
import { ReservationService } from '../service/reservation.service';
import { IVoyage } from 'app/entities/voyage/voyage.model';
import { VoyageService } from 'app/entities/voyage/service/voyage.service';
import { ICustomer, Customer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { IUser } from 'app/entities/user/user.model';

@Component({
  selector: 'jhi-reservation-success',
  styleUrls: ['./reservation-success.component.scss'],
  templateUrl: './reservation-success.component.html',
})
export class ReservationSuccessComponent implements OnInit {
  isSaving = false;

  voyage!: IVoyage;
  nbrePassagers?:number;
  editForm = this.fb.group({
    id: [], 
    nom: [],
    prenom: [],
    telephone: [null, [Validators.required]],
    email: [null, [Validators.required]],
    profession: [],
    datenaissance: [],
    dateprisecontact: [],
    adresse: [],
    user: [],
  });

  constructor(
    protected reservationService: ReservationService,
    protected voyageService: VoyageService,
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected router: Router

  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reservation }) => {
      this.updateForm(reservation);
      this.loadRelationshipsOptions();
    });
    this.nbrePassagers = Number(this.activatedRoute.snapshot.paramMap.get('passagers'));
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customer = this.createFromForm();
    const idVoyage = Number(this.activatedRoute.snapshot.paramMap.get('voyage'));
    const nbrePassagers = Number(this.activatedRoute.snapshot.paramMap.get('passagers'));


    if (customer.id !== undefined) {
      this.subscribeToSaveResponse(this.reservationService.update(customer));
    } else {
      this.subscribeToSaveResponse(this.reservationService.createReservation(customer, idVoyage, nbrePassagers));
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
    //this.previousState();
    this.router.navigate(['/']);

  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(customer: ICustomer): void {
    this.editForm.patchValue({
      id: customer.id,
      nom: customer.nom,
      prenom: customer.prenom,
      telephone: customer.telephone,
      email: customer.email,
      profession: customer.profession,
      datenaissance: customer.datenaissance,
      dateprisecontact: customer.dateprisecontact,
      adresse: customer.adresse,
      user: customer.user,
    });
  }

  protected loadRelationshipsOptions(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('voyage'));
    this.voyageService.find(id).subscribe(rest => (this.voyage = rest.body!));
  }

  protected createFromForm(): ICustomer {
    return {
      ...new Customer(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      email: this.editForm.get(['email'])!.value,
      profession: this.editForm.get(['profession'])!.value,
      datenaissance: this.editForm.get(['datenaissance'])!.value,
      dateprisecontact: this.editForm.get(['dateprisecontact'])!.value,
      adresse: this.editForm.get(['adresse'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
