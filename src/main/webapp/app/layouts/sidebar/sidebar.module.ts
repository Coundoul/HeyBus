import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from './sidebar.component';
@NgModule({
    imports: [
        FontAwesomeModule,
        RouterModule
    ],
    declarations: [
        SidebarComponent,
    ],
    exports: [
        SidebarComponent,
    ]
})
export class SidebarModule { }