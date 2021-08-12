jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MaintenanceService } from '../service/maintenance.service';
import { IMaintenance, Maintenance } from '../maintenance.model';
import { IVehicule } from 'app/entities/vehicule/vehicule.model';
import { VehiculeService } from 'app/entities/vehicule/service/vehicule.service';

import { MaintenanceUpdateComponent } from './maintenance-update.component';

describe('Component Tests', () => {
  describe('Maintenance Management Update Component', () => {
    let comp: MaintenanceUpdateComponent;
    let fixture: ComponentFixture<MaintenanceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let maintenanceService: MaintenanceService;
    let vehiculeService: VehiculeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MaintenanceUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MaintenanceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MaintenanceUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      maintenanceService = TestBed.inject(MaintenanceService);
      vehiculeService = TestBed.inject(VehiculeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Vehicule query and add missing value', () => {
        const maintenance: IMaintenance = { id: 456 };
        const vehicule: IVehicule = { id: 11958 };
        maintenance.vehicule = vehicule;

        const vehiculeCollection: IVehicule[] = [{ id: 82925 }];
        spyOn(vehiculeService, 'query').and.returnValue(of(new HttpResponse({ body: vehiculeCollection })));
        const additionalVehicules = [vehicule];
        const expectedCollection: IVehicule[] = [...additionalVehicules, ...vehiculeCollection];
        spyOn(vehiculeService, 'addVehiculeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ maintenance });
        comp.ngOnInit();

        expect(vehiculeService.query).toHaveBeenCalled();
        expect(vehiculeService.addVehiculeToCollectionIfMissing).toHaveBeenCalledWith(vehiculeCollection, ...additionalVehicules);
        expect(comp.vehiculesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const maintenance: IMaintenance = { id: 456 };
        const vehicule: IVehicule = { id: 68899 };
        maintenance.vehicule = vehicule;

        activatedRoute.data = of({ maintenance });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(maintenance));
        expect(comp.vehiculesSharedCollection).toContain(vehicule);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const maintenance = { id: 123 };
        spyOn(maintenanceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ maintenance });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: maintenance }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(maintenanceService.update).toHaveBeenCalledWith(maintenance);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const maintenance = new Maintenance();
        spyOn(maintenanceService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ maintenance });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: maintenance }));
        saveSubject.complete();

        // THEN
        expect(maintenanceService.create).toHaveBeenCalledWith(maintenance);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const maintenance = { id: 123 };
        spyOn(maintenanceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ maintenance });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(maintenanceService.update).toHaveBeenCalledWith(maintenance);
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
