jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFuel, Fuel } from '../fuel.model';
import { FuelService } from '../service/fuel.service';

import { FuelRoutingResolveService } from './fuel-routing-resolve.service';

describe('Service Tests', () => {
  describe('Fuel routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: FuelRoutingResolveService;
    let service: FuelService;
    let resultFuel: IFuel | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(FuelRoutingResolveService);
      service = TestBed.inject(FuelService);
      resultFuel = undefined;
    });

    describe('resolve', () => {
      it('should return IFuel returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFuel = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFuel).toEqual({ id: 123 });
      });

      it('should return new IFuel if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFuel = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultFuel).toEqual(new Fuel());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFuel = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFuel).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
