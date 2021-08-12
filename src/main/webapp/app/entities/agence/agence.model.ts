import { IRevenu } from 'app/entities/revenu/revenu.model';
import { IDepense } from 'app/entities/depense/depense.model';

export interface IAgence {
  id?: number;
  nom?: string | null;
  telephone?: string;
  responsable?: string | null;
  revenu?: IRevenu | null;
  depense?: IDepense | null;
}

export class Agence implements IAgence {
  constructor(
    public id?: number,
    public nom?: string | null,
    public telephone?: string,
    public responsable?: string | null,
    public revenu?: IRevenu | null,
    public depense?: IDepense | null
  ) {}
}

export function getAgenceIdentifier(agence: IAgence): number | undefined {
  return agence.id;
}
