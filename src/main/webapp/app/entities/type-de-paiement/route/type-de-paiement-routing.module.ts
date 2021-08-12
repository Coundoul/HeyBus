import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeDePaiementComponent } from '../list/type-de-paiement.component';
import { TypeDePaiementDetailComponent } from '../detail/type-de-paiement-detail.component';
import { TypeDePaiementUpdateComponent } from '../update/type-de-paiement-update.component';
import { TypeDePaiementRoutingResolveService } from './type-de-paiement-routing-resolve.service';

const typeDePaiementRoute: Routes = [
  {
    path: '',
    component: TypeDePaiementComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeDePaiementDetailComponent,
    resolve: {
      typeDePaiement: TypeDePaiementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeDePaiementUpdateComponent,
    resolve: {
      typeDePaiement: TypeDePaiementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeDePaiementUpdateComponent,
    resolve: {
      typeDePaiement: TypeDePaiementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typeDePaiementRoute)],
  exports: [RouterModule],
})
export class TypeDePaiementRoutingModule {}
