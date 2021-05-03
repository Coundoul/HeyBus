import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITransporteur } from '../transporteur.model';
import { TransporteurService } from '../service/transporteur.service';

@Component({
  templateUrl: './transporteur-delete-dialog.component.html',
})
export class TransporteurDeleteDialogComponent {
  transporteur?: ITransporteur;

  constructor(protected transporteurService: TransporteurService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.transporteurService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
