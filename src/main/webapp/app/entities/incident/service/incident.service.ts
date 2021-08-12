import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIncident, getIncidentIdentifier } from '../incident.model';

export type EntityResponseType = HttpResponse<IIncident>;
export type EntityArrayResponseType = HttpResponse<IIncident[]>;

@Injectable({ providedIn: 'root' })
export class IncidentService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/incidents');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(incident: IIncident): Observable<EntityResponseType> {
    return this.http.post<IIncident>(this.resourceUrl, incident, { observe: 'response' });
  }

  update(incident: IIncident): Observable<EntityResponseType> {
    return this.http.put<IIncident>(`${this.resourceUrl}/${getIncidentIdentifier(incident) as number}`, incident, { observe: 'response' });
  }

  partialUpdate(incident: IIncident): Observable<EntityResponseType> {
    return this.http.patch<IIncident>(`${this.resourceUrl}/${getIncidentIdentifier(incident) as number}`, incident, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IIncident>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIncident[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addIncidentToCollectionIfMissing(incidentCollection: IIncident[], ...incidentsToCheck: (IIncident | null | undefined)[]): IIncident[] {
    const incidents: IIncident[] = incidentsToCheck.filter(isPresent);
    if (incidents.length > 0) {
      const incidentCollectionIdentifiers = incidentCollection.map(incidentItem => getIncidentIdentifier(incidentItem)!);
      const incidentsToAdd = incidents.filter(incidentItem => {
        const incidentIdentifier = getIncidentIdentifier(incidentItem);
        if (incidentIdentifier == null || incidentCollectionIdentifiers.includes(incidentIdentifier)) {
          return false;
        }
        incidentCollectionIdentifiers.push(incidentIdentifier);
        return true;
      });
      return [...incidentsToAdd, ...incidentCollection];
    }
    return incidentCollection;
  }
}
