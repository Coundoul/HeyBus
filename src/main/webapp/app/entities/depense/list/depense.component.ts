import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDepense } from '../depense.model';
import { DepenseService } from '../service/depense.service';
import { DepenseDeleteDialogComponent } from '../delete/depense-delete-dialog.component';

@Component({
  selector: 'jhi-depense',
  templateUrl: './depense.component.html',
})
export class DepenseComponent implements OnInit {
  depenses?: IDepense[];
  isLoading = false;

  constructor(protected depenseService: DepenseService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.depenseService.query().subscribe(
      (res: HttpResponse<IDepense[]>) => {
        this.isLoading = false;
        this.depenses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDepense): number {
    return item.id!;
  }

  delete(depense: IDepense): void {
    const modalRef = this.modalService.open(DepenseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.depense = depense;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
