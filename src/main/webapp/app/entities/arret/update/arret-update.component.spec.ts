jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ArretService } from '../service/arret.service';
import { IArret, Arret } from '../arret.model';
import { IVille } from 'app/entities/ville/ville.model';
import { VilleService } from 'app/entities/ville/service/ville.service';

import { ArretUpdateComponent } from './arret-update.component';

describe('Component Tests', () => {
  describe('Arret Management Update Component', () => {
    let comp: ArretUpdateComponent;
    let fixture: ComponentFixture<ArretUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let arretService: ArretService;
    let villeService: VilleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ArretUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ArretUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ArretUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      arretService = TestBed.inject(ArretService);
      villeService = TestBed.inject(VilleService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call nomarretVille query and add missing value', () => {
        const arret: IArret = { id: 456 };
        const nomarretVille: IVille = { id: 86096 };
        arret.nomarretVille = nomarretVille;

        const nomarretVilleCollection: IVille[] = [{ id: 99191 }];
        spyOn(villeService, 'query').and.returnValue(of(new HttpResponse({ body: nomarretVilleCollection })));
        const expectedCollection: IVille[] = [nomarretVille, ...nomarretVilleCollection];
        spyOn(villeService, 'addVilleToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ arret });
        comp.ngOnInit();

        expect(villeService.query).toHaveBeenCalled();
        expect(villeService.addVilleToCollectionIfMissing).toHaveBeenCalledWith(nomarretVilleCollection, nomarretVille);
        expect(comp.nomarretVillesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const arret: IArret = { id: 456 };
        const nomarretVille: IVille = { id: 31227 };
        arret.nomarretVille = nomarretVille;

        activatedRoute.data = of({ arret });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(arret));
        expect(comp.nomarretVillesCollection).toContain(nomarretVille);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const arret = { id: 123 };
        spyOn(arretService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ arret });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: arret }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(arretService.update).toHaveBeenCalledWith(arret);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const arret = new Arret();
        spyOn(arretService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ arret });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: arret }));
        saveSubject.complete();

        // THEN
        expect(arretService.create).toHaveBeenCalledWith(arret);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const arret = { id: 123 };
        spyOn(arretService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ arret });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(arretService.update).toHaveBeenCalledWith(arret);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackVilleById', () => {
        it('Should return tracked Ville primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackVilleById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
