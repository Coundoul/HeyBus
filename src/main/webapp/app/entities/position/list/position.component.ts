import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPosition } from '../position.model';
import { PositionService } from '../service/position.service';
import { PositionDeleteDialogComponent } from '../delete/position-delete-dialog.component';

@Component({
  selector: 'jhi-position',
  templateUrl: './position.component.html',
})
export class PositionComponent implements OnInit {
  positions?: IPosition[];
  isLoading = false;

  constructor(protected positionService: PositionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.positionService.query().subscribe(
      (res: HttpResponse<IPosition[]>) => {
        this.isLoading = false;
        this.positions = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPosition): number {
    return item.id!;
  }

  delete(position: IPosition): void {
    const modalRef = this.modalService.open(PositionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.position = position;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
