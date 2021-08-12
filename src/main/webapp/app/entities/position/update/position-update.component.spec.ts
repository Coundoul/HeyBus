jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PositionService } from '../service/position.service';
import { IPosition, Position } from '../position.model';
import { ISection } from 'app/entities/section/section.model';
import { SectionService } from 'app/entities/section/service/section.service';

import { PositionUpdateComponent } from './position-update.component';

describe('Component Tests', () => {
  describe('Position Management Update Component', () => {
    let comp: PositionUpdateComponent;
    let fixture: ComponentFixture<PositionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let positionService: PositionService;
    let sectionService: SectionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PositionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PositionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PositionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      positionService = TestBed.inject(PositionService);
      sectionService = TestBed.inject(SectionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Section query and add missing value', () => {
        const position: IPosition = { id: 456 };
        const section: ISection = { id: 99282 };
        position.section = section;

        const sectionCollection: ISection[] = [{ id: 17061 }];
        spyOn(sectionService, 'query').and.returnValue(of(new HttpResponse({ body: sectionCollection })));
        const additionalSections = [section];
        const expectedCollection: ISection[] = [...additionalSections, ...sectionCollection];
        spyOn(sectionService, 'addSectionToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ position });
        comp.ngOnInit();

        expect(sectionService.query).toHaveBeenCalled();
        expect(sectionService.addSectionToCollectionIfMissing).toHaveBeenCalledWith(sectionCollection, ...additionalSections);
        expect(comp.sectionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const position: IPosition = { id: 456 };
        const section: ISection = { id: 33760 };
        position.section = section;

        activatedRoute.data = of({ position });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(position));
        expect(comp.sectionsSharedCollection).toContain(section);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const position = { id: 123 };
        spyOn(positionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ position });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: position }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(positionService.update).toHaveBeenCalledWith(position);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const position = new Position();
        spyOn(positionService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ position });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: position }));
        saveSubject.complete();

        // THEN
        expect(positionService.create).toHaveBeenCalledWith(position);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const position = { id: 123 };
        spyOn(positionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ position });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(positionService.update).toHaveBeenCalledWith(position);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackSectionById', () => {
        it('Should return tracked Section primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSectionById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
