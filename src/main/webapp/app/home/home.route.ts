import { Route, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
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
