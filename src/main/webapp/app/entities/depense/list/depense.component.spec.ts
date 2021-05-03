import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DepenseService } from '../service/depense.service';

import { DepenseComponent } from './depense.component';

describe('Component Tests', () => {
  describe('Depense Management Component', () => {
    let comp: DepenseComponent;
    let fixture: ComponentFixture<DepenseComponent>;
    let service: DepenseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DepenseComponent],
      })
        .overrideTemplate(DepenseComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DepenseComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(DepenseService);

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
      expect(comp.depenses?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
