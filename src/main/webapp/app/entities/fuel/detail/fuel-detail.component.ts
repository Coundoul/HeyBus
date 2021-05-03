import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFuel } from '../fuel.model';

@Component({
  selector: 'jhi-fuel-detail',
  templateUrl: './fuel-detail.component.html',
})
export class FuelDetailComponent implements OnInit {
  fuel: IFuel | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fuel }) => {
      this.fuel = fuel;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
