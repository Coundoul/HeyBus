import { CommonModule } from '@angular/common';
import { Directive, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HasAnyAuthorityDirective } from 'app/shared/auth/has-any-authority.directive';
import { SharedModule } from 'app/shared/shared.module';
import { SidebarComponent } from './sidebar.component';
@NgModule({
  imports: [SharedModule, FontAwesomeModule, RouterModule, CommonModule],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
})
export class SidebarModule {}
