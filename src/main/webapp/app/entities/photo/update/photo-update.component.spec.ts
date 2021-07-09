jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PhotoService } from '../service/photo.service';
import { IPhoto, Photo } from '../photo.model';
import { ITransporteur } from 'app/entities/transporteur/transporteur.model';
import { TransporteurService } from 'app/entities/transporteur/service/transporteur.service';

import { PhotoUpdateComponent } from './photo-update.component';

describe('Component Tests', () => {
  describe('Photo Management Update Component', () => {
    let comp: PhotoUpdateComponent;
    let fixture: ComponentFixture<PhotoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let photoService: PhotoService;
    let transporteurService: TransporteurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PhotoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PhotoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PhotoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      photoService = TestBed.inject(PhotoService);
      transporteurService = TestBed.inject(TransporteurService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Transporteur query and add missing value', () => {
        const photo: IPhoto = { id: 456 };
        const transporteur: ITransporteur = { id: 16825 };
        photo.transporteur = transporteur;

        const transporteurCollection: ITransporteur[] = [{ id: 58879 }];
        spyOn(transporteurService, 'query').and.returnValue(of(new HttpResponse({ body: transporteurCollection })));
        const additionalTransporteurs = [transporteur];
        const expectedCollection: ITransporteur[] = [...additionalTransporteurs, ...transporteurCollection];
        spyOn(transporteurService, 'addTransporteurToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ photo });
        comp.ngOnInit();

        expect(transporteurService.query).toHaveBeenCalled();
        expect(transporteurService.addTransporteurToCollectionIfMissing).toHaveBeenCalledWith(
          transporteurCollection,
          ...additionalTransporteurs
        );
        expect(comp.transporteursSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const photo: IPhoto = { id: 456 };
        const transporteur: ITransporteur = { id: 89006 };
        photo.transporteur = transporteur;

        activatedRoute.data = of({ photo });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(photo));
        expect(comp.transporteursSharedCollection).toContain(transporteur);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const photo = { id: 123 };
        spyOn(photoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ photo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: photo }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(photoService.update).toHaveBeenCalledWith(photo);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const photo = new Photo();
        spyOn(photoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ photo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: photo }));
        saveSubject.complete();

        // THEN
        expect(photoService.create).toHaveBeenCalledWith(photo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const photo = { id: 123 };
        spyOn(photoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ photo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(photoService.update).toHaveBeenCalledWith(photo);
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
