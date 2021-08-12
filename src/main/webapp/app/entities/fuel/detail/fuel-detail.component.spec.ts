import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FuelDetailComponent } from './fuel-detail.component';

describe('Component Tests', () => {
  describe('Fuel Management Detail Component', () => {
    let comp: FuelDetailComponent;
    let fixture: ComponentFixture<FuelDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FuelDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ fuel: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(FuelDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FuelDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load fuel on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.fuel).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
