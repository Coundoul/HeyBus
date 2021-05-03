import { IVehicule } from 'app/entities/vehicule/vehicule.model';

export interface IIncident {
  id?: number;
  gravite?: string | null;
  chauffeur?: string;
  responsableincident?: string;
  reporteurincident?: string | null;
  vehicule?: IVehicule | null;
}

export class Incident implements IIncident {
  constructor(
    public id?: number,
    public gravite?: string | null,
    public chauffeur?: string,
    public responsableincident?: string,
    public reporteurincident?: string | null,
    public vehicule?: IVehicule | null
  ) {}
}

export function getIncidentIdentifier(incident: IIncident): number | undefined {
  return incident.id;
}
