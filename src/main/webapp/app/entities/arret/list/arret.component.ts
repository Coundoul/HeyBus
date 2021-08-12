import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IArret } from '../arret.model';
import { ArretService } from '../service/arret.service';
import { ArretDeleteDialogComponent } from '../delete/arret-delete-dialog.component';

@Component({
  selector: 'jhi-arret',
  templateUrl: './arret.component.html',
})
export class ArretComponent implements OnInit {
  arrets?: IArret[];
  isLoading = false;

  constructor(protected arretService: ArretService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.arretService.query().subscribe(
      (res: HttpResponse<IArret[]>) => {
        this.isLoading = false;
        this.arrets = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IArret): number {
    return item.id!;
  }

  delete(arret: IArret): void {
    const modalRef = this.modalService.open(ArretDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.arret = arret;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
