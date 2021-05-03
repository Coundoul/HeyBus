import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRevenu, getRevenuIdentifier } from '../revenu.model';

export type EntityResponseType = HttpResponse<IRevenu>;
export type EntityArrayResponseType = HttpResponse<IRevenu[]>;

@Injectable({ providedIn: 'root' })
export class RevenuService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/revenus');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(revenu: IRevenu): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(revenu);
    return this.http
      .post<IRevenu>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(revenu: IRevenu): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(revenu);
    return this.http
      .put<IRevenu>(`${this.resourceUrl}/${getRevenuIdentifier(revenu) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(revenu: IRevenu): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(revenu);
    return this.http
      .patch<IRevenu>(`${this.resourceUrl}/${getRevenuIdentifier(revenu) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRevenu>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRevenu[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRevenuToCollectionIfMissing(revenuCollection: IRevenu[], ...revenusToCheck: (IRevenu | null | undefined)[]): IRevenu[] {
    const revenus: IRevenu[] = revenusToCheck.filter(isPresent);
    if (revenus.length > 0) {
      const revenuCollectionIdentifiers = revenuCollection.map(revenuItem => getRevenuIdentifier(revenuItem)!);
      const revenusToAdd = revenus.filter(revenuItem => {
        const revenuIdentifier = getRevenuIdentifier(revenuItem);
        if (revenuIdentifier == null || revenuCollectionIdentifiers.includes(revenuIdentifier)) {
          return false;
        }
        revenuCollectionIdentifiers.push(revenuIdentifier);
        return true;
      });
      return [...revenusToAdd, ...revenuCollection];
    }
    return revenuCollection;
  }

  protected convertDateFromClient(revenu: IRevenu): IRevenu {
    return Object.assign({}, revenu, {
      date: revenu.date?.isValid() ? revenu.date.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((revenu: IRevenu) => {
        revenu.date = revenu.date ? dayjs(revenu.date) : undefined;
      });
    }
    return res;
  }
}
