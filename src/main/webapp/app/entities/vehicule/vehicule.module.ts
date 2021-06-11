import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { VehiculeComponent } from './list/vehicule.component';
import { VehiculeDetailComponent } from './detail/vehicule-detail.component';
import { VehiculeUpdateComponent } from './update/vehicule-update.component';
import { VehiculeDeleteDialogComponent } from './delete/vehicule-delete-dialog.component';
import { VehiculeRoutingModule } from './route/vehicule-routing.module';
import { SidebarModule } from 'app/layouts/sidebar/sidebar.module';

@NgModule({
  imports: [SharedModule, VehiculeRoutingModule, SidebarModule],
  declarations: [VehiculeComponent, VehiculeDetailComponent, VehiculeUpdateComponent, VehiculeDeleteDialogComponent],
  entryComponents: [VehiculeDeleteDialogComponent],
})
export class VehiculeModule {}
