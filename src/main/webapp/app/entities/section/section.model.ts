import { IPosition } from 'app/entities/position/position.model';

export interface ISection {
  id?: number;
  nom?: string;
  description?: string | null;
  reference?: string | null;
  niveau?: string | null;
  positions?: IPosition[] | null;
}

export class Section implements ISection {
  constructor(
    public id?: number,
    public nom?: string,
    public description?: string | null,
    public reference?: string | null,
    public niveau?: string | null,
    public positions?: IPosition[] | null
  ) {}
}

export function getSectionIdentifier(section: ISection): number | undefined {
  return section.id;
}
