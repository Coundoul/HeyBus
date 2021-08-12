import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IIncident } from '../incident.model';
import { IncidentService } from '../service/incident.service';
import { IncidentDeleteDialogComponent } from '../delete/incident-delete-dialog.component';

@Component({
  selector: 'jhi-incident',
  templateUrl: './incident.component.html',
})
export class IncidentComponent implements OnInit {
  incidents?: IIncident[];
  isLoading = false;

  constructor(protected incidentService: IncidentService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.incidentService.query().subscribe(
      (res: HttpResponse<IIncident[]>) => {
        this.isLoading = false;
        this.incidents = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IIncident): number {
    return item.id!;
  }

  delete(incident: IIncident): void {
    const modalRef = this.modalService.open(IncidentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.incident = incident;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
