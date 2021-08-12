import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypeDePaiement } from '../type-de-paiement.model';

@Component({
  selector: 'jhi-type-de-paiement-detail',
  templateUrl: './type-de-paiement-detail.component.html',
})
export class TypeDePaiementDetailComponent implements OnInit {
  typeDePaiement: ITypeDePaiement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeDePaiement }) => {
      this.typeDePaiement = typeDePaiement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
