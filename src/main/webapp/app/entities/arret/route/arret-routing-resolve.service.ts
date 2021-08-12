import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IArret, Arret } from '../arret.model';
import { ArretService } from '../service/arret.service';

@Injectable({ providedIn: 'root' })
export class ArretRoutingResolveService implements Resolve<IArret> {
  constructor(protected service: ArretService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IArret> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((arret: HttpResponse<Arret>) => {
          if (arret.body) {
            return of(arret.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Arret());
  }
}
