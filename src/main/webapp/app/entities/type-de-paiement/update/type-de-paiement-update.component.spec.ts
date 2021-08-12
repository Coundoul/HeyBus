jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TypeDePaiementService } from '../service/type-de-paiement.service';
import { ITypeDePaiement, TypeDePaiement } from '../type-de-paiement.model';

import { TypeDePaiementUpdateComponent } from './type-de-paiement-update.component';

describe('Component Tests', () => {
  describe('TypeDePaiement Management Update Component', () => {
    let comp: TypeDePaiementUpdateComponent;
    let fixture: ComponentFixture<TypeDePaiementUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let typeDePaiementService: TypeDePaiementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TypeDePaiementUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TypeDePaiementUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TypeDePaiementUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      typeDePaiementService = TestBed.inject(TypeDePaiementService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const typeDePaiement: ITypeDePaiement = { id: 456 };

        activatedRoute.data = of({ typeDePaiement });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(typeDePaiement));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const typeDePaiement = { id: 123 };
        spyOn(typeDePaiementService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ typeDePaiement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: typeDePaiement }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(typeDePaiementService.update).toHaveBeenCalledWith(typeDePaiement);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const typeDePaiement = new TypeDePaiement();
        spyOn(typeDePaiementService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ typeDePaiement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: typeDePaiement }));
        saveSubject.complete();

        // THEN
        expect(typeDePaiementService.create).toHaveBeenCalledWith(typeDePaiement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const typeDePaiement = { id: 123 };
        spyOn(typeDePaiementService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ typeDePaiement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(typeDePaiementService.update).toHaveBeenCalledWith(typeDePaiement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
