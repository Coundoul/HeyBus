import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { EmployeComponent } from './list/employe.component';
import { EmployeDetailComponent } from './detail/employe-detail.component';
import { EmployeUpdateComponent } from './update/employe-update.component';
import { EmployeDeleteDialogComponent } from './delete/employe-delete-dialog.component';
import { EmployeRoutingModule } from './route/employe-routing.module';
import { SidebarModule } from 'app/layouts/sidebar/sidebar.module';

@NgModule({
  imports: [SharedModule, EmployeRoutingModule, SidebarModule],
  declarations: [EmployeComponent, EmployeDetailComponent, EmployeUpdateComponent, EmployeDeleteDialogComponent],
  entryComponents: [EmployeDeleteDialogComponent],
})
export class EmployeModule {}
