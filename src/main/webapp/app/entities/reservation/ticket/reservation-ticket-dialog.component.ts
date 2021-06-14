import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IReservation } from '../reservation.model';
import { ReservationService } from '../service/reservation.service';

@Component({
  styleUrls: ['./reservation-ticket-dialog.scss'],
  templateUrl: './reservation-ticket-dialog.component.html',
})
export class ReservationTicketDialogComponent {
  reservation!: IReservation;

  constructor(protected reservationService: ReservationService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reservationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
