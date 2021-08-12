import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RevenuDetailComponent } from './revenu-detail.component';

describe('Component Tests', () => {
  describe('Revenu Management Detail Component', () => {
    let comp: RevenuDetailComponent;
    let fixture: ComponentFixture<RevenuDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RevenuDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ revenu: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RevenuDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RevenuDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load revenu on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.revenu).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
