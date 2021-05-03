import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITransporteur, getTransporteurIdentifier } from '../transporteur.model';

export type EntityResponseType = HttpResponse<ITransporteur>;
export type EntityArrayResponseType = HttpResponse<ITransporteur[]>;

@Injectable({ providedIn: 'root' })
export class TransporteurService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/transporteurs');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(transporteur: ITransporteur): Observable<EntityResponseType> {
    return this.http.post<ITransporteur>(this.resourceUrl, transporteur, { observe: 'response' });
  }

  update(transporteur: ITransporteur): Observable<EntityResponseType> {
    return this.http.put<ITransporteur>(`${this.resourceUrl}/${getTransporteurIdentifier(transporteur) as number}`, transporteur, {
      observe: 'response',
    });
  }

  partialUpdate(transporteur: ITransporteur): Observable<EntityResponseType> {
    return this.http.patch<ITransporteur>(`${this.resourceUrl}/${getTransporteurIdentifier(transporteur) as number}`, transporteur, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITransporteur>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITransporteur[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTransporteurToCollectionIfMissing(
    transporteurCollection: ITransporteur[],
    ...transporteursToCheck: (ITransporteur | null | undefined)[]
  ): ITransporteur[] {
    const transporteurs: ITransporteur[] = transporteursToCheck.filter(isPresent);
    if (transporteurs.length > 0) {
      const transporteurCollectionIdentifiers = transporteurCollection.map(
        transporteurItem => getTransporteurIdentifier(transporteurItem)!
      );
      const transporteursToAdd = transporteurs.filter(transporteurItem => {
        const transporteurIdentifier = getTransporteurIdentifier(transporteurItem);
        if (transporteurIdentifier == null || transporteurCollectionIdentifiers.includes(transporteurIdentifier)) {
          return false;
        }
        transporteurCollectionIdentifiers.push(transporteurIdentifier);
        return true;
      });
      return [...transporteursToAdd, ...transporteurCollection];
    }
    return transporteurCollection;
  }
}
