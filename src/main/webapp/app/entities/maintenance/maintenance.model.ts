import * as dayjs from 'dayjs';
import { IVehicule } from 'app/entities/vehicule/vehicule.model';

export interface IMaintenance {
  id?: number;
  date?: dayjs.Dayjs;
  type?: string | null;
  nbreKmMoteur?: number | null;
  vehicule?: IVehicule | null;
}

export class Maintenance implements IMaintenance {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs,
    public type?: string | null,
    public nbreKmMoteur?: number | null,
    public vehicule?: IVehicule | null
  ) {}
}

export function getMaintenanceIdentifier(maintenance: IMaintenance): number | undefined {
  return maintenance.id;
}
