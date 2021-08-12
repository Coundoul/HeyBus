jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPays, Pays } from '../pays.model';
import { PaysService } from '../service/pays.service';

import { PaysRoutingResolveService } from './pays-routing-resolve.service';

describe('Service Tests', () => {
  describe('Pays routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PaysRoutingResolveService;
    let service: PaysService;
    let resultPays: IPays | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PaysRoutingResolveService);
      service = TestBed.inject(PaysService);
      resultPays = undefined;
    });

    describe('resolve', () => {
      it('should return IPays returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPays = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPays).toEqual({ id: 123 });
      });

      it('should return new IPays if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPays = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPays).toEqual(new Pays());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPays = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPays).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
