import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVehicule } from '../vehicule.model';
import { VehiculeService } from '../service/vehicule.service';

@Component({
  templateUrl: './vehicule-delete-dialog.component.html',
})
export class VehiculeDeleteDialogComponent {
  vehicule?: IVehicule;

  constructor(protected vehiculeService: VehiculeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vehiculeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
