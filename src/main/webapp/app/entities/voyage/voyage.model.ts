import * as dayjs from 'dayjs';
import { IReservation } from 'app/entities/reservation/reservation.model';
import { IEmploye } from 'app/entities/employe/employe.model';
import { IArret } from 'app/entities/arret/arret.model';
import { IVehicule } from 'app/entities/vehicule/vehicule.model';
import { IVille } from 'app/entities/ville/ville.model';
import { ITransporteur } from 'app/entities/transporteur/transporteur.model';
import { TypeVoyage } from 'app/entities/enumerations/type-voyage.model';

export interface IVoyage {
  id?: number;
  dateDeVoyage?: dayjs.Dayjs;
  dateRetour?: dayjs.Dayjs | null;
  dateArrivee?: dayjs.Dayjs | null;
  prix?: number | null;
  nbrePlace?: number | null;
  adresseDepart?: string | null;
  adresseArrive?: string | null;
  quartier?: string | null;
  description?: string | null;
  climatisation?: boolean | null;
  wifi?: boolean | null;
  toilette?: boolean | null;
  typeVoyage?: TypeVoyage | null;
  reservations?: IReservation[] | null;
  employes?: IEmploye[] | null;
  arrets?: IArret[] | null;
  vehicule?: IVehicule | null;
  departVille?: IVille | null;
  arriveVille?: IVille | null;
  transporteur?: ITransporteur | null;
}

export class Voyage implements IVoyage {
  constructor(
    public id?: number,
    public dateDeVoyage?: dayjs.Dayjs,
    public dateRetour?: dayjs.Dayjs | null,
    public dateArrivee?: dayjs.Dayjs | null,
    public prix?: number | null,
    public nbrePlace?: number | null,
    public adresseDepart?: string | null,
    public adresseArrive?: string | null,
    public quartier?: string | null,
    public description?: string | null,
    public climatisation?: boolean | null,
    public wifi?: boolean | null,
    public toilette?: boolean | null,
    public typeVoyage?: TypeVoyage | null,
    public reservations?: IReservation[] | null,
    public employes?: IEmploye[] | null,
    public arrets?: IArret[] | null,
    public vehicule?: IVehicule | null,
    public departVille?: IVille | null,
    public arriveVille?: IVille | null,
    public transporteur?: ITransporteur | null
  ) {
    this.climatisation = this.climatisation ?? false;
    this.wifi = this.wifi ?? false;
    this.toilette = this.toilette ?? false;
  }
}

export function getVoyageIdentifier(voyage: IVoyage): number | undefined {
  return voyage.id;
}
