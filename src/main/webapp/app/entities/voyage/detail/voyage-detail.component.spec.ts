import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VoyageDetailComponent } from './voyage-detail.component';

describe('Component Tests', () => {
  describe('Voyage Management Detail Component', () => {
    let comp: VoyageDetailComponent;
    let fixture: ComponentFixture<VoyageDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [VoyageDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ voyage: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(VoyageDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(VoyageDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load voyage on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.voyage).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
