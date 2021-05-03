import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DepenseDetailComponent } from './depense-detail.component';

describe('Component Tests', () => {
  describe('Depense Management Detail Component', () => {
    let comp: DepenseDetailComponent;
    let fixture: ComponentFixture<DepenseDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DepenseDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ depense: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(DepenseDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DepenseDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load depense on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.depense).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
