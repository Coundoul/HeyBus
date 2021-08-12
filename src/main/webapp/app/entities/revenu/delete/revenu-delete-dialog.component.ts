import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRevenu } from '../revenu.model';
import { RevenuService } from '../service/revenu.service';

@Component({
  templateUrl: './revenu-delete-dialog.component.html',
})
export class RevenuDeleteDialogComponent {
  revenu?: IRevenu;

  constructor(protected revenuService: RevenuService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.revenuService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
