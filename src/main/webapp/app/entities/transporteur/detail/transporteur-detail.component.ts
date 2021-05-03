import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITransporteur } from '../transporteur.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-transporteur-detail',
  templateUrl: './transporteur-detail.component.html',
})
export class TransporteurDetailComponent implements OnInit {
  transporteur: ITransporteur | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transporteur }) => {
      this.transporteur = transporteur;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
