import { IVille } from 'app/entities/ville/ville.model';
import { IVoyage } from 'app/entities/voyage/voyage.model';

export interface IArret {
  id?: number;
  description?: string | null;
  nomarretVille?: IVille | null;
  voyages?: IVoyage[] | null;
}

export class Arret implements IArret {
  constructor(
    public id?: number,
    public description?: string | null,
    public nomarretVille?: IVille | null,
    public voyages?: IVoyage[] | null
  ) {}
}

export function getArretIdentifier(arret: IArret): number | undefined {
  return arret.id;
}
