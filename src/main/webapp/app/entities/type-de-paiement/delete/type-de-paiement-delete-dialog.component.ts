import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeDePaiement } from '../type-de-paiement.model';
import { TypeDePaiementService } from '../service/type-de-paiement.service';

@Component({
  templateUrl: './type-de-paiement-delete-dialog.component.html',
})
export class TypeDePaiementDeleteDialogComponent {
  typeDePaiement?: ITypeDePaiement;

  constructor(protected typeDePaiementService: TypeDePaiementService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeDePaiementService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
