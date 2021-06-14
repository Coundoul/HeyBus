import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { VoyageComponent } from './list/voyage.component';
import { VoyageDetailComponent } from './detail/voyage-detail.component';
import { VoyageUpdateComponent } from './update/voyage-update.component';
import { VoyageDeleteDialogComponent } from './delete/voyage-delete-dialog.component';
import { VoyageRoutingModule } from './route/voyage-routing.module';
import { SidebarModule } from 'app/layouts/sidebar/sidebar.module';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  imports: [SharedModule, VoyageRoutingModule, SidebarModule, MatTabsModule],
  declarations: [VoyageComponent, VoyageDetailComponent, VoyageUpdateComponent, VoyageDeleteDialogComponent],
  entryComponents: [VoyageDeleteDialogComponent],
})
export class VoyageModule {}
