import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFuel } from '../fuel.model';
import { FuelService } from '../service/fuel.service';

@Component({
  templateUrl: './fuel-delete-dialog.component.html',
})
export class FuelDeleteDialogComponent {
  fuel?: IFuel;

  constructor(protected fuelService: FuelService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fuelService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
