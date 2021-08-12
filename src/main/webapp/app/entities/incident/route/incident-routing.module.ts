import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IncidentComponent } from '../list/incident.component';
import { IncidentDetailComponent } from '../detail/incident-detail.component';
import { IncidentUpdateComponent } from '../update/incident-update.component';
import { IncidentRoutingResolveService } from './incident-routing-resolve.service';

const incidentRoute: Routes = [
  {
    path: '',
    component: IncidentComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IncidentDetailComponent,
    resolve: {
      incident: IncidentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IncidentUpdateComponent,
    resolve: {
      incident: IncidentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IncidentUpdateComponent,
    resolve: {
      incident: IncidentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(incidentRoute)],
  exports: [RouterModule],
})
export class IncidentRoutingModule {}
