import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { TransporteurComponent } from './list/transporteur.component';
import { TransporteurDetailComponent } from './detail/transporteur-detail.component';
import { TransporteurUpdateComponent } from './update/transporteur-update.component';
import { TransporteurDeleteDialogComponent } from './delete/transporteur-delete-dialog.component';
import { TransporteurRoutingModule } from './route/transporteur-routing.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [SharedModule, TransporteurRoutingModule, MatStepperModule, MatIconModule],
  declarations: [TransporteurComponent, TransporteurDetailComponent, TransporteurUpdateComponent, TransporteurDeleteDialogComponent],
  entryComponents: [TransporteurDeleteDialogComponent],
})
export class TransporteurModule {}
