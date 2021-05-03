jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VilleService } from '../service/ville.service';
import { IVille, Ville } from '../ville.model';
import { IPays } from 'app/entities/pays/pays.model';
import { PaysService } from 'app/entities/pays/service/pays.service';

import { VilleUpdateComponent } from './ville-update.component';

describe('Component Tests', () => {
  describe('Ville Management Update Component', () => {
    let comp: VilleUpdateComponent;
    let fixture: ComponentFixture<VilleUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let villeService: VilleService;
    let paysService: PaysService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VilleUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VilleUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VilleUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      villeService = TestBed.inject(VilleService);
      paysService = TestBed.inject(PaysService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Pays query and add missing value', () => {
        const ville: IVille = { id: 456 };
        const pays: IPays = { id: 47323 };
        ville.pays = pays;

        const paysCollection: IPays[] = [{ id: 21553 }];
        spyOn(paysService, 'query').and.returnValue(of(new HttpResponse({ body: paysCollection })));
        const additionalPays = [pays];
        const expectedCollection: IPays[] = [...additionalPays, ...paysCollection];
        spyOn(paysService, 'addPaysToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ ville });
        comp.ngOnInit();

        expect(paysService.query).toHaveBeenCalled();
        expect(paysService.addPaysToCollectionIfMissing).toHaveBeenCalledWith(paysCollection, ...additionalPays);
        expect(comp.paysSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const ville: IVille = { id: 456 };
        const pays: IPays = { id: 55852 };
        ville.pays = pays;

        activatedRoute.data = of({ ville });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(ville));
        expect(comp.paysSharedCollection).toContain(pays);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ville = { id: 123 };
        spyOn(villeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ville });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ville }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(villeService.update).toHaveBeenCalledWith(ville);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ville = new Ville();
        spyOn(villeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ville });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ville }));
        saveSubject.complete();

        // THEN
        expect(villeService.create).toHaveBeenCalledWith(ville);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ville = { id: 123 };
        spyOn(villeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ville });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(villeService.update).toHaveBeenCalledWith(ville);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPaysById', () => {
        it('Should return tracked Pays primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPaysById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
