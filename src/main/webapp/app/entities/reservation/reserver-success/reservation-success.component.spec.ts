jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ReservationService } from '../service/reservation.service';
import { IReservation, Reservation } from '../reservation.model';
import { IVoyage } from 'app/entities/voyage/voyage.model';
import { VoyageService } from 'app/entities/voyage/service/voyage.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

import { ReservationSuccessComponent } from './reservation-success.component';

describe('Component Tests', () => {
  describe('Reservation Management Update Component', () => {
    let comp: ReservationSuccessComponent;
    let fixture: ComponentFixture<ReservationSuccessComponent>;
    let activatedRoute: ActivatedRoute;
    let reservationService: ReservationService;
    let voyageService: VoyageService;
    let customerService: CustomerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ReservationSuccessComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ReservationSuccessComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ReservationSuccessComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      reservationService = TestBed.inject(ReservationService);
      voyageService = TestBed.inject(VoyageService);
      customerService = TestBed.inject(CustomerService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Voyage query and add missing value', () => {
        const reservation: IReservation = { id: 456 };
        const voyage: IVoyage = { id: 32292 };
        reservation.voyage = voyage;

        const voyageCollection: IVoyage[] = [{ id: 10013 }];
        spyOn(voyageService, 'query').and.returnValue(of(new HttpResponse({ body: voyageCollection })));
        const additionalVoyages = [voyage];
        const expectedCollection: IVoyage[] = [...additionalVoyages, ...voyageCollection];
        spyOn(voyageService, 'addVoyageToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ reservation });
        comp.ngOnInit();

        expect(voyageService.query).toHaveBeenCalled();
        expect(voyageService.addVoyageToCollectionIfMissing).toHaveBeenCalledWith(voyageCollection, ...additionalVoyages);
      });

      it('Should call Customer query and add missing value', () => {
        const reservation: IReservation = { id: 456 };
        const customer: ICustomer = { id: 71664 };
        reservation.customer = customer;

        const customerCollection: ICustomer[] = [{ id: 22151 }];
        spyOn(customerService, 'query').and.returnValue(of(new HttpResponse({ body: customerCollection })));
        const additionalCustomers = [customer];
        const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
        spyOn(customerService, 'addCustomerToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ reservation });
        comp.ngOnInit();

        expect(customerService.query).toHaveBeenCalled();
        expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(customerCollection, ...additionalCustomers);
      });

      it('Should update editForm', () => {
        const reservation: IReservation = { id: 456 };
        const voyage: IVoyage = { id: 90810 };
        reservation.voyage = voyage;
        const customer: ICustomer = { id: 19253 };
        reservation.customer = customer;

        activatedRoute.data = of({ reservation });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(reservation));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const reservation = { id: 123 };
        spyOn(reservationService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ reservation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: reservation }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(reservationService.update).toHaveBeenCalledWith(reservation);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const reservation = new Reservation();
        spyOn(reservationService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ reservation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: reservation }));
        saveSubject.complete();

        // THEN
        expect(reservationService.create).toHaveBeenCalledWith(reservation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const reservation = { id: 123 };
        spyOn(reservationService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ reservation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(reservationService.update).toHaveBeenCalledWith(reservation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackVoyageById', () => {
        it('Should return tracked Voyage primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackVoyageById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCustomerById', () => {
        it('Should return tracked Customer primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCustomerById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
