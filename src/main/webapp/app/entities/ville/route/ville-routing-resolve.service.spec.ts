jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IVille, Ville } from '../ville.model';
import { VilleService } from '../service/ville.service';

import { VilleRoutingResolveService } from './ville-routing-resolve.service';

describe('Service Tests', () => {
  describe('Ville routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: VilleRoutingResolveService;
    let service: VilleService;
    let resultVille: IVille | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(VilleRoutingResolveService);
      service = TestBed.inject(VilleService);
      resultVille = undefined;
    });

    describe('resolve', () => {
      it('should return IVille returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVille = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVille).toEqual({ id: 123 });
      });

      it('should return new IVille if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVille = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultVille).toEqual(new Ville());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVille = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVille).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
