import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAgence } from '../agence.model';
import { AgenceService } from '../service/agence.service';
import { AgenceDeleteDialogComponent } from '../delete/agence-delete-dialog.component';

@Component({
  selector: 'jhi-agence',
  templateUrl: './agence.component.html',
})
export class AgenceComponent implements OnInit {
  agences?: IAgence[];
  isLoading = false;

  constructor(protected agenceService: AgenceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.agenceService.query().subscribe(
      (res: HttpResponse<IAgence[]>) => {
        this.isLoading = false;
        this.agences = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAgence): number {
    return item.id!;
  }

  delete(agence: IAgence): void {
    const modalRef = this.modalService.open(AgenceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.agence = agence;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
