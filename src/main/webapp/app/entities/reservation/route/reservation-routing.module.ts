import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReservationComponent } from '../list/reservation.component';
import { ReservationDetailComponent } from '../detail/reservation-detail.component';
import { ReservationUpdateComponent } from '../update/reservation-update.component';
import { ReservationRoutingResolveService } from './reservation-routing-resolve.service';
import { ReservationVoyageComponent } from '../reserver/reservation-voyage.component';
import { ClientsComponent } from '../list-client-voyage/clients.component';

const reservationRoute: Routes = [
  {
    path: '',
    component: ReservationComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReservationDetailComponent,
    resolve: {
      reservation: ReservationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReservationUpdateComponent,
    resolve: {
      reservation: ReservationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new/voyage/:voyage/passagers/:passagers',
    component: ReservationVoyageComponent,
    resolve: {
      reservation: ReservationRoutingResolveService,
    },
    //canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReservationUpdateComponent,
    resolve: {
      reservation: ReservationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'customer/voyage/:voyage',
    component: ClientsComponent,
    resolve: {
      reservation: ReservationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(reservationRoute)],
  exports: [RouterModule],
})
export class ReservationRoutingModule {}
