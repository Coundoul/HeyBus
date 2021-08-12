import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRevenu } from '../revenu.model';
import { RevenuService } from '../service/revenu.service';
import { RevenuDeleteDialogComponent } from '../delete/revenu-delete-dialog.component';

@Component({
  selector: 'jhi-revenu',
  templateUrl: './revenu.component.html',
})
export class RevenuComponent implements OnInit {
  revenus?: IRevenu[];
  isLoading = false;

  constructor(protected revenuService: RevenuService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.revenuService.query().subscribe(
      (res: HttpResponse<IRevenu[]>) => {
        this.isLoading = false;
        this.revenus = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRevenu): number {
    return item.id!;
  }

  delete(revenu: IRevenu): void {
    const modalRef = this.modalService.open(RevenuDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.revenu = revenu;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
