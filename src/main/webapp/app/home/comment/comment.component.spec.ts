jest.mock('app/core/auth/account.service');
jest.mock('@angular/router');

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';

import { CommentComponent } from './comment.component';

describe('Component Tests', () => {
  describe('Search Component', () => {
    let comp: CommentComponent;
    let fixture: ComponentFixture<CommentComponent>;
    let mockAccountService: AccountService;
    let mockRouter: Router;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [CommentComponent],
          providers: [AccountService, Router],
        })
          .overrideTemplate(CommentComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(CommentComponent);
      comp = fixture.componentInstance;
      mockAccountService = TestBed.inject(AccountService);
      mockAccountService.identity = jest.fn(() => of(null));
      mockAccountService.getAuthenticationState = jest.fn(() => of(null));
      mockRouter = TestBed.inject(Router);
    });

 
  });
});
