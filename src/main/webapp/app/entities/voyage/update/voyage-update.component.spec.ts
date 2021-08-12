jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VoyageService } from '../service/voyage.service';
import { IVoyage, Voyage } from '../voyage.model';
import { IEmploye } from 'app/entities/employe/employe.model';
import { EmployeService } from 'app/entities/employe/service/employe.service';
import { IArret } from 'app/entities/arret/arret.model';
import { ArretService } from 'app/entities/arret/service/arret.service';
import { IVehicule } from 'app/entities/vehicule/vehicule.model';
import { VehiculeService } from 'app/entities/vehicule/service/vehicule.service';
import { IVille } from 'app/entities/ville/ville.model';
import { VilleService } from 'app/entities/ville/service/ville.service';
import { ITransporteur } from 'app/entities/transporteur/transporteur.model';
import { TransporteurService } from 'app/entities/transporteur/service/transporteur.service';

import { VoyageUpdateComponent } from './voyage-update.component';

describe('Component Tests', () => {
  describe('Voyage Management Update Component', () => {
    let comp: VoyageUpdateComponent;
    let fixture: ComponentFixture<VoyageUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let voyageService: VoyageService;
    let employeService: EmployeService;
    let arretService: ArretService;
    let vehiculeService: VehiculeService;
    let villeService: VilleService;
    let transporteurService: TransporteurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VoyageUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VoyageUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VoyageUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      voyageService = TestBed.inject(VoyageService);
      employeService = TestBed.inject(EmployeService);
      arretService = TestBed.inject(ArretService);
      vehiculeService = TestBed.inject(VehiculeService);
      villeService = TestBed.inject(VilleService);
      transporteurService = TestBed.inject(TransporteurService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Employe query and add missing value', () => {
        const voyage: IVoyage = { id: 456 };
        const employes: IEmploye[] = [{ id: 83952 }];
        voyage.employes = employes;

        const employeCollection: IEmploye[] = [{ id: 45674 }];
        spyOn(employeService, 'query').and.returnValue(of(new HttpResponse({ body: employeCollection })));
        const additionalEmployes = [...employes];
        const expectedCollection: IEmploye[] = [...additionalEmployes, ...employeCollection];
        spyOn(employeService, 'addEmployeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ voyage });
        comp.ngOnInit();

        expect(employeService.query).toHaveBeenCalled();
        expect(employeService.addEmployeToCollectionIfMissing).toHaveBeenCalledWith(employeCollection, ...additionalEmployes);
        expect(comp.employesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Arret query and add missing value', () => {
        const voyage: IVoyage = { id: 456 };
        const arrets: IArret[] = [{ id: 26081 }];
        voyage.arrets = arrets;

        const arretCollection: IArret[] = [{ id: 9296 }];
        spyOn(arretService, 'query').and.returnValue(of(new HttpResponse({ body: arretCollection })));
        const additionalArrets = [...arrets];
        const expectedCollection: IArret[] = [...additionalArrets, ...arretCollection];
        spyOn(arretService, 'addArretToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ voyage });
        comp.ngOnInit();

        expect(arretService.query).toHaveBeenCalled();
        expect(arretService.addArretToCollectionIfMissing).toHaveBeenCalledWith(arretCollection, ...additionalArrets);
        expect(comp.arretsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Vehicule query and add missing value', () => {
        const voyage: IVoyage = { id: 456 };
        const vehicule: IVehicule = { id: 93177 };
        voyage.vehicule = vehicule;

        const vehiculeCollection: IVehicule[] = [{ id: 20776 }];
        spyOn(vehiculeService, 'query').and.returnValue(of(new HttpResponse({ body: vehiculeCollection })));
        const additionalVehicules = [vehicule];
        const expectedCollection: IVehicule[] = [...additionalVehicules, ...vehiculeCollection];
        spyOn(vehiculeService, 'addVehiculeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ voyage });
        comp.ngOnInit();

        expect(vehiculeService.query).toHaveBeenCalled();
        expect(vehiculeService.addVehiculeToCollectionIfMissing).toHaveBeenCalledWith(vehiculeCollection, ...additionalVehicules);
        expect(comp.vehiculesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Ville query and add missing value', () => {
        const voyage: IVoyage = { id: 456 };
        const departVille: IVille = { id: 19483 };
        voyage.departVille = departVille;
        const arriveVille: IVille = { id: 2752 };
        voyage.arriveVille = arriveVille;

        const villeCollection: IVille[] = [{ id: 22871 }];
        spyOn(villeService, 'query').and.returnValue(of(new HttpResponse({ body: villeCollection })));
        const additionalVilles = [departVille, arriveVille];
        const expectedCollection: IVille[] = [...additionalVilles, ...villeCollection];
        spyOn(villeService, 'addVilleToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ voyage });
        comp.ngOnInit();

        expect(villeService.query).toHaveBeenCalled();
        expect(villeService.addVilleToCollectionIfMissing).toHaveBeenCalledWith(villeCollection, ...additionalVilles);
        expect(comp.villesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Transporteur query and add missing value', () => {
        const voyage: IVoyage = { id: 456 };
        const transporteur: ITransporteur = { id: 95293 };
        voyage.transporteur = transporteur;

        const transporteurCollection: ITransporteur[] = [{ id: 36833 }];
        spyOn(transporteurService, 'query').and.returnValue(of(new HttpResponse({ body: transporteurCollection })));
        const additionalTransporteurs = [transporteur];
        const expectedCollection: ITransporteur[] = [...additionalTransporteurs, ...transporteurCollection];
        spyOn(transporteurService, 'addTransporteurToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ voyage });
        comp.ngOnInit();

        expect(transporteurService.query).toHaveBeenCalled();
        expect(transporteurService.addTransporteurToCollectionIfMissing).toHaveBeenCalledWith(
          transporteurCollection,
          ...additionalTransporteurs
        );
        expect(comp.transporteursSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const voyage: IVoyage = { id: 456 };
        const employes: IEmploye = { id: 19797 };
        voyage.employes = [employes];
        const arrets: IArret = { id: 30926 };
        voyage.arrets = [arrets];
        const vehicule: IVehicule = { id: 63081 };
        voyage.vehicule = vehicule;
        const departVille: IVille = { id: 43916 };
        voyage.departVille = departVille;
        const arriveVille: IVille = { id: 13378 };
        voyage.arriveVille = arriveVille;
        const transporteur: ITransporteur = { id: 92297 };
        voyage.transporteur = transporteur;

        activatedRoute.data = of({ voyage });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(voyage));
        expect(comp.employesSharedCollection).toContain(employes);
        expect(comp.arretsSharedCollection).toContain(arrets);
        expect(comp.vehiculesSharedCollection).toContain(vehicule);
        expect(comp.villesSharedCollection).toContain(departVille);
        expect(comp.villesSharedCollection).toContain(arriveVille);
        expect(comp.transporteursSharedCollection).toContain(transporteur);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const voyage = { id: 123 };
        spyOn(voyageService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ voyage });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: voyage }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(voyageService.update).toHaveBeenCalledWith(voyage);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const voyage = new Voyage();
        spyOn(voyageService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ voyage });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: voyage }));
        saveSubject.complete();

        // THEN
        expect(voyageService.create).toHaveBeenCalledWith(voyage);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const voyage = { id: 123 };
        spyOn(voyageService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ voyage });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(voyageService.update).toHaveBeenCalledWith(voyage);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackEmployeById', () => {
        it('Should return tracked Employe primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEmployeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackArretById', () => {
        it('Should return tracked Arret primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackArretById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackVehiculeById', () => {
        it('Should return tracked Vehicule primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackVehiculeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackVilleById', () => {
        it('Should return tracked Ville primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackVilleById(0, entity);
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

    describe('Getting selected relationships', () => {
      describe('getSelectedEmploye', () => {
        it('Should return option if no Employe is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedEmploye(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Employe for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedEmploye(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Employe is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedEmploye(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });

      describe('getSelectedArret', () => {
        it('Should return option if no Arret is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedArret(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Arret for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedArret(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Arret is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedArret(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
