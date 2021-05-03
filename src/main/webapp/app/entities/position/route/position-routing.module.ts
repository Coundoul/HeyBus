import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PositionComponent } from '../list/position.component';
import { PositionDetailComponent } from '../detail/position-detail.component';
import { PositionUpdateComponent } from '../update/position-update.component';
import { PositionRoutingResolveService } from './position-routing-resolve.service';

const positionRoute: Routes = [
  {
    path: '',
    component: PositionComponent,
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PositionDetailComponent,
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    resolve: {
      position: PositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PositionUpdateComponent,
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    resolve: {
      position: PositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PositionUpdateComponent,
    data: {
      authorities: ['ROLE_ADMIN'],
    },
    resolve: {
      position: PositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(positionRoute)],
  exports: [RouterModule],
})
export class PositionRoutingModule {}
