import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupOrderPage } from './group-order.page';

describe('GroupOrderPage', () => {
  let component: GroupOrderPage;
  let fixture: ComponentFixture<GroupOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
