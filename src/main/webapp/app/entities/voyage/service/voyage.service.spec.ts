import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVoyage, Voyage } from '../voyage.model';

import { VoyageService } from './voyage.service';

describe('Service Tests', () => {
  describe('Voyage Service', () => {
    let service: VoyageService;
    let httpMock: HttpTestingController;
    let elemDefault: IVoyage;
    let expectedResult: IVoyage | IVoyage[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(VoyageService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        dateDeVoyage: currentDate,
        prix: 0,
        nbrePlace: 0,
        adresseDepart: 'AAAAAAA',
        adresseArrive: 'AAAAAAA',
        quartier: 'AAAAAAA',
        description: 'AAAAAAA',
        climatisation: false,
        wifi: false,
        toilette: false,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateDeVoyage: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Voyage', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateDeVoyage: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateDeVoyage: currentDate,
          },
          returnedFromService
        );

        service.create(new Voyage()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Voyage', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateDeVoyage: currentDate.format(DATE_TIME_FORMAT),
            prix: 1,
            nbrePlace: 1,
            adresseDepart: 'BBBBBB',
            adresseArrive: 'BBBBBB',
            quartier: 'BBBBBB',
            description: 'BBBBBB',
            climatisation: true,
            wifi: true,
            toilette: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateDeVoyage: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Voyage', () => {
        const patchObject = Object.assign(
          {
            dateDeVoyage: currentDate.format(DATE_TIME_FORMAT),
            prix: 1,
            adresseDepart: 'BBBBBB',
            climatisation: true,
          },
          new Voyage()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateDeVoyage: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Voyage', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dateDeVoyage: currentDate.format(DATE_TIME_FORMAT),
            prix: 1,
            nbrePlace: 1,
            adresseDepart: 'BBBBBB',
            adresseArrive: 'BBBBBB',
            quartier: 'BBBBBB',
            description: 'BBBBBB',
            climatisation: true,
            wifi: true,
            toilette: true,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateDeVoyage: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Voyage', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addVoyageToCollectionIfMissing', () => {
        it('should add a Voyage to an empty array', () => {
          const voyage: IVoyage = { id: 123 };
          expectedResult = service.addVoyageToCollectionIfMissing([], voyage);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(voyage);
        });

        it('should not add a Voyage to an array that contains it', () => {
          const voyage: IVoyage = { id: 123 };
          const voyageCollection: IVoyage[] = [
            {
              ...voyage,
            },
            { id: 456 },
          ];
          expectedResult = service.addVoyageToCollectionIfMissing(voyageCollection, voyage);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Voyage to an array that doesn't contain it", () => {
          const voyage: IVoyage = { id: 123 };
          const voyageCollection: IVoyage[] = [{ id: 456 }];
          expectedResult = service.addVoyageToCollectionIfMissing(voyageCollection, voyage);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(voyage);
        });

        it('should add only unique Voyage to an array', () => {
          const voyageArray: IVoyage[] = [{ id: 123 }, { id: 456 }, { id: 34134 }];
          const voyageCollection: IVoyage[] = [{ id: 123 }];
          expectedResult = service.addVoyageToCollectionIfMissing(voyageCollection, ...voyageArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const voyage: IVoyage = { id: 123 };
          const voyage2: IVoyage = { id: 456 };
          expectedResult = service.addVoyageToCollectionIfMissing([], voyage, voyage2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(voyage);
          expect(expectedResult).toContain(voyage2);
        });

        it('should accept null and undefined values', () => {
          const voyage: IVoyage = { id: 123 };
          expectedResult = service.addVoyageToCollectionIfMissing([], null, voyage, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(voyage);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
