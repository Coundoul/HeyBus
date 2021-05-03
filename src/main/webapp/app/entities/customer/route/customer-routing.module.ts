import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CustomerComponent } from '../list/customer.component';
import { CustomerDetailComponent } from '../detail/customer-detail.component';
import { CustomerUpdateComponent } from '../update/customer-update.component';
import { CustomerRoutingResolveService } from './customer-routing-resolve.service';

const customerRoute: Routes = [
  {
    path: '',
    component: CustomerComponent,
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CustomerDetailComponent,
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_TRANSPORTEUR'],
    },
    resolve: {
      customer: CustomerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CustomerUpdateComponent,
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_USER'],
    },
    resolve: {
      customer: CustomerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CustomerUpdateComponent,
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_USER'],
    },
    resolve: {
      customer: CustomerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(customerRoute)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
