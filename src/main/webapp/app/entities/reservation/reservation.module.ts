import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ReservationComponent } from './list/reservation.component';
import { ReservationDetailComponent } from './detail/reservation-detail.component';
import { ReservationUpdateComponent } from './update/reservation-update.component';
import { ReservationDeleteDialogComponent } from './delete/reservation-delete-dialog.component';
import { ReservationRoutingModule } from './route/reservation-routing.module';
import { ReservationVoyageComponent } from './reserver/reservation-voyage.component';
import { ClientsComponent } from './list-client-voyage/clients.component';

@NgModule({
  imports: [SharedModule, ReservationRoutingModule],
  declarations: [ReservationComponent, ReservationDetailComponent, ReservationUpdateComponent, ReservationDeleteDialogComponent, ReservationVoyageComponent, ClientsComponent],
  entryComponents: [ReservationDeleteDialogComponent],
})
export class ReservationModule {}
