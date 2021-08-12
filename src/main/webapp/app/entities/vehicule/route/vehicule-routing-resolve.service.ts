import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVehicule, Vehicule } from '../vehicule.model';
import { VehiculeService } from '../service/vehicule.service';

@Injectable({ providedIn: 'root' })
export class VehiculeRoutingResolveService implements Resolve<IVehicule> {
  constructor(protected service: VehiculeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVehicule> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vehicule: HttpResponse<Vehicule>) => {
          if (vehicule.body) {
            return of(vehicule.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Vehicule());
  }
}
