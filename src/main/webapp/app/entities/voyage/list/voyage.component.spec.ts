import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VoyageService } from '../service/voyage.service';

import { VoyageComponent } from './voyage.component';

describe('Component Tests', () => {
  describe('Voyage Management Component', () => {
    let comp: VoyageComponent;
    let fixture: ComponentFixture<VoyageComponent>;
    let service: VoyageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VoyageComponent],
      })
        .overrideTemplate(VoyageComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VoyageComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(VoyageService);

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
      expect(comp.voyages?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
