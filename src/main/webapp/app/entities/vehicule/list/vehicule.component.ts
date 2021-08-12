import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVehicule } from '../vehicule.model';
import { VehiculeService } from '../service/vehicule.service';
import { VehiculeDeleteDialogComponent } from '../delete/vehicule-delete-dialog.component';

@Component({
  selector: 'jhi-vehicule',
  templateUrl: './vehicule.component.html',
})
export class VehiculeComponent implements OnInit {
  vehicules?: IVehicule[];
  isLoading = false;

  constructor(protected vehiculeService: VehiculeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.vehiculeService.query().subscribe(
      (res: HttpResponse<IVehicule[]>) => {
        this.isLoading = false;
        this.vehicules = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IVehicule): number {
    return item.id!;
  }

  delete(vehicule: IVehicule): void {
    const modalRef = this.modalService.open(VehiculeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.vehicule = vehicule;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
