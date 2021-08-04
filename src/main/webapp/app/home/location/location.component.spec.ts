jest.mock('app/core/auth/account.service');
jest.mock('@angular/router');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';

import { LocationComponent } from './location.component';

describe('Component Tests', () => {
  describe('Home Component', () => {
    let comp: LocationComponent;
    let fixture: ComponentFixture<LocationComponent>;
    let mockAccountService: AccountService;
    let mockRouter: Router;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [LocationComponent],
          providers: [AccountService, Router],
        })
          .overrideTemplate(LocationComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(LocationComponent);
      comp = fixture.componentInstance;
      mockAccountService = TestBed.inject(AccountService);
      mockAccountService.identity = jest.fn(() => of(null));
      mockAccountService.getAuthenticationState = jest.fn(() => of(null));
      mockRouter = TestBed.inject(Router);
    });

    it('Should call accountService.getAuthenticationState on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(mockAccountService.getAuthenticationState).toHaveBeenCalled();
    });

    it('Should call accountService.isAuthenticated when it checks authentication', () => {
      // WHEN
      comp.isAuthenticated();

      // THEN
      expect(mockAccountService.isAuthenticated).toHaveBeenCalled();
    });

  });
});
