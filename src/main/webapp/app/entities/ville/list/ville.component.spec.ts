import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VilleService } from '../service/ville.service';

import { VilleComponent } from './ville.component';

describe('Component Tests', () => {
  describe('Ville Management Component', () => {
    let comp: VilleComponent;
    let fixture: ComponentFixture<VilleComponent>;
    let service: VilleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VilleComponent],
      })
        .overrideTemplate(VilleComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VilleComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(VilleService);

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
      expect(comp.villes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
