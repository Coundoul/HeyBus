import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IncidentDetailComponent } from './incident-detail.component';

describe('Component Tests', () => {
  describe('Incident Management Detail Component', () => {
    let comp: IncidentDetailComponent;
    let fixture: ComponentFixture<IncidentDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [IncidentDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ incident: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(IncidentDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(IncidentDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load incident on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.incident).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
