jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FuelService } from '../service/fuel.service';
import { IFuel, Fuel } from '../fuel.model';
import { IVehicule } from 'app/entities/vehicule/vehicule.model';
import { VehiculeService } from 'app/entities/vehicule/service/vehicule.service';

import { FuelUpdateComponent } from './fuel-update.component';

describe('Component Tests', () => {
  describe('Fuel Management Update Component', () => {
    let comp: FuelUpdateComponent;
    let fixture: ComponentFixture<FuelUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let fuelService: FuelService;
    let vehiculeService: VehiculeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FuelUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FuelUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FuelUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      fuelService = TestBed.inject(FuelService);
      vehiculeService = TestBed.inject(VehiculeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Vehicule query and add missing value', () => {
        const fuel: IFuel = { id: 456 };
        const vehicule: IVehicule = { id: 21445 };
        fuel.vehicule = vehicule;

        const vehiculeCollection: IVehicule[] = [{ id: 29677 }];
        spyOn(vehiculeService, 'query').and.returnValue(of(new HttpResponse({ body: vehiculeCollection })));
        const additionalVehicules = [vehicule];
        const expectedCollection: IVehicule[] = [...additionalVehicules, ...vehiculeCollection];
        spyOn(vehiculeService, 'addVehiculeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ fuel });
        comp.ngOnInit();

        expect(vehiculeService.query).toHaveBeenCalled();
        expect(vehiculeService.addVehiculeToCollectionIfMissing).toHaveBeenCalledWith(vehiculeCollection, ...additionalVehicules);
        expect(comp.vehiculesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const fuel: IFuel = { id: 456 };
        const vehicule: IVehicule = { id: 75619 };
        fuel.vehicule = vehicule;

        activatedRoute.data = of({ fuel });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(fuel));
        expect(comp.vehiculesSharedCollection).toContain(vehicule);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fuel = { id: 123 };
        spyOn(fuelService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fuel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fuel }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(fuelService.update).toHaveBeenCalledWith(fuel);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fuel = new Fuel();
        spyOn(fuelService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fuel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fuel }));
        saveSubject.complete();

        // THEN
        expect(fuelService.create).toHaveBeenCalledWith(fuel);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fuel = { id: 123 };
        spyOn(fuelService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fuel });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(fuelService.update).toHaveBeenCalledWith(fuel);
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
