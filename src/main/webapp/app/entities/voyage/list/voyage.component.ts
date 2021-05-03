import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVoyage } from '../voyage.model';
import { VoyageService } from '../service/voyage.service';
import { VoyageDeleteDialogComponent } from '../delete/voyage-delete-dialog.component';

@Component({
  selector: 'jhi-voyage',
  templateUrl: './voyage.component.html',
})
export class VoyageComponent implements OnInit {
  voyages?: IVoyage[];
  isLoading = false;

  constructor(protected voyageService: VoyageService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.voyageService.query().subscribe(
      (res: HttpResponse<IVoyage[]>) => {
        this.isLoading = false;
        this.voyages = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IVoyage): number {
    return item.id!;
  }

  delete(voyage: IVoyage): void {
    const modalRef = this.modalService.open(VoyageDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.voyage = voyage;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
