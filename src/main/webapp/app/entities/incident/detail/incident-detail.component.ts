import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIncident } from '../incident.model';

@Component({
  selector: 'jhi-incident-detail',
  templateUrl: './incident-detail.component.html',
})
export class IncidentDetailComponent implements OnInit {
  incident: IIncident | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ incident }) => {
      this.incident = incident;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
