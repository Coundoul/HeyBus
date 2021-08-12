import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISection } from '../section.model';
import { SectionService } from '../service/section.service';
import { SectionDeleteDialogComponent } from '../delete/section-delete-dialog.component';

@Component({
  selector: 'jhi-section',
  templateUrl: './section.component.html',
})
export class SectionComponent implements OnInit {
  sections?: ISection[];
  isLoading = false;

  constructor(protected sectionService: SectionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.sectionService.query().subscribe(
      (res: HttpResponse<ISection[]>) => {
        this.isLoading = false;
        this.sections = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISection): number {
    return item.id!;
  }

  delete(section: ISection): void {
    const modalRef = this.modalService.open(SectionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.section = section;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
