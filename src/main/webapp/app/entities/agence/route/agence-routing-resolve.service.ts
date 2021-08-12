import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAgence, Agence } from '../agence.model';
import { AgenceService } from '../service/agence.service';

@Injectable({ providedIn: 'root' })
export class AgenceRoutingResolveService implements Resolve<IAgence> {
  constructor(protected service: AgenceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAgence> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((agence: HttpResponse<Agence>) => {
          if (agence.body) {
            return of(agence.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Agence());
  }
}
