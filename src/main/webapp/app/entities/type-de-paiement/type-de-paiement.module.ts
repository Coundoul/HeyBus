import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { TypeDePaiementComponent } from './list/type-de-paiement.component';
import { TypeDePaiementDetailComponent } from './detail/type-de-paiement-detail.component';
import { TypeDePaiementUpdateComponent } from './update/type-de-paiement-update.component';
import { TypeDePaiementDeleteDialogComponent } from './delete/type-de-paiement-delete-dialog.component';
import { TypeDePaiementRoutingModule } from './route/type-de-paiement-routing.module';

@NgModule({
  imports: [SharedModule, TypeDePaiementRoutingModule],
  declarations: [
    TypeDePaiementComponent,
    TypeDePaiementDetailComponent,
    TypeDePaiementUpdateComponent,
    TypeDePaiementDeleteDialogComponent,
  ],
  entryComponents: [TypeDePaiementDeleteDialogComponent],
})
export class TypeDePaiementModule {}
