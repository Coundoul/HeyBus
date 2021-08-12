import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EmployeService } from '../service/employe.service';

import { EmployeComponent } from './employe.component';

describe('Component Tests', () => {
  describe('Employe Management Component', () => {
    let comp: EmployeComponent;
    let fixture: ComponentFixture<EmployeComponent>;
    let service: EmployeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EmployeComponent],
      })
        .overrideTemplate(EmployeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmployeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EmployeService);

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
      expect(comp.employes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
