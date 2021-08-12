import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAgence, Agence } from '../agence.model';

import { AgenceService } from './agence.service';

describe('Service Tests', () => {
  describe('Agence Service', () => {
    let service: AgenceService;
    let httpMock: HttpTestingController;
    let elemDefault: IAgence;
    let expectedResult: IAgence | IAgence[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AgenceService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nom: 'AAAAAAA',
        telephone: 'AAAAAAA',
        responsable: 'AAAAAAA',
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

      it('should create a Agence', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Agence()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Agence', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            telephone: 'BBBBBB',
            responsable: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Agence', () => {
        const patchObject = Object.assign({}, new Agence());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Agence', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            telephone: 'BBBBBB',
            responsable: 'BBBBBB',
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

      it('should delete a Agence', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAgenceToCollectionIfMissing', () => {
        it('should add a Agence to an empty array', () => {
          const agence: IAgence = { id: 123 };
          expectedResult = service.addAgenceToCollectionIfMissing([], agence);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(agence);
        });

        it('should not add a Agence to an array that contains it', () => {
          const agence: IAgence = { id: 123 };
          const agenceCollection: IAgence[] = [
            {
              ...agence,
            },
            { id: 456 },
          ];
          expectedResult = service.addAgenceToCollectionIfMissing(agenceCollection, agence);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Agence to an array that doesn't contain it", () => {
          const agence: IAgence = { id: 123 };
          const agenceCollection: IAgence[] = [{ id: 456 }];
          expectedResult = service.addAgenceToCollectionIfMissing(agenceCollection, agence);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(agence);
        });

        it('should add only unique Agence to an array', () => {
          const agenceArray: IAgence[] = [{ id: 123 }, { id: 456 }, { id: 76844 }];
          const agenceCollection: IAgence[] = [{ id: 123 }];
          expectedResult = service.addAgenceToCollectionIfMissing(agenceCollection, ...agenceArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const agence: IAgence = { id: 123 };
          const agence2: IAgence = { id: 456 };
          expectedResult = service.addAgenceToCollectionIfMissing([], agence, agence2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(agence);
          expect(expectedResult).toContain(agence2);
        });

        it('should accept null and undefined values', () => {
          const agence: IAgence = { id: 123 };
          expectedResult = service.addAgenceToCollectionIfMissing([], null, agence, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(agence);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
