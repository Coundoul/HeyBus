import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMaintenance } from '../maintenance.model';
import { MaintenanceService } from '../service/maintenance.service';
import { MaintenanceDeleteDialogComponent } from '../delete/maintenance-delete-dialog.component';

@Component({
  selector: 'jhi-maintenance',
  templateUrl: './maintenance.component.html',
})
export class MaintenanceComponent implements OnInit {
  maintenances?: IMaintenance[];
  isLoading = false;

  constructor(protected maintenanceService: MaintenanceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.maintenanceService.query().subscribe(
      (res: HttpResponse<IMaintenance[]>) => {
        this.isLoading = false;
        this.maintenances = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMaintenance): number {
    return item.id!;
  }

  delete(maintenance: IMaintenance): void {
    const modalRef = this.modalService.open(MaintenanceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.maintenance = maintenance;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
