import { IVoyage } from 'app/entities/voyage/voyage.model';
import { IArret } from 'app/entities/arret/arret.model';
import { IPays } from 'app/entities/pays/pays.model';

export interface IVille {
  id?: number;
  nom?: string | null;
  codePostal?: string | null;
  departs?: IVoyage[] | null;
  arrives?: IVoyage[] | null;
  nomarret?: IArret | null;
  pays?: IPays | null;
}

export class Ville implements IVille {
  constructor(
    public id?: number,
    public nom?: string | null,
    public codePostal?: string | null,
    public departs?: IVoyage[] | null,
    public arrives?: IVoyage[] | null,
    public nomarret?: IArret | null,
    public pays?: IPays | null
  ) {}
}

export function getVilleIdentifier(ville: IVille): number | undefined {
  return ville.id;
}
