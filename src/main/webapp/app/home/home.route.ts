import { Route, Routes } from '@angular/router';
import { CommentComponent } from './comment/comment.component';

import { HomeComponent } from './home.component';
import { LocationComponent } from './location/location.component';
import { SearchComponent } from './search/search.component';

export const HOME_ROUTE: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      pageTitle: 'home.title',
    },
  },
  {
    path: 'comment-ça-marche',
    component: CommentComponent,
    data: {
      pageTitle: 'home.comment',
    },
  },
  {
    path: 'louer-un-bus',
    component: LocationComponent,
    data: {
      pageTitle: 'home.louer',
    },
  },
  {
    path: 'search/:date/:depart/:arrive/:nbrePassagers',
    component: SearchComponent,
    data: {
      pageTitle: 'home.search',
      authorities: [],
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'search/:date/:dateRetour/:depart/:arrive/:nbrePassagers',
    component: SearchComponent,
    data: {
      pageTitle: 'home.search',
      authorities: [],
      defaultSort: 'id,asc',
    },
  },
];
