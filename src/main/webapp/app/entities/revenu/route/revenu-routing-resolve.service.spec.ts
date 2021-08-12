jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRevenu, Revenu } from '../revenu.model';
import { RevenuService } from '../service/revenu.service';

import { RevenuRoutingResolveService } from './revenu-routing-resolve.service';

describe('Service Tests', () => {
  describe('Revenu routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: RevenuRoutingResolveService;
    let service: RevenuService;
    let resultRevenu: IRevenu | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(RevenuRoutingResolveService);
      service = TestBed.inject(RevenuService);
      resultRevenu = undefined;
    });

    describe('resolve', () => {
      it('should return IRevenu returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRevenu = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRevenu).toEqual({ id: 123 });
      });

      it('should return new IRevenu if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRevenu = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultRevenu).toEqual(new Revenu());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRevenu = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRevenu).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
