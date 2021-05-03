import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVoyage, Voyage } from '../voyage.model';
import { VoyageService } from '../service/voyage.service';

@Injectable({ providedIn: 'root' })
export class VoyageRoutingResolveService implements Resolve<IVoyage> {
  constructor(protected service: VoyageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVoyage> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((voyage: HttpResponse<Voyage>) => {
          if (voyage.body) {
            return of(voyage.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Voyage());
  }
}
