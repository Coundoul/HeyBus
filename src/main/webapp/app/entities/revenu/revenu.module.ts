import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { RevenuComponent } from './list/revenu.component';
import { RevenuDetailComponent } from './detail/revenu-detail.component';
import { RevenuUpdateComponent } from './update/revenu-update.component';
import { RevenuDeleteDialogComponent } from './delete/revenu-delete-dialog.component';
import { RevenuRoutingModule } from './route/revenu-routing.module';

@NgModule({
  imports: [SharedModule, RevenuRoutingModule],
  declarations: [RevenuComponent, RevenuDetailComponent, RevenuUpdateComponent, RevenuDeleteDialogComponent],
  entryComponents: [RevenuDeleteDialogComponent],
})
export class RevenuModule {}
