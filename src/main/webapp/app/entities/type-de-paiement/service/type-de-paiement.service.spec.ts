import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypeDePaiement, TypeDePaiement } from '../type-de-paiement.model';

import { TypeDePaiementService } from './type-de-paiement.service';

describe('Service Tests', () => {
  describe('TypeDePaiement Service', () => {
    let service: TypeDePaiementService;
    let httpMock: HttpTestingController;
    let elemDefault: ITypeDePaiement;
    let expectedResult: ITypeDePaiement | ITypeDePaiement[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TypeDePaiementService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        paiement: 'AAAAAAA',
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

      it('should create a TypeDePaiement', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new TypeDePaiement()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a TypeDePaiement', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            paiement: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a TypeDePaiement', () => {
        const patchObject = Object.assign(
          {
            paiement: 'BBBBBB',
          },
          new TypeDePaiement()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of TypeDePaiement', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            paiement: 'BBBBBB',
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

      it('should delete a TypeDePaiement', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTypeDePaiementToCollectionIfMissing', () => {
        it('should add a TypeDePaiement to an empty array', () => {
          const typeDePaiement: ITypeDePaiement = { id: 123 };
          expectedResult = service.addTypeDePaiementToCollectionIfMissing([], typeDePaiement);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(typeDePaiement);
        });

        it('should not add a TypeDePaiement to an array that contains it', () => {
          const typeDePaiement: ITypeDePaiement = { id: 123 };
          const typeDePaiementCollection: ITypeDePaiement[] = [
            {
              ...typeDePaiement,
            },
            { id: 456 },
          ];
          expectedResult = service.addTypeDePaiementToCollectionIfMissing(typeDePaiementCollection, typeDePaiement);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a TypeDePaiement to an array that doesn't contain it", () => {
          const typeDePaiement: ITypeDePaiement = { id: 123 };
          const typeDePaiementCollection: ITypeDePaiement[] = [{ id: 456 }];
          expectedResult = service.addTypeDePaiementToCollectionIfMissing(typeDePaiementCollection, typeDePaiement);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(typeDePaiement);
        });

        it('should add only unique TypeDePaiement to an array', () => {
          const typeDePaiementArray: ITypeDePaiement[] = [{ id: 123 }, { id: 456 }, { id: 35120 }];
          const typeDePaiementCollection: ITypeDePaiement[] = [{ id: 123 }];
          expectedResult = service.addTypeDePaiementToCollectionIfMissing(typeDePaiementCollection, ...typeDePaiementArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const typeDePaiement: ITypeDePaiement = { id: 123 };
          const typeDePaiement2: ITypeDePaiement = { id: 456 };
          expectedResult = service.addTypeDePaiementToCollectionIfMissing([], typeDePaiement, typeDePaiement2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(typeDePaiement);
          expect(expectedResult).toContain(typeDePaiement2);
        });

        it('should accept null and undefined values', () => {
          const typeDePaiement: ITypeDePaiement = { id: 123 };
          expectedResult = service.addTypeDePaiementToCollectionIfMissing([], null, typeDePaiement, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(typeDePaiement);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
