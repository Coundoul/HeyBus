import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IIncident, Incident } from '../incident.model';

import { IncidentService } from './incident.service';

describe('Service Tests', () => {
  describe('Incident Service', () => {
    let service: IncidentService;
    let httpMock: HttpTestingController;
    let elemDefault: IIncident;
    let expectedResult: IIncident | IIncident[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(IncidentService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        gravite: 'AAAAAAA',
        chauffeur: 'AAAAAAA',
        responsableincident: 'AAAAAAA',
        reporteurincident: 'AAAAAAA',
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

      it('should create a Incident', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Incident()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Incident', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            gravite: 'BBBBBB',
            chauffeur: 'BBBBBB',
            responsableincident: 'BBBBBB',
            reporteurincident: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Incident', () => {
        const patchObject = Object.assign(
          {
            chauffeur: 'BBBBBB',
          },
          new Incident()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Incident', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            gravite: 'BBBBBB',
            chauffeur: 'BBBBBB',
            responsableincident: 'BBBBBB',
            reporteurincident: 'BBBBBB',
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

      it('should delete a Incident', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addIncidentToCollectionIfMissing', () => {
        it('should add a Incident to an empty array', () => {
          const incident: IIncident = { id: 123 };
          expectedResult = service.addIncidentToCollectionIfMissing([], incident);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(incident);
        });

        it('should not add a Incident to an array that contains it', () => {
          const incident: IIncident = { id: 123 };
          const incidentCollection: IIncident[] = [
            {
              ...incident,
            },
            { id: 456 },
          ];
          expectedResult = service.addIncidentToCollectionIfMissing(incidentCollection, incident);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Incident to an array that doesn't contain it", () => {
          const incident: IIncident = { id: 123 };
          const incidentCollection: IIncident[] = [{ id: 456 }];
          expectedResult = service.addIncidentToCollectionIfMissing(incidentCollection, incident);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(incident);
        });

        it('should add only unique Incident to an array', () => {
          const incidentArray: IIncident[] = [{ id: 123 }, { id: 456 }, { id: 22811 }];
          const incidentCollection: IIncident[] = [{ id: 123 }];
          expectedResult = service.addIncidentToCollectionIfMissing(incidentCollection, ...incidentArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const incident: IIncident = { id: 123 };
          const incident2: IIncident = { id: 456 };
          expectedResult = service.addIncidentToCollectionIfMissing([], incident, incident2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(incident);
          expect(expectedResult).toContain(incident2);
        });

        it('should accept null and undefined values', () => {
          const incident: IIncident = { id: 123 };
          expectedResult = service.addIncidentToCollectionIfMissing([], null, incident, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(incident);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
