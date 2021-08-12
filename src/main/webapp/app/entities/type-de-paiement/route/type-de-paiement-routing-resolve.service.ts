import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeDePaiement, TypeDePaiement } from '../type-de-paiement.model';
import { TypeDePaiementService } from '../service/type-de-paiement.service';

@Injectable({ providedIn: 'root' })
export class TypeDePaiementRoutingResolveService implements Resolve<ITypeDePaiement> {
  constructor(protected service: TypeDePaiementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypeDePaiement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typeDePaiement: HttpResponse<TypeDePaiement>) => {
          if (typeDePaiement.body) {
            return of(typeDePaiement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TypeDePaiement());
  }
}
