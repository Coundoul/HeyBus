import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IArret, Arret } from '../arret.model';

import { ArretService } from './arret.service';

describe('Service Tests', () => {
  describe('Arret Service', () => {
    let service: ArretService;
    let httpMock: HttpTestingController;
    let elemDefault: IArret;
    let expectedResult: IArret | IArret[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ArretService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        description: 'AAAAAAA',
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

      it('should create a Arret', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Arret()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Arret', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Arret', () => {
        const patchObject = Object.assign({}, new Arret());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Arret', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            description: 'BBBBBB',
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

      it('should delete a Arret', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addArretToCollectionIfMissing', () => {
        it('should add a Arret to an empty array', () => {
          const arret: IArret = { id: 123 };
          expectedResult = service.addArretToCollectionIfMissing([], arret);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(arret);
        });

        it('should not add a Arret to an array that contains it', () => {
          const arret: IArret = { id: 123 };
          const arretCollection: IArret[] = [
            {
              ...arret,
            },
            { id: 456 },
          ];
          expectedResult = service.addArretToCollectionIfMissing(arretCollection, arret);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Arret to an array that doesn't contain it", () => {
          const arret: IArret = { id: 123 };
          const arretCollection: IArret[] = [{ id: 456 }];
          expectedResult = service.addArretToCollectionIfMissing(arretCollection, arret);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(arret);
        });

        it('should add only unique Arret to an array', () => {
          const arretArray: IArret[] = [{ id: 123 }, { id: 456 }, { id: 89884 }];
          const arretCollection: IArret[] = [{ id: 123 }];
          expectedResult = service.addArretToCollectionIfMissing(arretCollection, ...arretArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const arret: IArret = { id: 123 };
          const arret2: IArret = { id: 456 };
          expectedResult = service.addArretToCollectionIfMissing([], arret, arret2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(arret);
          expect(expectedResult).toContain(arret2);
        });

        it('should accept null and undefined values', () => {
          const arret: IArret = { id: 123 };
          expectedResult = service.addArretToCollectionIfMissing([], null, arret, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(arret);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
