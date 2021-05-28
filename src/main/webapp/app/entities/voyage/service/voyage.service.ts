import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVoyage, getVoyageIdentifier } from '../voyage.model';

export type EntityResponseType = HttpResponse<IVoyage>;
export type EntityArrayResponseType = HttpResponse<IVoyage[]>;

@Injectable({ providedIn: 'root' })
export class VoyageService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/voyages');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(voyage: IVoyage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(voyage);
    return this.http
      .post<IVoyage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(voyage: IVoyage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(voyage);
    return this.http
      .put<IVoyage>(`${this.resourceUrl}/${getVoyageIdentifier(voyage) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(voyage: IVoyage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(voyage);
    return this.http
      .patch<IVoyage>(`${this.resourceUrl}/${getVoyageIdentifier(voyage) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IVoyage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IVoyage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  searchVoyage(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    const date =  String(options.get('date'));
    const  depart =  Number(options.get('depart'));
    const  arrive =  Number(options.get('arrive'));
    const nbrePassagers =  Number(options.get('nbrePassagers'));
    return this.http
      .get<IVoyage[]>(`${this.resourceUrl}/${date}/${depart}/${arrive}/${nbrePassagers}`, { observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVoyageToCollectionIfMissing(voyageCollection: IVoyage[], ...voyagesToCheck: (IVoyage | null | undefined)[]): IVoyage[] {
    const voyages: IVoyage[] = voyagesToCheck.filter(isPresent);
    if (voyages.length > 0) {
      const voyageCollectionIdentifiers = voyageCollection.map(voyageItem => getVoyageIdentifier(voyageItem)!);
      const voyagesToAdd = voyages.filter(voyageItem => {
        const voyageIdentifier = getVoyageIdentifier(voyageItem);
        if (voyageIdentifier == null || voyageCollectionIdentifiers.includes(voyageIdentifier)) {
          return false;
        }
        voyageCollectionIdentifiers.push(voyageIdentifier);
        return true;
      });
      return [...voyagesToAdd, ...voyageCollection];
    }
    return voyageCollection;
  }

  protected convertDateFromClient(voyage: IVoyage): IVoyage {
    return Object.assign({}, voyage, {
      dateDeVoyage: voyage.dateDeVoyage?.isValid() ? voyage.dateDeVoyage.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateDeVoyage = res.body.dateDeVoyage ? dayjs(res.body.dateDeVoyage) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((voyage: IVoyage) => {
        voyage.dateDeVoyage = voyage.dateDeVoyage ? dayjs(voyage.dateDeVoyage) : undefined;
        voyage.dateRetour = voyage.dateRetour ? dayjs(voyage.dateRetour) : undefined;
        voyage.dateArrivee = voyage.dateArrivee ? dayjs(voyage.dateArrivee) : undefined;
      });
    }
    return res;
  }
}