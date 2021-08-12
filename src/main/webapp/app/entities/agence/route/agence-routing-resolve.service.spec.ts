jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAgence, Agence } from '../agence.model';
import { AgenceService } from '../service/agence.service';

import { AgenceRoutingResolveService } from './agence-routing-resolve.service';

describe('Service Tests', () => {
  describe('Agence routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AgenceRoutingResolveService;
    let service: AgenceService;
    let resultAgence: IAgence | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AgenceRoutingResolveService);
      service = TestBed.inject(AgenceService);
      resultAgence = undefined;
    });

    describe('resolve', () => {
      it('should return IAgence returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAgence = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAgence).toEqual({ id: 123 });
      });

      it('should return new IAgence if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAgence = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAgence).toEqual(new Agence());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAgence = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAgence).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
