import { IEmploye } from 'app/entities/employe/employe.model';
import { ISection } from 'app/entities/section/section.model';

export interface IPosition {
  id?: number;
  nom?: string;
  description?: string | null;
  reference?: string | null;
  niveau?: string | null;
  employes?: IEmploye[] | null;
  section?: ISection | null;
}

export class Position implements IPosition {
  constructor(
    public id?: number,
    public nom?: string,
    public description?: string | null,
    public reference?: string | null,
    public niveau?: string | null,
    public employes?: IEmploye[] | null,
    public section?: ISection | null
  ) {}
}

export function getPositionIdentifier(position: IPosition): number | undefined {
  return position.id;
}
