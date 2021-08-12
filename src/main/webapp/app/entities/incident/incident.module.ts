import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { IncidentComponent } from './list/incident.component';
import { IncidentDetailComponent } from './detail/incident-detail.component';
import { IncidentUpdateComponent } from './update/incident-update.component';
import { IncidentDeleteDialogComponent } from './delete/incident-delete-dialog.component';
import { IncidentRoutingModule } from './route/incident-routing.module';

@NgModule({
  imports: [SharedModule, IncidentRoutingModule],
  declarations: [IncidentComponent, IncidentDetailComponent, IncidentUpdateComponent, IncidentDeleteDialogComponent],
  entryComponents: [IncidentDeleteDialogComponent],
})
export class IncidentModule {}
