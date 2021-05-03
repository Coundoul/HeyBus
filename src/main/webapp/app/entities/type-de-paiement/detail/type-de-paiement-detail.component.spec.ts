import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypeDePaiementDetailComponent } from './type-de-paiement-detail.component';

describe('Component Tests', () => {
  describe('TypeDePaiement Management Detail Component', () => {
    let comp: TypeDePaiementDetailComponent;
    let fixture: ComponentFixture<TypeDePaiementDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TypeDePaiementDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ typeDePaiement: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TypeDePaiementDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TypeDePaiementDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load typeDePaiement on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.typeDePaiement).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
