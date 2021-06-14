import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FuelComponent } from './list/fuel.component';
import { FuelDetailComponent } from './detail/fuel-detail.component';
import { FuelUpdateComponent } from './update/fuel-update.component';
import { FuelDeleteDialogComponent } from './delete/fuel-delete-dialog.component';
import { FuelRoutingModule } from './route/fuel-routing.module';
import { SidebarModule } from 'app/layouts/sidebar/sidebar.module';

@NgModule({
  imports: [SharedModule, FuelRoutingModule, SidebarModule],
  declarations: [FuelComponent, FuelDetailComponent, FuelUpdateComponent, FuelDeleteDialogComponent],
  entryComponents: [FuelDeleteDialogComponent],
})
export class FuelModule {}
