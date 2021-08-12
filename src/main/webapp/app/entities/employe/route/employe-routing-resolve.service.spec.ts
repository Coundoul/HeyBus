jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEmploye, Employe } from '../employe.model';
import { EmployeService } from '../service/employe.service';

import { EmployeRoutingResolveService } from './employe-routing-resolve.service';

describe('Service Tests', () => {
  describe('Employe routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: EmployeRoutingResolveService;
    let service: EmployeService;
    let resultEmploye: IEmploye | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(EmployeRoutingResolveService);
      service = TestBed.inject(EmployeService);
      resultEmploye = undefined;
    });

    describe('resolve', () => {
      it('should return IEmploye returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEmploye = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEmploye).toEqual({ id: 123 });
      });

      it('should return new IEmploye if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEmploye = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultEmploye).toEqual(new Employe());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEmploye = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEmploye).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
