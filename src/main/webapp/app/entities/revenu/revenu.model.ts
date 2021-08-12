import * as dayjs from 'dayjs';
import { IAgence } from 'app/entities/agence/agence.model';

export interface IRevenu {
  id?: number;
  date?: dayjs.Dayjs;
  type?: string;
  montant?: number;
  description?: string | null;
  agences?: IAgence[] | null;
}

export class Revenu implements IRevenu {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs,
    public type?: string,
    public montant?: number,
    public description?: string | null,
    public agences?: IAgence[] | null
  ) {}
}

export function getRevenuIdentifier(revenu: IRevenu): number | undefined {
  return revenu.id;
}
