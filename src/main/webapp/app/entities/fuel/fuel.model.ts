import * as dayjs from 'dayjs';
import { IVehicule } from 'app/entities/vehicule/vehicule.model';

export interface IFuel {
  id?: number;
  typeDeCarburant?: string;
  date?: dayjs.Dayjs;
  km?: number;
  nbLitre?: number;
  montant?: number;
  vehicule?: IVehicule;
}

export class Fuel implements IFuel {
  constructor(
    public id?: number,
    public typeDeCarburant?: string,
    public date?: dayjs.Dayjs,
    public km?: number,
    public nbLitre?: number,
    public montant?: number,
    public vehicule?: IVehicule
  ) {}
}

export function getFuelIdentifier(fuel: IFuel): number | undefined {
  return fuel.id;
}
