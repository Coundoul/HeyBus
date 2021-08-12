import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IArret, getArretIdentifier } from '../arret.model';

export type EntityResponseType = HttpResponse<IArret>;
export type EntityArrayResponseType = HttpResponse<IArret[]>;

@Injectable({ providedIn: 'root' })
export class ArretService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/arrets');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(arret: IArret): Observable<EntityResponseType> {
    return this.http.post<IArret>(this.resourceUrl, arret, { observe: 'response' });
  }

  update(arret: IArret): Observable<EntityResponseType> {
    return this.http.put<IArret>(`${this.resourceUrl}/${getArretIdentifier(arret) as number}`, arret, { observe: 'response' });
  }

  partialUpdate(arret: IArret): Observable<EntityResponseType> {
    return this.http.patch<IArret>(`${this.resourceUrl}/${getArretIdentifier(arret) as number}`, arret, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IArret>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IArret[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addArretToCollectionIfMissing(arretCollection: IArret[], ...arretsToCheck: (IArret | null | undefined)[]): IArret[] {
    const arrets: IArret[] = arretsToCheck.filter(isPresent);
    if (arrets.length > 0) {
      const arretCollectionIdentifiers = arretCollection.map(arretItem => getArretIdentifier(arretItem)!);
      const arretsToAdd = arrets.filter(arretItem => {
        const arretIdentifier = getArretIdentifier(arretItem);
        if (arretIdentifier == null || arretCollectionIdentifiers.includes(arretIdentifier)) {
          return false;
        }
        arretCollectionIdentifiers.push(arretIdentifier);
        return true;
      });
      return [...arretsToAdd, ...arretCollection];
    }
    return arretCollection;
  }
}
