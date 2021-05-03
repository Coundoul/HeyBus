import { IFuel } from 'app/entities/fuel/fuel.model';
import { IIncident } from 'app/entities/incident/incident.model';
import { IMaintenance } from 'app/entities/maintenance/maintenance.model';
import { IVoyage } from 'app/entities/voyage/voyage.model';
import { ITransporteur } from 'app/entities/transporteur/transporteur.model';

export interface IVehicule {
  id?: number;
  reference?: string;
  numChassis?: string | null;
  numCarteGrise?: string | null;
  nbrePlace?: number | null;
  marqueVoiture?: string | null;
  photo?: string | null;
  refcartetotal?: string | null;
  typemoteur?: string | null;
  fuels?: IFuel[] | null;
  incidents?: IIncident[] | null;
  maintenances?: IMaintenance[] | null;
  voyages?: IVoyage[] | null;
  transporteur?: ITransporteur | null;
}

export class Vehicule implements IVehicule {
  constructor(
    public id?: number,
    public reference?: string,
    public numChassis?: string | null,
    public numCarteGrise?: string | null,
    public nbrePlace?: number | null,
    public marqueVoiture?: string | null,
    public photo?: string | null,
    public refcartetotal?: string | null,
    public typemoteur?: string | null,
    public fuels?: IFuel[] | null,
    public incidents?: IIncident[] | null,
    public maintenances?: IMaintenance[] | null,
    public voyages?: IVoyage[] | null,
    public transporteur?: ITransporteur | null
  ) {}
}

export function getVehiculeIdentifier(vehicule: IVehicule): number | undefined {
  return vehicule.id;
}
