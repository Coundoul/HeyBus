import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeDePaiement, getTypeDePaiementIdentifier } from '../type-de-paiement.model';

export type EntityResponseType = HttpResponse<ITypeDePaiement>;
export type EntityArrayResponseType = HttpResponse<ITypeDePaiement[]>;

@Injectable({ providedIn: 'root' })
export class TypeDePaiementService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/type-de-paiements');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(typeDePaiement: ITypeDePaiement): Observable<EntityResponseType> {
    return this.http.post<ITypeDePaiement>(this.resourceUrl, typeDePaiement, { observe: 'response' });
  }

  update(typeDePaiement: ITypeDePaiement): Observable<EntityResponseType> {
    return this.http.put<ITypeDePaiement>(`${this.resourceUrl}/${getTypeDePaiementIdentifier(typeDePaiement) as number}`, typeDePaiement, {
      observe: 'response',
    });
  }

  partialUpdate(typeDePaiement: ITypeDePaiement): Observable<EntityResponseType> {
    return this.http.patch<ITypeDePaiement>(
      `${this.resourceUrl}/${getTypeDePaiementIdentifier(typeDePaiement) as number}`,
      typeDePaiement,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeDePaiement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeDePaiement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypeDePaiementToCollectionIfMissing(
    typeDePaiementCollection: ITypeDePaiement[],
    ...typeDePaiementsToCheck: (ITypeDePaiement | null | undefined)[]
  ): ITypeDePaiement[] {
    const typeDePaiements: ITypeDePaiement[] = typeDePaiementsToCheck.filter(isPresent);
    if (typeDePaiements.length > 0) {
      const typeDePaiementCollectionIdentifiers = typeDePaiementCollection.map(
        typeDePaiementItem => getTypeDePaiementIdentifier(typeDePaiementItem)!
      );
      const typeDePaiementsToAdd = typeDePaiements.filter(typeDePaiementItem => {
        const typeDePaiementIdentifier = getTypeDePaiementIdentifier(typeDePaiementItem);
        if (typeDePaiementIdentifier == null || typeDePaiementCollectionIdentifiers.includes(typeDePaiementIdentifier)) {
          return false;
        }
        typeDePaiementCollectionIdentifiers.push(typeDePaiementIdentifier);
        return true;
      });
      return [...typeDePaiementsToAdd, ...typeDePaiementCollection];
    }
    return typeDePaiementCollection;
  }
}
