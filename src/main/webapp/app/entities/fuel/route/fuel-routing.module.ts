import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FuelComponent } from '../list/fuel.component';
import { FuelDetailComponent } from '../detail/fuel-detail.component';
import { FuelUpdateComponent } from '../update/fuel-update.component';
import { FuelRoutingResolveService } from './fuel-routing-resolve.service';

const fuelRoute: Routes = [
  {
    path: '',
    component: FuelComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FuelDetailComponent,
    resolve: {
      fuel: FuelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FuelUpdateComponent,
    resolve: {
      fuel: FuelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FuelUpdateComponent,
    resolve: {
      fuel: FuelRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fuelRoute)],
  exports: [RouterModule],
})
export class FuelRoutingModule {}
