import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RevenuComponent } from '../list/revenu.component';
import { RevenuDetailComponent } from '../detail/revenu-detail.component';
import { RevenuUpdateComponent } from '../update/revenu-update.component';
import { RevenuRoutingResolveService } from './revenu-routing-resolve.service';

const revenuRoute: Routes = [
  {
    path: '',
    component: RevenuComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RevenuDetailComponent,
    resolve: {
      revenu: RevenuRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RevenuUpdateComponent,
    resolve: {
      revenu: RevenuRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RevenuUpdateComponent,
    resolve: {
      revenu: RevenuRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(revenuRoute)],
  exports: [RouterModule],
})
export class RevenuRoutingModule {}
