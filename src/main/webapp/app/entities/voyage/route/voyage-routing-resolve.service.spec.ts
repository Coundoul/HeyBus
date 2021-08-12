jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IVoyage, Voyage } from '../voyage.model';
import { VoyageService } from '../service/voyage.service';

import { VoyageRoutingResolveService } from './voyage-routing-resolve.service';

describe('Service Tests', () => {
  describe('Voyage routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: VoyageRoutingResolveService;
    let service: VoyageService;
    let resultVoyage: IVoyage | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(VoyageRoutingResolveService);
      service = TestBed.inject(VoyageService);
      resultVoyage = undefined;
    });

    describe('resolve', () => {
      it('should return IVoyage returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVoyage = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVoyage).toEqual({ id: 123 });
      });

      it('should return new IVoyage if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVoyage = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultVoyage).toEqual(new Voyage());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVoyage = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVoyage).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
