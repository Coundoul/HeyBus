import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TransporteurService } from '../service/transporteur.service';

import { TransporteurComponent } from './transporteur.component';

describe('Component Tests', () => {
  describe('Transporteur Management Component', () => {
    let comp: TransporteurComponent;
    let fixture: ComponentFixture<TransporteurComponent>;
    let service: TransporteurService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TransporteurComponent],
      })
        .overrideTemplate(TransporteurComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TransporteurComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TransporteurService);

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
      expect(comp.transporteurs?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
