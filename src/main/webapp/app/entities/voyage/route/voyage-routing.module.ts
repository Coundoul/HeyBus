import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VoyageComponent } from '../list/voyage.component';
import { VoyageDetailComponent } from '../detail/voyage-detail.component';
import { VoyageUpdateComponent } from '../update/voyage-update.component';
import { VoyageRoutingResolveService } from './voyage-routing-resolve.service';

const voyageRoute: Routes = [
  {
    path: '',
    component: VoyageComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VoyageDetailComponent,
    resolve: {
      voyage: VoyageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VoyageUpdateComponent,
    resolve: {
      voyage: VoyageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VoyageUpdateComponent,
    resolve: {
      voyage: VoyageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(voyageRoute)],
  exports: [RouterModule],
})
export class VoyageRoutingModule {}
