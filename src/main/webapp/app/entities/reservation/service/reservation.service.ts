import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReservation, getReservationIdentifier } from '../reservation.model';
import { ICustomer } from 'app/entities/customer/customer.model';

export type EntityResponseType = HttpResponse<IReservation>;
export type EntityArrayResponseType = HttpResponse<IReservation[]>;

@Injectable({ providedIn: 'root' })
export class ReservationService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/reservations');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(reservation: IReservation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reservation);
    return this.http
      .post<IReservation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  createReservation(customer: ICustomer, idVoyage:number, nbrePassagers:number): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(customer);
    return this.http
      .post<ICustomer>(`${this.resourceUrl}/voyage/${idVoyage}/passagers/${nbrePassagers}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  update(reservation: IReservation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reservation);
    return this.http
      .put<IReservation>(`${this.resourceUrl}/${getReservationIdentifier(reservation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(reservation: IReservation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reservation);
    return this.http
      .patch<IReservation>(`${this.resourceUrl}/${getReservationIdentifier(reservation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IReservation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IReservation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  customerVoyage(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    const idVoyage = Number(options.get('voyage'));
    return this.http
      .get<IReservation[]>(`${this.resourceUrl}/customer/voyage/${idVoyage}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addReservationToCollectionIfMissing(
    reservationCollection: IReservation[],
    ...reservationsToCheck: (IReservation | null | undefined)[]
  ): IReservation[] {
    const reservations: IReservation[] = reservationsToCheck.filter(isPresent);
    if (reservations.length > 0) {
      const reservationCollectionIdentifiers = reservationCollection.map(reservationItem => getReservationIdentifier(reservationItem)!);
      const reservationsToAdd = reservations.filter(reservationItem => {
        const reservationIdentifier = getReservationIdentifier(reservationItem);
        if (reservationIdentifier == null || reservationCollectionIdentifiers.includes(reservationIdentifier)) {
          return false;
        }
        reservationCollectionIdentifiers.push(reservationIdentifier);
        return true;
      });
      return [...reservationsToAdd, ...reservationCollection];
    }
    return reservationCollection;
  }

  protected convertDateFromClient(reservation: IReservation): IReservation {
    return Object.assign({}, reservation, {
      dateDeReservation: reservation.dateDeReservation?.isValid() ? reservation.dateDeReservation.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateDeReservation = res.body.dateDeReservation ? dayjs(res.body.dateDeReservation) : undefined;
 
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((reservation: IReservation) => {
        reservation.dateDeReservation = reservation.dateDeReservation ? dayjs(reservation.dateDeReservation) : undefined;
        reservation.voyage!.dateDeVoyage = reservation.voyage?.dateDeVoyage ? dayjs(reservation.voyage?.dateDeVoyage) : undefined;
        reservation.voyage!.dateRetour = reservation.voyage?.dateRetour ? dayjs(reservation.voyage?.dateRetour) : undefined;
        reservation.voyage!.dateArrivee = reservation.voyage?.dateArrivee ? dayjs(reservation.voyage?.dateArrivee) : undefined;
      });
    }
    return res;
  }
}
