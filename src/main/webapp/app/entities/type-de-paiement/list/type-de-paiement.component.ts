import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeDePaiement } from '../type-de-paiement.model';
import { TypeDePaiementService } from '../service/type-de-paiement.service';
import { TypeDePaiementDeleteDialogComponent } from '../delete/type-de-paiement-delete-dialog.component';

@Component({
  selector: 'jhi-type-de-paiement',
  templateUrl: './type-de-paiement.component.html',
})
export class TypeDePaiementComponent implements OnInit {
  typeDePaiements?: ITypeDePaiement[];
  isLoading = false;

  constructor(protected typeDePaiementService: TypeDePaiementService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.typeDePaiementService.query().subscribe(
      (res: HttpResponse<ITypeDePaiement[]>) => {
        this.isLoading = false;
        this.typeDePaiements = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITypeDePaiement): number {
    return item.id!;
  }

  delete(typeDePaiement: ITypeDePaiement): void {
    const modalRef = this.modalService.open(TypeDePaiementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.typeDePaiement = typeDePaiement;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
