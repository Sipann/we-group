import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupAvailableOrdersPage } from './group-available-orders.page';

describe('GroupAvailableOrdersPage', () => {
  let component: GroupAvailableOrdersPage;
  let fixture: ComponentFixture<GroupAvailableOrdersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupAvailableOrdersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupAvailableOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
