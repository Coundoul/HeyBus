import { IUser } from 'app/entities/user/user.model';
import { IVoyage } from 'app/entities/voyage/voyage.model';
import { IVehicule } from 'app/entities/vehicule/vehicule.model';
import { IEmploye } from 'app/entities/employe/employe.model';

export interface ITransporteur {
  id?: number;
  nom?: string;
  telephone?: string;
  responsable?: string;
  mail?: string | null;
  adresse?: string;
  logoContentType?: string | null;
  logo?: string | null;
  user?: IUser | null;
  voyages?: IVoyage[] | null;
  vehicules?: IVehicule[] | null;
  employes?: IEmploye[] | null;
}

export class Transporteur implements ITransporteur {
  constructor(
    public id?: number,
    public nom?: string,
    public telephone?: string,
    public responsable?: string,
    public mail?: string | null,
    public adresse?: string,
    public logoContentType?: string | null,
    public logo?: string | null,
    public user?: IUser | null,
    public voyages?: IVoyage[] | null,
    public vehicules?: IVehicule[] | null,
    public employes?: IEmploye[] | null
  ) {}
}

export function getTransporteurIdentifier(transporteur: ITransporteur): number | undefined {
  return transporteur.id;
}
