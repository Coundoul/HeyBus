jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IArret, Arret } from '../arret.model';
import { ArretService } from '../service/arret.service';

import { ArretRoutingResolveService } from './arret-routing-resolve.service';

describe('Service Tests', () => {
  describe('Arret routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ArretRoutingResolveService;
    let service: ArretService;
    let resultArret: IArret | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ArretRoutingResolveService);
      service = TestBed.inject(ArretService);
      resultArret = undefined;
    });

    describe('resolve', () => {
      it('should return IArret returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultArret = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultArret).toEqual({ id: 123 });
      });

      it('should return new IArret if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultArret = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultArret).toEqual(new Arret());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultArret = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultArret).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
