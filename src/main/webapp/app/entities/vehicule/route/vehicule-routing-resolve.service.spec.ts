jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IVehicule, Vehicule } from '../vehicule.model';
import { VehiculeService } from '../service/vehicule.service';

import { VehiculeRoutingResolveService } from './vehicule-routing-resolve.service';

describe('Service Tests', () => {
  describe('Vehicule routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: VehiculeRoutingResolveService;
    let service: VehiculeService;
    let resultVehicule: IVehicule | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(VehiculeRoutingResolveService);
      service = TestBed.inject(VehiculeService);
      resultVehicule = undefined;
    });

    describe('resolve', () => {
      it('should return IVehicule returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVehicule = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVehicule).toEqual({ id: 123 });
      });

      it('should return new IVehicule if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVehicule = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultVehicule).toEqual(new Vehicule());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVehicule = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVehicule).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
