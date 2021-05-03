import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IArret } from '../arret.model';
import { ArretService } from '../service/arret.service';

@Component({
  templateUrl: './arret-delete-dialog.component.html',
})
export class ArretDeleteDialogComponent {
  arret?: IArret;

  constructor(protected arretService: ArretService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.arretService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
