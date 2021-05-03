import * as dayjs from 'dayjs';
import { IPosition } from 'app/entities/position/position.model';
import { ITransporteur } from 'app/entities/transporteur/transporteur.model';
import { IVoyage } from 'app/entities/voyage/voyage.model';
import { Matrimoniale } from 'app/entities/enumerations/matrimoniale.model';

export interface IEmploye {
  id?: number;
  nom?: string | null;
  prenom?: string | null;
  dateNaissance?: dayjs.Dayjs | null;
  matrimoniale?: Matrimoniale | null;
  telephone?: string;
  nbreEnfant?: number | null;
  photo?: string | null;
  account?: boolean | null;
  position?: IPosition;
  transporteur?: ITransporteur | null;
  voyages?: IVoyage[] | null;
}

export class Employe implements IEmploye {
  constructor(
    public id?: number,
    public nom?: string | null,
    public prenom?: string | null,
    public dateNaissance?: dayjs.Dayjs | null,
    public matrimoniale?: Matrimoniale | null,
    public telephone?: string,
    public nbreEnfant?: number | null,
    public photo?: string | null,
    public account?: boolean | null,
    public position?: IPosition,
    public transporteur?: ITransporteur | null,
    public voyages?: IVoyage[] | null
  ) {
    this.account = this.account ?? false;
  }
}

export function getEmployeIdentifier(employe: IEmploye): number | undefined {
  return employe.id;
}
