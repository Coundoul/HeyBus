jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RevenuService } from '../service/revenu.service';
import { IRevenu, Revenu } from '../revenu.model';

import { RevenuUpdateComponent } from './revenu-update.component';

describe('Component Tests', () => {
  describe('Revenu Management Update Component', () => {
    let comp: RevenuUpdateComponent;
    let fixture: ComponentFixture<RevenuUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let revenuService: RevenuService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RevenuUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RevenuUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RevenuUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      revenuService = TestBed.inject(RevenuService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const revenu: IRevenu = { id: 456 };

        activatedRoute.data = of({ revenu });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(revenu));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const revenu = { id: 123 };
        spyOn(revenuService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ revenu });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: revenu }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(revenuService.update).toHaveBeenCalledWith(revenu);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const revenu = new Revenu();
        spyOn(revenuService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ revenu });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: revenu }));
        saveSubject.complete();

        // THEN
        expect(revenuService.create).toHaveBeenCalledWith(revenu);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const revenu = { id: 123 };
        spyOn(revenuService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ revenu });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(revenuService.update).toHaveBeenCalledWith(revenu);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
