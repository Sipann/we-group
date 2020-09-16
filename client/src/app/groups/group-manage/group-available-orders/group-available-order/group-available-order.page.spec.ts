import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupAvailableOrderPage } from './group-available-order.page';

describe('GroupAvailableOrderPage', () => {
  let component: GroupAvailableOrderPage;
  let fixture: ComponentFixture<GroupAvailableOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupAvailableOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupAvailableOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
