import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { VoyageComponent } from './list/voyage.component';
import { VoyageDetailComponent } from './detail/voyage-detail.component';
import { VoyageUpdateComponent } from './update/voyage-update.component';
import { VoyageDeleteDialogComponent } from './delete/voyage-delete-dialog.component';
import { VoyageRoutingModule } from './route/voyage-routing.module';
import { SidebarModule } from 'app/layouts/sidebar/sidebar.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [SharedModule, VoyageRoutingModule, SidebarModule, MatTabsModule, MatStepperModule, MatIconModule],
  declarations: [VoyageComponent, VoyageDetailComponent, VoyageUpdateComponent, VoyageDeleteDialogComponent],
  entryComponents: [VoyageDeleteDialogComponent],
})
export class VoyageModule {}
