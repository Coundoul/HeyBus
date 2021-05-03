import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDepense } from '../depense.model';

@Component({
  selector: 'jhi-depense-detail',
  templateUrl: './depense-detail.component.html',
})
export class DepenseDetailComponent implements OnInit {
  depense: IDepense | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ depense }) => {
      this.depense = depense;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
