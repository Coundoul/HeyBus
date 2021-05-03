jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITransporteur, Transporteur } from '../transporteur.model';
import { TransporteurService } from '../service/transporteur.service';

import { TransporteurRoutingResolveService } from './transporteur-routing-resolve.service';

describe('Service Tests', () => {
  describe('Transporteur routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TransporteurRoutingResolveService;
    let service: TransporteurService;
    let resultTransporteur: ITransporteur | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TransporteurRoutingResolveService);
      service = TestBed.inject(TransporteurService);
      resultTransporteur = undefined;
    });

    describe('resolve', () => {
      it('should return ITransporteur returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTransporteur = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTransporteur).toEqual({ id: 123 });
      });

      it('should return new ITransporteur if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTransporteur = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTransporteur).toEqual(new Transporteur());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTransporteur = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTransporteur).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
