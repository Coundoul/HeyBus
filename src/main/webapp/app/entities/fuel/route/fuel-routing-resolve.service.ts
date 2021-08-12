import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFuel, Fuel } from '../fuel.model';
import { FuelService } from '../service/fuel.service';

@Injectable({ providedIn: 'root' })
export class FuelRoutingResolveService implements Resolve<IFuel> {
  constructor(protected service: FuelService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFuel> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fuel: HttpResponse<Fuel>) => {
          if (fuel.body) {
            return of(fuel.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Fuel());
  }
}
