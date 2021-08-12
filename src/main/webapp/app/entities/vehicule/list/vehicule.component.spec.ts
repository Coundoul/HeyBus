import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VehiculeService } from '../service/vehicule.service';

import { VehiculeComponent } from './vehicule.component';

describe('Component Tests', () => {
  describe('Vehicule Management Component', () => {
    let comp: VehiculeComponent;
    let fixture: ComponentFixture<VehiculeComponent>;
    let service: VehiculeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VehiculeComponent],
      })
        .overrideTemplate(VehiculeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VehiculeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(VehiculeService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.vehicules?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
