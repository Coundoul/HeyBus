import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { SearchComponent } from './search/search.component';
import { NpnSliderModule } from 'npn-slider';


@NgModule({
  imports: [SharedModule, RouterModule.forChild(HOME_ROUTE), NpnSliderModule],
  
  declarations: [HomeComponent, SearchComponent],
})
export class HomeModule {}
