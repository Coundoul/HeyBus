jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AgenceService } from '../service/agence.service';
import { IAgence, Agence } from '../agence.model';
import { IRevenu } from 'app/entities/revenu/revenu.model';
import { RevenuService } from 'app/entities/revenu/service/revenu.service';
import { IDepense } from 'app/entities/depense/depense.model';
import { DepenseService } from 'app/entities/depense/service/depense.service';

import { AgenceUpdateComponent } from './agence-update.component';

describe('Component Tests', () => {
  describe('Agence Management Update Component', () => {
    let comp: AgenceUpdateComponent;
    let fixture: ComponentFixture<AgenceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let agenceService: AgenceService;
    let revenuService: RevenuService;
    let depenseService: DepenseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AgenceUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AgenceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AgenceUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      agenceService = TestBed.inject(AgenceService);
      revenuService = TestBed.inject(RevenuService);
      depenseService = TestBed.inject(DepenseService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Revenu query and add missing value', () => {
        const agence: IAgence = { id: 456 };
        const revenu: IRevenu = { id: 12989 };
        agence.revenu = revenu;

        const revenuCollection: IRevenu[] = [{ id: 50772 }];
        spyOn(revenuService, 'query').and.returnValue(of(new HttpResponse({ body: revenuCollection })));
        const additionalRevenus = [revenu];
        const expectedCollection: IRevenu[] = [...additionalRevenus, ...revenuCollection];
        spyOn(revenuService, 'addRevenuToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ agence });
        comp.ngOnInit();

        expect(revenuService.query).toHaveBeenCalled();
        expect(revenuService.addRevenuToCollectionIfMissing).toHaveBeenCalledWith(revenuCollection, ...additionalRevenus);
        expect(comp.revenusSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Depense query and add missing value', () => {
        const agence: IAgence = { id: 456 };
        const depense: IDepense = { id: 34963 };
        agence.depense = depense;

        const depenseCollection: IDepense[] = [{ id: 72915 }];
        spyOn(depenseService, 'query').and.returnValue(of(new HttpResponse({ body: depenseCollection })));
        const additionalDepenses = [depense];
        const expectedCollection: IDepense[] = [...additionalDepenses, ...depenseCollection];
        spyOn(depenseService, 'addDepenseToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ agence });
        comp.ngOnInit();

        expect(depenseService.query).toHaveBeenCalled();
        expect(depenseService.addDepenseToCollectionIfMissing).toHaveBeenCalledWith(depenseCollection, ...additionalDepenses);
        expect(comp.depensesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const agence: IAgence = { id: 456 };
        const revenu: IRevenu = { id: 19676 };
        agence.revenu = revenu;
        const depense: IDepense = { id: 31198 };
        agence.depense = depense;

        activatedRoute.data = of({ agence });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(agence));
        expect(comp.revenusSharedCollection).toContain(revenu);
        expect(comp.depensesSharedCollection).toContain(depense);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const agence = { id: 123 };
        spyOn(agenceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ agence });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: agence }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(agenceService.update).toHaveBeenCalledWith(agence);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const agence = new Agence();
        spyOn(agenceService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ agence });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: agence }));
        saveSubject.complete();

        // THEN
        expect(agenceService.create).toHaveBeenCalledWith(agence);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const agence = { id: 123 };
        spyOn(agenceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ agence });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(agenceService.update).toHaveBeenCalledWith(agence);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRevenuById', () => {
        it('Should return tracked Revenu primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRevenuById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackDepenseById', () => {
        it('Should return tracked Depense primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDepenseById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
