import { Route, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { SearchComponent } from './search/search.component';

export const HOME_ROUTE: Routes =[
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
      pageTitle: 'home.title',
      authorities:[]
    },
  }
];

