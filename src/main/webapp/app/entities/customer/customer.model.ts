import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IReservation } from 'app/entities/reservation/reservation.model';

export interface ICustomer {
  id?: number;
  nom?: string | null;
  prenom?: string | null;
  telephone?: string;
  email?: string | null;
  profession?: string | null;
  datenaissance?: dayjs.Dayjs | null;
  dateprisecontact?: dayjs.Dayjs | null;
  adresse?: string | null;
  user?: IUser | null;
  reservations?: IReservation[] | null;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public nom?: string | null,
    public prenom?: string | null,
    public telephone?: string,
    public email?: string | null,
    public profession?: string | null,
    public datenaissance?: dayjs.Dayjs | null,
    public dateprisecontact?: dayjs.Dayjs | null,
    public adresse?: string | null,
    public user?: IUser | null,
    public reservations?: IReservation[] | null
  ) {}
}

export function getCustomerIdentifier(customer: ICustomer): number | undefined {
  return customer.id;
}
