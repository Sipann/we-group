import { TestBed, async, inject } from '@angular/core/testing';

import { GuardManageGuard } from './guard-manage.guard';

describe('GuardManageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuardManageGuard]
    });
  });

  it('should ...', inject([GuardManageGuard], (guard: GuardManageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
