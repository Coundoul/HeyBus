import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFuel } from '../fuel.model';
import { FuelService } from '../service/fuel.service';
import { FuelDeleteDialogComponent } from '../delete/fuel-delete-dialog.component';

@Component({
  selector: 'jhi-fuel',
  templateUrl: './fuel.component.html',
})
export class FuelComponent implements OnInit {
  fuels?: IFuel[];
  isLoading = false;

  constructor(protected fuelService: FuelService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.fuelService.query().subscribe(
      (res: HttpResponse<IFuel[]>) => {
        this.isLoading = false;
        this.fuels = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFuel): number {
    return item.id!;
  }

  delete(fuel: IFuel): void {
    const modalRef = this.modalService.open(FuelDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fuel = fuel;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
