import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDepense, getDepenseIdentifier } from '../depense.model';

export type EntityResponseType = HttpResponse<IDepense>;
export type EntityArrayResponseType = HttpResponse<IDepense[]>;

@Injectable({ providedIn: 'root' })
export class DepenseService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/depenses');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(depense: IDepense): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(depense);
    return this.http
      .post<IDepense>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(depense: IDepense): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(depense);
    return this.http
      .put<IDepense>(`${this.resourceUrl}/${getDepenseIdentifier(depense) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(depense: IDepense): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(depense);
    return this.http
      .patch<IDepense>(`${this.resourceUrl}/${getDepenseIdentifier(depense) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDepense>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDepense[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDepenseToCollectionIfMissing(depenseCollection: IDepense[], ...depensesToCheck: (IDepense | null | undefined)[]): IDepense[] {
    const depenses: IDepense[] = depensesToCheck.filter(isPresent);
    if (depenses.length > 0) {
      const depenseCollectionIdentifiers = depenseCollection.map(depenseItem => getDepenseIdentifier(depenseItem)!);
      const depensesToAdd = depenses.filter(depenseItem => {
        const depenseIdentifier = getDepenseIdentifier(depenseItem);
        if (depenseIdentifier == null || depenseCollectionIdentifiers.includes(depenseIdentifier)) {
          return false;
        }
        depenseCollectionIdentifiers.push(depenseIdentifier);
        return true;
      });
      return [...depensesToAdd, ...depenseCollection];
    }
    return depenseCollection;
  }

  protected convertDateFromClient(depense: IDepense): IDepense {
    return Object.assign({}, depense, {
      date: depense.date?.isValid() ? depense.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((depense: IDepense) => {
        depense.date = depense.date ? dayjs(depense.date) : undefined;
      });
    }
    return res;
  }
}
