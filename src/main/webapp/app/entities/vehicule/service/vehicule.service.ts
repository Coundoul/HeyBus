import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVehicule, getVehiculeIdentifier } from '../vehicule.model';

export type EntityResponseType = HttpResponse<IVehicule>;
export type EntityArrayResponseType = HttpResponse<IVehicule[]>;

@Injectable({ providedIn: 'root' })
export class VehiculeService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/vehicules');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(vehicule: IVehicule): Observable<EntityResponseType> {
    return this.http.post<IVehicule>(this.resourceUrl, vehicule, { observe: 'response' });
  }

  update(vehicule: IVehicule): Observable<EntityResponseType> {
    return this.http.put<IVehicule>(`${this.resourceUrl}/${getVehiculeIdentifier(vehicule) as number}`, vehicule, { observe: 'response' });
  }

  partialUpdate(vehicule: IVehicule): Observable<EntityResponseType> {
    return this.http.patch<IVehicule>(`${this.resourceUrl}/${getVehiculeIdentifier(vehicule) as number}`, vehicule, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVehicule>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVehicule[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVehiculeToCollectionIfMissing(vehiculeCollection: IVehicule[], ...vehiculesToCheck: (IVehicule | null | undefined)[]): IVehicule[] {
    const vehicules: IVehicule[] = vehiculesToCheck.filter(isPresent);
    if (vehicules.length > 0) {
      const vehiculeCollectionIdentifiers = vehiculeCollection.map(vehiculeItem => getVehiculeIdentifier(vehiculeItem)!);
      const vehiculesToAdd = vehicules.filter(vehiculeItem => {
        const vehiculeIdentifier = getVehiculeIdentifier(vehiculeItem);
        if (vehiculeIdentifier == null || vehiculeCollectionIdentifiers.includes(vehiculeIdentifier)) {
          return false;
        }
        vehiculeCollectionIdentifiers.push(vehiculeIdentifier);
        return true;
      });
      return [...vehiculesToAdd, ...vehiculeCollection];
    }
    return vehiculeCollection;
  }
}
