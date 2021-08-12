import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPays } from '../pays.model';
import { PaysService } from '../service/pays.service';
import { PaysDeleteDialogComponent } from '../delete/pays-delete-dialog.component';

@Component({
  selector: 'jhi-pays',
  templateUrl: './pays.component.html',
})
export class PaysComponent implements OnInit {
  pays?: IPays[];
  isLoading = false;

  constructor(protected paysService: PaysService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.paysService.query().subscribe(
      (res: HttpResponse<IPays[]>) => {
        this.isLoading = false;
        this.pays = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPays): number {
    return item.id!;
  }

  delete(pays: IPays): void {
    const modalRef = this.modalService.open(PaysDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pays = pays;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
