import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IFuel, Fuel } from '../fuel.model';

import { FuelService } from './fuel.service';

describe('Service Tests', () => {
  describe('Fuel Service', () => {
    let service: FuelService;
    let httpMock: HttpTestingController;
    let elemDefault: IFuel;
    let expectedResult: IFuel | IFuel[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FuelService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        typeDeCarburant: 'AAAAAAA',
        date: currentDate,
        km: 0,
        nbLitre: 0,
        montant: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Fuel', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.create(new Fuel()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Fuel', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            typeDeCarburant: 'BBBBBB',
            date: currentDate.format(DATE_FORMAT),
            km: 1,
            nbLitre: 1,
            montant: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Fuel', () => {
        const patchObject = Object.assign(
          {
            typeDeCarburant: 'BBBBBB',
            km: 1,
            nbLitre: 1,
          },
          new Fuel()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Fuel', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            typeDeCarburant: 'BBBBBB',
            date: currentDate.format(DATE_FORMAT),
            km: 1,
            nbLitre: 1,
            montant: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Fuel', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFuelToCollectionIfMissing', () => {
        it('should add a Fuel to an empty array', () => {
          const fuel: IFuel = { id: 123 };
          expectedResult = service.addFuelToCollectionIfMissing([], fuel);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(fuel);
        });

        it('should not add a Fuel to an array that contains it', () => {
          const fuel: IFuel = { id: 123 };
          const fuelCollection: IFuel[] = [
            {
              ...fuel,
            },
            { id: 456 },
          ];
          expectedResult = service.addFuelToCollectionIfMissing(fuelCollection, fuel);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Fuel to an array that doesn't contain it", () => {
          const fuel: IFuel = { id: 123 };
          const fuelCollection: IFuel[] = [{ id: 456 }];
          expectedResult = service.addFuelToCollectionIfMissing(fuelCollection, fuel);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(fuel);
        });

        it('should add only unique Fuel to an array', () => {
          const fuelArray: IFuel[] = [{ id: 123 }, { id: 456 }, { id: 5168 }];
          const fuelCollection: IFuel[] = [{ id: 123 }];
          expectedResult = service.addFuelToCollectionIfMissing(fuelCollection, ...fuelArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const fuel: IFuel = { id: 123 };
          const fuel2: IFuel = { id: 456 };
          expectedResult = service.addFuelToCollectionIfMissing([], fuel, fuel2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(fuel);
          expect(expectedResult).toContain(fuel2);
        });

        it('should accept null and undefined values', () => {
          const fuel: IFuel = { id: 123 };
          expectedResult = service.addFuelToCollectionIfMissing([], null, fuel, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(fuel);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
