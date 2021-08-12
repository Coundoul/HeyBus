import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmploye } from '../employe.model';
import { EmployeService } from '../service/employe.service';
import { EmployeDeleteDialogComponent } from '../delete/employe-delete-dialog.component';

@Component({
  selector: 'jhi-employe',
  templateUrl: './employe.component.html',
})
export class EmployeComponent implements OnInit {
  employes?: IEmploye[];
  isLoading = false;

  constructor(protected employeService: EmployeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.employeService.query().subscribe(
      (res: HttpResponse<IEmploye[]>) => {
        this.isLoading = false;
        this.employes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEmploye): number {
    return item.id!;
  }

  delete(employe: IEmploye): void {
    const modalRef = this.modalService.open(EmployeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.employe = employe;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
