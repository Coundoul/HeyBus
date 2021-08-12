import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IArret } from '../arret.model';

@Component({
  selector: 'jhi-arret-detail',
  templateUrl: './arret-detail.component.html',
})
export class ArretDetailComponent implements OnInit {
  arret: IArret | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ arret }) => {
      this.arret = arret;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
