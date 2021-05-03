import * as dayjs from 'dayjs';
import { IAgence } from 'app/entities/agence/agence.model';

export interface IDepense {
  id?: number;
  date?: dayjs.Dayjs;
  category?: string;
  type?: string;
  montant?: number;
  description?: string | null;
  agences?: IAgence[] | null;
}

export class Depense implements IDepense {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs,
    public category?: string,
    public type?: string,
    public montant?: number,
    public description?: string | null,
    public agences?: IAgence[] | null
  ) {}
}

export function getDepenseIdentifier(depense: IDepense): number | undefined {
  return depense.id;
}
