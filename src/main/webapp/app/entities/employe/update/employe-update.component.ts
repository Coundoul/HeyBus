import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEmploye, Employe } from '../employe.model';
import { EmployeService } from '../service/employe.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/service/position.service';
import { ITransporteur } from 'app/entities/transporteur/transporteur.model';
import { TransporteurService } from 'app/entities/transporteur/service/transporteur.service';

@Component({
  selector: 'jhi-employe-update',
  templateUrl: './employe-update.component.html',
})
export class EmployeUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  positionsSharedCollection: IPosition[] = [];
  transporteursSharedCollection: ITransporteur[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    prenom: [],
    dateNaissance: [],
    matrimoniale: [],
    telephone: [null, [Validators.required]],
    nbreEnfant: [],
    photo: [],
    account: [],
    user: [],
    position: [null, Validators.required],
    transporteur: [],
  });

  constructor(
    protected employeService: EmployeService,
    protected userService: UserService,
    protected positionService: PositionService,
    protected transporteurService: TransporteurService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employe }) => {
      this.updateForm(employe);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const employe = this.createFromForm();
    if (employe.id !== undefined) {
      this.subscribeToSaveResponse(this.employeService.update(employe));
    } else {
      this.subscribeToSaveResponse(this.employeService.create(employe));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackPositionById(index: number, item: IPosition): number {
    return item.id!;
  }

  trackTransporteurById(index: number, item: ITransporteur): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmploye>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(employe: IEmploye): void {
    this.editForm.patchValue({
      id: employe.id,
      nom: employe.nom,
      prenom: employe.prenom,
      dateNaissance: employe.dateNaissance,
      matrimoniale: employe.matrimoniale,
      telephone: employe.telephone,
      nbreEnfant: employe.nbreEnfant,
      photo: employe.photo,
      account: employe.account,
      user: employe.user,
      position: employe.position,
      transporteur: employe.transporteur,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, employe.user);
    this.positionsSharedCollection = this.positionService.addPositionToCollectionIfMissing(
      this.positionsSharedCollection,
      employe.position
    );
    this.transporteursSharedCollection = this.transporteurService.addTransporteurToCollectionIfMissing(
      this.transporteursSharedCollection,
      employe.transporteur
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.positionService
      .query()
      .pipe(map((res: HttpResponse<IPosition[]>) => res.body ?? []))
      .pipe(
        map((positions: IPosition[]) =>
          this.positionService.addPositionToCollectionIfMissing(positions, this.editForm.get('position')!.value)
        )
      )
      .subscribe((positions: IPosition[]) => (this.positionsSharedCollection = positions));

    this.transporteurService
      .query()
      .pipe(map((res: HttpResponse<ITransporteur[]>) => res.body ?? []))
      .pipe(
        map((transporteurs: ITransporteur[]) =>
          this.transporteurService.addTransporteurToCollectionIfMissing(transporteurs, this.editForm.get('transporteur')!.value)
        )
      )
      .subscribe((transporteurs: ITransporteur[]) => (this.transporteursSharedCollection = transporteurs));
  }

  protected createFromForm(): IEmploye {
    return {
      ...new Employe(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      dateNaissance: this.editForm.get(['dateNaissance'])!.value,
      matrimoniale: this.editForm.get(['matrimoniale'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      nbreEnfant: this.editForm.get(['nbreEnfant'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      account: this.editForm.get(['account'])!.value,
      user: this.editForm.get(['user'])!.value,
      position: this.editForm.get(['position'])!.value,
      transporteur: this.editForm.get(['transporteur'])!.value,
    };
  }
}
