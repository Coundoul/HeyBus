import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AgenceService } from '../service/agence.service';

import { AgenceComponent } from './agence.component';

describe('Component Tests', () => {
  describe('Agence Management Component', () => {
    let comp: AgenceComponent;
    let fixture: ComponentFixture<AgenceComponent>;
    let service: AgenceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AgenceComponent],
      })
        .overrideTemplate(AgenceComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AgenceComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AgenceService);

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
      expect(comp.agences?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
