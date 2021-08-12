jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EmployeService } from '../service/employe.service';
import { IEmploye, Employe } from '../employe.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/service/position.service';
import { ITransporteur } from 'app/entities/transporteur/transporteur.model';
import { TransporteurService } from 'app/entities/transporteur/service/transporteur.service';

import { EmployeUpdateComponent } from './employe-update.component';

describe('Component Tests', () => {
  describe('Employe Management Update Component', () => {
    let comp: EmployeUpdateComponent;
    let fixture: ComponentFixture<EmployeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let employeService: EmployeService;
    let userService: UserService;
    let positionService: PositionService;
    let transporteurService: TransporteurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EmployeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EmployeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmployeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      employeService = TestBed.inject(EmployeService);
      userService = TestBed.inject(UserService);
      positionService = TestBed.inject(PositionService);
      transporteurService = TestBed.inject(TransporteurService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const employe: IEmploye = { id: 456 };
        const user: IUser = { id: 48385 };
        employe.user = user;

        const userCollection: IUser[] = [{ id: 2487 }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ employe });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Position query and add missing value', () => {
        const employe: IEmploye = { id: 456 };
        const position: IPosition = { id: 98316 };
        employe.position = position;

        const positionCollection: IPosition[] = [{ id: 64820 }];
        spyOn(positionService, 'query').and.returnValue(of(new HttpResponse({ body: positionCollection })));
        const additionalPositions = [position];
        const expectedCollection: IPosition[] = [...additionalPositions, ...positionCollection];
        spyOn(positionService, 'addPositionToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ employe });
        comp.ngOnInit();

        expect(positionService.query).toHaveBeenCalled();
        expect(positionService.addPositionToCollectionIfMissing).toHaveBeenCalledWith(positionCollection, ...additionalPositions);
        expect(comp.positionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Transporteur query and add missing value', () => {
        const employe: IEmploye = { id: 456 };
        const transporteur: ITransporteur = { id: 19848 };
        employe.transporteur = transporteur;

        const transporteurCollection: ITransporteur[] = [{ id: 51836 }];
        spyOn(transporteurService, 'query').and.returnValue(of(new HttpResponse({ body: transporteurCollection })));
        const additionalTransporteurs = [transporteur];
        const expectedCollection: ITransporteur[] = [...additionalTransporteurs, ...transporteurCollection];
        spyOn(transporteurService, 'addTransporteurToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ employe });
        comp.ngOnInit();

        expect(transporteurService.query).toHaveBeenCalled();
        expect(transporteurService.addTransporteurToCollectionIfMissing).toHaveBeenCalledWith(
          transporteurCollection,
          ...additionalTransporteurs
        );
        expect(comp.transporteursSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const employe: IEmploye = { id: 456 };
        const user: IUser = { id: 97240 };
        employe.user = user;
        const position: IPosition = { id: 85346 };
        employe.position = position;
        const transporteur: ITransporteur = { id: 78170 };
        employe.transporteur = transporteur;

        activatedRoute.data = of({ employe });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(employe));
        expect(comp.usersSharedCollection).toContain(user);
        expect(comp.positionsSharedCollection).toContain(position);
        expect(comp.transporteursSharedCollection).toContain(transporteur);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const employe = { id: 123 };
        spyOn(employeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ employe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: employe }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(employeService.update).toHaveBeenCalledWith(employe);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const employe = new Employe();
        spyOn(employeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ employe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: employe }));
        saveSubject.complete();

        // THEN
        expect(employeService.create).toHaveBeenCalledWith(employe);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const employe = { id: 123 };
        spyOn(employeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ employe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(employeService.update).toHaveBeenCalledWith(employe);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPositionById', () => {
        it('Should return tracked Position primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPositionById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackTransporteurById', () => {
        it('Should return tracked Transporteur primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTransporteurById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
