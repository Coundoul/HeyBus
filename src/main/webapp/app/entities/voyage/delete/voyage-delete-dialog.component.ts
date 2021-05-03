import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVoyage } from '../voyage.model';
import { VoyageService } from '../service/voyage.service';

@Component({
  templateUrl: './voyage-delete-dialog.component.html',
})
export class VoyageDeleteDialogComponent {
  voyage?: IVoyage;

  constructor(protected voyageService: VoyageService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.voyageService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
