import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RevenuService } from '../service/revenu.service';

import { RevenuComponent } from './revenu.component';

describe('Component Tests', () => {
  describe('Revenu Management Component', () => {
    let comp: RevenuComponent;
    let fixture: ComponentFixture<RevenuComponent>;
    let service: RevenuService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RevenuComponent],
      })
        .overrideTemplate(RevenuComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RevenuComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RevenuService);

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
      expect(comp.revenus?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
