import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRevenu } from '../revenu.model';

@Component({
  selector: 'jhi-revenu-detail',
  templateUrl: './revenu-detail.component.html',
})
export class RevenuDetailComponent implements OnInit {
  revenu: IRevenu | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ revenu }) => {
      this.revenu = revenu;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
