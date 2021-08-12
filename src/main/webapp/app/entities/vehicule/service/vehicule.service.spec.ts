import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVehicule, Vehicule } from '../vehicule.model';

import { VehiculeService } from './vehicule.service';

describe('Service Tests', () => {
  describe('Vehicule Service', () => {
    let service: VehiculeService;
    let httpMock: HttpTestingController;
    let elemDefault: IVehicule;
    let expectedResult: IVehicule | IVehicule[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(VehiculeService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        reference: 'AAAAAAA',
        numChassis: 'AAAAAAA',
        numCarteGrise: 'AAAAAAA',
        nbrePlace: 0,
        marqueVoiture: 'AAAAAAA',
        photo: 'AAAAAAA',
        refcartetotal: 'AAAAAAA',
        typemoteur: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Vehicule', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Vehicule()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Vehicule', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            reference: 'BBBBBB',
            numChassis: 'BBBBBB',
            numCarteGrise: 'BBBBBB',
            nbrePlace: 1,
            marqueVoiture: 'BBBBBB',
            photo: 'BBBBBB',
            refcartetotal: 'BBBBBB',
            typemoteur: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Vehicule', () => {
        const patchObject = Object.assign(
          {
            nbrePlace: 1,
            marqueVoiture: 'BBBBBB',
            photo: 'BBBBBB',
            refcartetotal: 'BBBBBB',
            typemoteur: 'BBBBBB',
          },
          new Vehicule()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Vehicule', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            reference: 'BBBBBB',
            numChassis: 'BBBBBB',
            numCarteGrise: 'BBBBBB',
            nbrePlace: 1,
            marqueVoiture: 'BBBBBB',
            photo: 'BBBBBB',
            refcartetotal: 'BBBBBB',
            typemoteur: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Vehicule', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addVehiculeToCollectionIfMissing', () => {
        it('should add a Vehicule to an empty array', () => {
          const vehicule: IVehicule = { id: 123 };
          expectedResult = service.addVehiculeToCollectionIfMissing([], vehicule);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(vehicule);
        });

        it('should not add a Vehicule to an array that contains it', () => {
          const vehicule: IVehicule = { id: 123 };
          const vehiculeCollection: IVehicule[] = [
            {
              ...vehicule,
            },
            { id: 456 },
          ];
          expectedResult = service.addVehiculeToCollectionIfMissing(vehiculeCollection, vehicule);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Vehicule to an array that doesn't contain it", () => {
          const vehicule: IVehicule = { id: 123 };
          const vehiculeCollection: IVehicule[] = [{ id: 456 }];
          expectedResult = service.addVehiculeToCollectionIfMissing(vehiculeCollection, vehicule);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(vehicule);
        });

        it('should add only unique Vehicule to an array', () => {
          const vehiculeArray: IVehicule[] = [{ id: 123 }, { id: 456 }, { id: 83979 }];
          const vehiculeCollection: IVehicule[] = [{ id: 123 }];
          expectedResult = service.addVehiculeToCollectionIfMissing(vehiculeCollection, ...vehiculeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const vehicule: IVehicule = { id: 123 };
          const vehicule2: IVehicule = { id: 456 };
          expectedResult = service.addVehiculeToCollectionIfMissing([], vehicule, vehicule2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(vehicule);
          expect(expectedResult).toContain(vehicule2);
        });

        it('should accept null and undefined values', () => {
          const vehicule: IVehicule = { id: 123 };
          expectedResult = service.addVehiculeToCollectionIfMissing([], null, vehicule, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(vehicule);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
