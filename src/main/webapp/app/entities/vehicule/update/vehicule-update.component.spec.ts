jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VehiculeService } from '../service/vehicule.service';
import { IVehicule, Vehicule } from '../vehicule.model';
import { ITransporteur } from 'app/entities/transporteur/transporteur.model';
import { TransporteurService } from 'app/entities/transporteur/service/transporteur.service';

import { VehiculeUpdateComponent } from './vehicule-update.component';

describe('Component Tests', () => {
  describe('Vehicule Management Update Component', () => {
    let comp: VehiculeUpdateComponent;
    let fixture: ComponentFixture<VehiculeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let vehiculeService: VehiculeService;
    let transporteurService: TransporteurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VehiculeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VehiculeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VehiculeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      vehiculeService = TestBed.inject(VehiculeService);
      transporteurService = TestBed.inject(TransporteurService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Transporteur query and add missing value', () => {
        const vehicule: IVehicule = { id: 456 };
        const transporteur: ITransporteur = { id: 67367 };
        vehicule.transporteur = transporteur;

        const transporteurCollection: ITransporteur[] = [{ id: 6695 }];
        spyOn(transporteurService, 'query').and.returnValue(of(new HttpResponse({ body: transporteurCollection })));
        const additionalTransporteurs = [transporteur];
        const expectedCollection: ITransporteur[] = [...additionalTransporteurs, ...transporteurCollection];
        spyOn(transporteurService, 'addTransporteurToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ vehicule });
        comp.ngOnInit();

        expect(transporteurService.query).toHaveBeenCalled();
        expect(transporteurService.addTransporteurToCollectionIfMissing).toHaveBeenCalledWith(
          transporteurCollection,
          ...additionalTransporteurs
        );
        expect(comp.transporteursSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const vehicule: IVehicule = { id: 456 };
        const transporteur: ITransporteur = { id: 40655 };
        vehicule.transporteur = transporteur;

        activatedRoute.data = of({ vehicule });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(vehicule));
        expect(comp.transporteursSharedCollection).toContain(transporteur);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vehicule = { id: 123 };
        spyOn(vehiculeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vehicule });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vehicule }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(vehiculeService.update).toHaveBeenCalledWith(vehicule);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vehicule = new Vehicule();
        spyOn(vehiculeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vehicule });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vehicule }));
        saveSubject.complete();

        // THEN
        expect(vehiculeService.create).toHaveBeenCalledWith(vehicule);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vehicule = { id: 123 };
        spyOn(vehiculeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vehicule });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(vehiculeService.update).toHaveBeenCalledWith(vehicule);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
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
