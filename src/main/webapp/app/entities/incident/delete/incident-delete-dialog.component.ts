import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IIncident } from '../incident.model';
import { IncidentService } from '../service/incident.service';

@Component({
  templateUrl: './incident-delete-dialog.component.html',
})
export class IncidentDeleteDialogComponent {
  incident?: IIncident;

  constructor(protected incidentService: IncidentService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.incidentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
