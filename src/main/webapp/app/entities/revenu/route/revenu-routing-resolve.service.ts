import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRevenu, Revenu } from '../revenu.model';
import { RevenuService } from '../service/revenu.service';

@Injectable({ providedIn: 'root' })
export class RevenuRoutingResolveService implements Resolve<IRevenu> {
  constructor(protected service: RevenuService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRevenu> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((revenu: HttpResponse<Revenu>) => {
          if (revenu.body) {
            return of(revenu.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Revenu());
  }
}
