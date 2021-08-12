import * as dayjs from 'dayjs';
import { IVoyage } from 'app/entities/voyage/voyage.model';
import { ICustomer } from 'app/entities/customer/customer.model';

export interface IReservation {
  id?: number;
  dateDeReservation?: dayjs.Dayjs | null;
  nbrePassagers?: number | null;
  prixReservation?: number | null;
  voyage?: IVoyage | null;
  customer?: ICustomer | null;
}

export class Reservation implements IReservation {
  constructor(
    public id?: number,
    public dateDeReservation?: dayjs.Dayjs | null,
    public nbrePassagers?: number | null,
    public prixReservation?: number | null,
    public voyage?: IVoyage | null,
    public customer?: ICustomer | null
  ) {}
}

export function getReservationIdentifier(reservation: IReservation): number | undefined {
  return reservation.id;
}
