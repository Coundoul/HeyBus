jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { VehiculeService } from '../service/vehicule.service';

import { VehiculeDeleteDialogComponent } from './vehicule-delete-dialog.component';

describe('Component Tests', () => {
  describe('Vehicule Management Delete Component', () => {
    let comp: VehiculeDeleteDialogComponent;
    let fixture: ComponentFixture<VehiculeDeleteDialogComponent>;
    let service: VehiculeService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VehiculeDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(VehiculeDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(VehiculeDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(VehiculeService);
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
