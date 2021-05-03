import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ArretDetailComponent } from './arret-detail.component';

describe('Component Tests', () => {
  describe('Arret Management Detail Component', () => {
    let comp: ArretDetailComponent;
    let fixture: ComponentFixture<ArretDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ArretDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ arret: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ArretDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ArretDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load arret on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.arret).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
