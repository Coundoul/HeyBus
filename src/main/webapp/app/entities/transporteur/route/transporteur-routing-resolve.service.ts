import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITransporteur, Transporteur } from '../transporteur.model';
import { TransporteurService } from '../service/transporteur.service';

@Injectable({ providedIn: 'root' })
export class TransporteurRoutingResolveService implements Resolve<ITransporteur> {
  constructor(protected service: TransporteurService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITransporteur> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((transporteur: HttpResponse<Transporteur>) => {
          if (transporteur.body) {
            return of(transporteur.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Transporteur());
  }
}
