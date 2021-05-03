import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FuelComponent } from './list/fuel.component';
import { FuelDetailComponent } from './detail/fuel-detail.component';
import { FuelUpdateComponent } from './update/fuel-update.component';
import { FuelDeleteDialogComponent } from './delete/fuel-delete-dialog.component';
import { FuelRoutingModule } from './route/fuel-routing.module';

@NgModule({
  imports: [SharedModule, FuelRoutingModule],
  declarations: [FuelComponent, FuelDetailComponent, FuelUpdateComponent, FuelDeleteDialogComponent],
  entryComponents: [FuelDeleteDialogComponent],
})
export class FuelModule {}
