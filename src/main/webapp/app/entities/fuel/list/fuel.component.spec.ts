import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FuelService } from '../service/fuel.service';

import { FuelComponent } from './fuel.component';

describe('Component Tests', () => {
  describe('Fuel Management Component', () => {
    let comp: FuelComponent;
    let fixture: ComponentFixture<FuelComponent>;
    let service: FuelService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FuelComponent],
      })
        .overrideTemplate(FuelComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FuelComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FuelService);

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
      expect(comp.fuels?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
