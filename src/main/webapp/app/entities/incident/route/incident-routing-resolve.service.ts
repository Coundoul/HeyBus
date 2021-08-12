import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIncident, Incident } from '../incident.model';
import { IncidentService } from '../service/incident.service';

@Injectable({ providedIn: 'root' })
export class IncidentRoutingResolveService implements Resolve<IIncident> {
  constructor(protected service: IncidentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIncident> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((incident: HttpResponse<Incident>) => {
          if (incident.body) {
            return of(incident.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Incident());
  }
}
