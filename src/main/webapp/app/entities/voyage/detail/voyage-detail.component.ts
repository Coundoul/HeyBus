import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVoyage } from '../voyage.model';

@Component({
  selector: 'jhi-voyage-detail',
  templateUrl: './voyage-detail.component.html',
})
export class VoyageDetailComponent implements OnInit {
  voyage: IVoyage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voyage }) => {
      this.voyage = voyage;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
