import * as dayjs from 'dayjs';
import { ITransporteur } from 'app/entities/transporteur/transporteur.model';

export interface IPhoto {
  id?: number;
  title?: string | null;
  imageContentType?: string;
  image?: string;
  uploaded?: dayjs.Dayjs | null;
  transporteur?: ITransporteur | null;
}

export class Photo implements IPhoto {
  constructor(
    public id?: number,
    public title?: string | null,
    public imageContentType?: string,
    public image?: string,
    public uploaded?: dayjs.Dayjs | null,
    public transporteur?: ITransporteur | null
  ) {}
}

export function getPhotoIdentifier(photo: IPhoto): number | undefined {
  return photo.id;
}
