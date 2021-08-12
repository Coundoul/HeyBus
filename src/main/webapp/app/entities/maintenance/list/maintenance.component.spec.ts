import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MaintenanceService } from '../service/maintenance.service';

import { MaintenanceComponent } from './maintenance.component';

describe('Component Tests', () => {
  describe('Maintenance Management Component', () => {
    let comp: MaintenanceComponent;
    let fixture: ComponentFixture<MaintenanceComponent>;
    let service: MaintenanceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MaintenanceComponent],
      })
        .overrideTemplate(MaintenanceComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MaintenanceComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MaintenanceService);

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
      expect(comp.maintenances?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
