import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReservationComponent } from '../list/reservation.component';
import { ReservationDetailComponent } from '../detail/reservation-detail.component';
import { ReservationUpdateComponent } from '../update/reservation-update.component';
import { ReservationRoutingResolveService } from './reservation-routing-resolve.service';
import { ReservationVoyageComponent } from '../reserver/reservation-voyage.component';
import { ClientsComponent } from '../list-client-voyage/clients.component';
import { ReservationSuccessComponent } from '../reserver-success/reservation-success.component';
import { ReservationPaiementComponent } from '../reserver-paiement/reservation-paiement.component';
import { ReservationOrangeComponent } from '../reserver-orange/reservation-orange.component';
import { ReservationTransporteurComponent } from '../reserver-transporteur/reservation-transporteur.component';

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
    path: 'transporteur/new/:voyage/voyage',
    component: ReservationTransporteurComponent,
    resolve: {
      reservation: ReservationRoutingResolveService,
    },
    //canActivate: [UserRouteAccessService],
  },
  {
    path: 'success/voyage/:voyage',
    component: ReservationSuccessComponent,
    resolve: {
      reservation: ReservationRoutingResolveService,
    },
    //canActivate: [UserRouteAccessService],
  },
  {
    path: 'paiement/voyage/:voyage',
    component: ReservationPaiementComponent,
    resolve: {
      reservation: ReservationRoutingResolveService,
    },
    //canActivate: [UserRouteAccessService],
  },
  {
    path: 'paiement-orange/:voyage',
    component: ReservationOrangeComponent,
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
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(reservationRoute)],
  exports: [RouterModule],
})
export class ReservationRoutingModule {}
