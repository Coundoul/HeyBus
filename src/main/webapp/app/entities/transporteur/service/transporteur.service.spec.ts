import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITransporteur, Transporteur } from '../transporteur.model';

import { TransporteurService } from './transporteur.service';

describe('Service Tests', () => {
  describe('Transporteur Service', () => {
    let service: TransporteurService;
    let httpMock: HttpTestingController;
    let elemDefault: ITransporteur;
    let expectedResult: ITransporteur | ITransporteur[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TransporteurService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nom: 'AAAAAAA',
        telephone: 'AAAAAAA',
        responsable: 'AAAAAAA',
        mail: 'AAAAAAA',
        adresse: 'AAAAAAA',
        logoContentType: 'image/png',
        logo: 'AAAAAAA',
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

      it('should create a Transporteur', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Transporteur()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Transporteur', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            telephone: 'BBBBBB',
            responsable: 'BBBBBB',
            mail: 'BBBBBB',
            adresse: 'BBBBBB',
            logo: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Transporteur', () => {
        const patchObject = Object.assign(
          {
            nom: 'BBBBBB',
            telephone: 'BBBBBB',
            mail: 'BBBBBB',
            logo: 'BBBBBB',
          },
          new Transporteur()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Transporteur', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nom: 'BBBBBB',
            telephone: 'BBBBBB',
            responsable: 'BBBBBB',
            mail: 'BBBBBB',
            adresse: 'BBBBBB',
            logo: 'BBBBBB',
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

      it('should delete a Transporteur', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTransporteurToCollectionIfMissing', () => {
        it('should add a Transporteur to an empty array', () => {
          const transporteur: ITransporteur = { id: 123 };
          expectedResult = service.addTransporteurToCollectionIfMissing([], transporteur);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(transporteur);
        });

        it('should not add a Transporteur to an array that contains it', () => {
          const transporteur: ITransporteur = { id: 123 };
          const transporteurCollection: ITransporteur[] = [
            {
              ...transporteur,
            },
            { id: 456 },
          ];
          expectedResult = service.addTransporteurToCollectionIfMissing(transporteurCollection, transporteur);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Transporteur to an array that doesn't contain it", () => {
          const transporteur: ITransporteur = { id: 123 };
          const transporteurCollection: ITransporteur[] = [{ id: 456 }];
          expectedResult = service.addTransporteurToCollectionIfMissing(transporteurCollection, transporteur);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(transporteur);
        });

        it('should add only unique Transporteur to an array', () => {
          const transporteurArray: ITransporteur[] = [{ id: 123 }, { id: 456 }, { id: 65765 }];
          const transporteurCollection: ITransporteur[] = [{ id: 123 }];
          expectedResult = service.addTransporteurToCollectionIfMissing(transporteurCollection, ...transporteurArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const transporteur: ITransporteur = { id: 123 };
          const transporteur2: ITransporteur = { id: 456 };
          expectedResult = service.addTransporteurToCollectionIfMissing([], transporteur, transporteur2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(transporteur);
          expect(expectedResult).toContain(transporteur2);
        });

        it('should accept null and undefined values', () => {
          const transporteur: ITransporteur = { id: 123 };
          expectedResult = service.addTransporteurToCollectionIfMissing([], null, transporteur, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(transporteur);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
