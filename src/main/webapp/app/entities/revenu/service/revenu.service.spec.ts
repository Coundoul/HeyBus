import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IRevenu, Revenu } from '../revenu.model';

import { RevenuService } from './revenu.service';

describe('Service Tests', () => {
  describe('Revenu Service', () => {
    let service: RevenuService;
    let httpMock: HttpTestingController;
    let elemDefault: IRevenu;
    let expectedResult: IRevenu | IRevenu[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RevenuService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        date: currentDate,
        type: 'AAAAAAA',
        montant: 0,
        description: 'AAAAAAA',
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

      it('should create a Revenu', () => {
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

        service.create(new Revenu()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Revenu', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_FORMAT),
            type: 'BBBBBB',
            montant: 1,
            description: 'BBBBBB',
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

      it('should partial update a Revenu', () => {
        const patchObject = Object.assign(
          {
            type: 'BBBBBB',
          },
          new Revenu()
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

      it('should return a list of Revenu', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_FORMAT),
            type: 'BBBBBB',
            montant: 1,
            description: 'BBBBBB',
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

      it('should delete a Revenu', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRevenuToCollectionIfMissing', () => {
        it('should add a Revenu to an empty array', () => {
          const revenu: IRevenu = { id: 123 };
          expectedResult = service.addRevenuToCollectionIfMissing([], revenu);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(revenu);
        });

        it('should not add a Revenu to an array that contains it', () => {
          const revenu: IRevenu = { id: 123 };
          const revenuCollection: IRevenu[] = [
            {
              ...revenu,
            },
            { id: 456 },
          ];
          expectedResult = service.addRevenuToCollectionIfMissing(revenuCollection, revenu);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Revenu to an array that doesn't contain it", () => {
          const revenu: IRevenu = { id: 123 };
          const revenuCollection: IRevenu[] = [{ id: 456 }];
          expectedResult = service.addRevenuToCollectionIfMissing(revenuCollection, revenu);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(revenu);
        });

        it('should add only unique Revenu to an array', () => {
          const revenuArray: IRevenu[] = [{ id: 123 }, { id: 456 }, { id: 39605 }];
          const revenuCollection: IRevenu[] = [{ id: 123 }];
          expectedResult = service.addRevenuToCollectionIfMissing(revenuCollection, ...revenuArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const revenu: IRevenu = { id: 123 };
          const revenu2: IRevenu = { id: 456 };
          expectedResult = service.addRevenuToCollectionIfMissing([], revenu, revenu2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(revenu);
          expect(expectedResult).toContain(revenu2);
        });

        it('should accept null and undefined values', () => {
          const revenu: IRevenu = { id: 123 };
          expectedResult = service.addRevenuToCollectionIfMissing([], null, revenu, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(revenu);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
