import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ArretComponent } from '../list/arret.component';
import { ArretDetailComponent } from '../detail/arret-detail.component';
import { ArretUpdateComponent } from '../update/arret-update.component';
import { ArretRoutingResolveService } from './arret-routing-resolve.service';

const arretRoute: Routes = [
  {
    path: '',
    component: ArretComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ArretDetailComponent,
    resolve: {
      arret: ArretRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ArretUpdateComponent,
    resolve: {
      arret: ArretRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ArretUpdateComponent,
    resolve: {
      arret: ArretRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(arretRoute)],
  exports: [RouterModule],
})
export class ArretRoutingModule {}
