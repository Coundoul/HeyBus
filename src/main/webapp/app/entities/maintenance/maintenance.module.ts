import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { MaintenanceComponent } from './list/maintenance.component';
import { MaintenanceDetailComponent } from './detail/maintenance-detail.component';
import { MaintenanceUpdateComponent } from './update/maintenance-update.component';
import { MaintenanceDeleteDialogComponent } from './delete/maintenance-delete-dialog.component';
import { MaintenanceRoutingModule } from './route/maintenance-routing.module';
import { SidebarModule } from 'app/layouts/sidebar/sidebar.module';

@NgModule({
  imports: [SharedModule, MaintenanceRoutingModule, SidebarModule],
  declarations: [MaintenanceComponent, MaintenanceDetailComponent, MaintenanceUpdateComponent, MaintenanceDeleteDialogComponent],
  entryComponents: [MaintenanceDeleteDialogComponent],
})
export class MaintenanceModule {}
