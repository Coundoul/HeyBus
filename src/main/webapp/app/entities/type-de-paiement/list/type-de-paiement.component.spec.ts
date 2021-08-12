import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TypeDePaiementService } from '../service/type-de-paiement.service';

import { TypeDePaiementComponent } from './type-de-paiement.component';

describe('Component Tests', () => {
  describe('TypeDePaiement Management Component', () => {
    let comp: TypeDePaiementComponent;
    let fixture: ComponentFixture<TypeDePaiementComponent>;
    let service: TypeDePaiementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TypeDePaiementComponent],
      })
        .overrideTemplate(TypeDePaiementComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TypeDePaiementComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TypeDePaiementService);

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
      expect(comp.typeDePaiements?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
