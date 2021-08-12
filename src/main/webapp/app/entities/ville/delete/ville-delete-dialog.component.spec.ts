jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { VilleService } from '../service/ville.service';

import { VilleDeleteDialogComponent } from './ville-delete-dialog.component';

describe('Component Tests', () => {
  describe('Ville Management Delete Component', () => {
    let comp: VilleDeleteDialogComponent;
    let fixture: ComponentFixture<VilleDeleteDialogComponent>;
    let service: VilleService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VilleDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(VilleDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(VilleDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(VilleService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
