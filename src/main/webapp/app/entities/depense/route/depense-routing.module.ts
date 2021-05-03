import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DepenseComponent } from '../list/depense.component';
import { DepenseDetailComponent } from '../detail/depense-detail.component';
import { DepenseUpdateComponent } from '../update/depense-update.component';
import { DepenseRoutingResolveService } from './depense-routing-resolve.service';

const depenseRoute: Routes = [
  {
    path: '',
    component: DepenseComponent,
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DepenseDetailComponent,
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    resolve: {
      depense: DepenseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DepenseUpdateComponent,
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    resolve: {
      depense: DepenseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DepenseUpdateComponent,
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    resolve: {
      depense: DepenseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(depenseRoute)],
  exports: [RouterModule],
})
export class DepenseRoutingModule {}
