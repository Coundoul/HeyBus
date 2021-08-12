import { IVille } from 'app/entities/ville/ville.model';

export interface IPays {
  id?: number;
  nom?: string | null;
  code?: string | null;
  indicatif?: string | null;
  capitale?: string | null;
  currency?: string | null;
  villes?: IVille[] | null;
}

export class Pays implements IPays {
  constructor(
    public id?: number,
    public nom?: string | null,
    public code?: string | null,
    public indicatif?: string | null,
    public capitale?: string | null,
    public currency?: string | null,
    public villes?: IVille[] | null
  ) {}
}

export function getPaysIdentifier(pays: IPays): number | undefined {
  return pays.id;
}
