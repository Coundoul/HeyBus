import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFuel, getFuelIdentifier } from '../fuel.model';

export type EntityResponseType = HttpResponse<IFuel>;
export type EntityArrayResponseType = HttpResponse<IFuel[]>;

@Injectable({ providedIn: 'root' })
export class FuelService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/fuels');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(fuel: IFuel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fuel);
    return this.http
      .post<IFuel>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(fuel: IFuel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fuel);
    return this.http
      .put<IFuel>(`${this.resourceUrl}/${getFuelIdentifier(fuel) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(fuel: IFuel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fuel);
    return this.http
      .patch<IFuel>(`${this.resourceUrl}/${getFuelIdentifier(fuel) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFuel>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFuel[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFuelToCollectionIfMissing(fuelCollection: IFuel[], ...fuelsToCheck: (IFuel | null | undefined)[]): IFuel[] {
    const fuels: IFuel[] = fuelsToCheck.filter(isPresent);
    if (fuels.length > 0) {
      const fuelCollectionIdentifiers = fuelCollection.map(fuelItem => getFuelIdentifier(fuelItem)!);
      const fuelsToAdd = fuels.filter(fuelItem => {
        const fuelIdentifier = getFuelIdentifier(fuelItem);
        if (fuelIdentifier == null || fuelCollectionIdentifiers.includes(fuelIdentifier)) {
          return false;
        }
        fuelCollectionIdentifiers.push(fuelIdentifier);
        return true;
      });
      return [...fuelsToAdd, ...fuelCollection];
    }
    return fuelCollection;
  }

  protected convertDateFromClient(fuel: IFuel): IFuel {
    return Object.assign({}, fuel, {
      date: fuel.date?.isValid() ? fuel.date.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((fuel: IFuel) => {
        fuel.date = fuel.date ? dayjs(fuel.date) : undefined;
      });
    }
    return res;
  }
}
