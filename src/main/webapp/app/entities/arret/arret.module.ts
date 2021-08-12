import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ArretComponent } from './list/arret.component';
import { ArretDetailComponent } from './detail/arret-detail.component';
import { ArretUpdateComponent } from './update/arret-update.component';
import { ArretDeleteDialogComponent } from './delete/arret-delete-dialog.component';
import { ArretRoutingModule } from './route/arret-routing.module';

@NgModule({
  imports: [SharedModule, ArretRoutingModule],
  declarations: [ArretComponent, ArretDetailComponent, ArretUpdateComponent, ArretDeleteDialogComponent],
  entryComponents: [ArretDeleteDialogComponent],
})
export class ArretModule {}
