jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITypeDePaiement, TypeDePaiement } from '../type-de-paiement.model';
import { TypeDePaiementService } from '../service/type-de-paiement.service';

import { TypeDePaiementRoutingResolveService } from './type-de-paiement-routing-resolve.service';

describe('Service Tests', () => {
  describe('TypeDePaiement routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TypeDePaiementRoutingResolveService;
    let service: TypeDePaiementService;
    let resultTypeDePaiement: ITypeDePaiement | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TypeDePaiementRoutingResolveService);
      service = TestBed.inject(TypeDePaiementService);
      resultTypeDePaiement = undefined;
    });

    describe('resolve', () => {
      it('should return ITypeDePaiement returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTypeDePaiement = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTypeDePaiement).toEqual({ id: 123 });
      });

      it('should return new ITypeDePaiement if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTypeDePaiement = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTypeDePaiement).toEqual(new TypeDePaiement());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTypeDePaiement = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTypeDePaiement).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
