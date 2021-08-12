jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { IncidentService } from '../service/incident.service';
import { IIncident, Incident } from '../incident.model';
import { IVehicule } from 'app/entities/vehicule/vehicule.model';
import { VehiculeService } from 'app/entities/vehicule/service/vehicule.service';

import { IncidentUpdateComponent } from './incident-update.component';

describe('Component Tests', () => {
  describe('Incident Management Update Component', () => {
    let comp: IncidentUpdateComponent;
    let fixture: ComponentFixture<IncidentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let incidentService: IncidentService;
    let vehiculeService: VehiculeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [IncidentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(IncidentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(IncidentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      incidentService = TestBed.inject(IncidentService);
      vehiculeService = TestBed.inject(VehiculeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Vehicule query and add missing value', () => {
        const incident: IIncident = { id: 456 };
        const vehicule: IVehicule = { id: 19110 };
        incident.vehicule = vehicule;

        const vehiculeCollection: IVehicule[] = [{ id: 80971 }];
        spyOn(vehiculeService, 'query').and.returnValue(of(new HttpResponse({ body: vehiculeCollection })));
        const additionalVehicules = [vehicule];
        const expectedCollection: IVehicule[] = [...additionalVehicules, ...vehiculeCollection];
        spyOn(vehiculeService, 'addVehiculeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ incident });
        comp.ngOnInit();

        expect(vehiculeService.query).toHaveBeenCalled();
        expect(vehiculeService.addVehiculeToCollectionIfMissing).toHaveBeenCalledWith(vehiculeCollection, ...additionalVehicules);
        expect(comp.vehiculesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const incident: IIncident = { id: 456 };
        const vehicule: IVehicule = { id: 84268 };
        incident.vehicule = vehicule;

        activatedRoute.data = of({ incident });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(incident));
        expect(comp.vehiculesSharedCollection).toContain(vehicule);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const incident = { id: 123 };
        spyOn(incidentService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ incident });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: incident }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(incidentService.update).toHaveBeenCalledWith(incident);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const incident = new Incident();
        spyOn(incidentService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ incident });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: incident }));
        saveSubject.complete();

        // THEN
        expect(incidentService.create).toHaveBeenCalledWith(incident);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const incident = { id: 123 };
        spyOn(incidentService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ incident });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(incidentService.update).toHaveBeenCalledWith(incident);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackVehiculeById', () => {
        it('Should return tracked Vehicule primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackVehiculeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
