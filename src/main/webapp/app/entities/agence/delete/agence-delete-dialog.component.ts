import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAgence } from '../agence.model';
import { AgenceService } from '../service/agence.service';

@Component({
  templateUrl: './agence-delete-dialog.component.html',
})
export class AgenceDeleteDialogComponent {
  agence?: IAgence;

  constructor(protected agenceService: AgenceService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.agenceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
