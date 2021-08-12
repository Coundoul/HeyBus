import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { IncidentService } from '../service/incident.service';

import { IncidentComponent } from './incident.component';

describe('Component Tests', () => {
  describe('Incident Management Component', () => {
    let comp: IncidentComponent;
    let fixture: ComponentFixture<IncidentComponent>;
    let service: IncidentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [IncidentComponent],
      })
        .overrideTemplate(IncidentComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(IncidentComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(IncidentService);

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
      expect(comp.incidents?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
