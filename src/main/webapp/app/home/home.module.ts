import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { SearchComponent } from './search/search.component';
import { NpnSliderModule } from 'npn-slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommentComponent } from './comment/comment.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(HOME_ROUTE), NpnSliderModule, MatFormFieldModule, MatSelectModule],

  declarations: [HomeComponent, SearchComponent, CommentComponent],
})
export class HomeModule {}
