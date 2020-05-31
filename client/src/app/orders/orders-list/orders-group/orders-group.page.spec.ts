import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrdersGroupPage } from './orders-group.page';

describe('OrdersGroupPage', () => {
  let component: OrdersGroupPage;
  let fixture: ComponentFixture<OrdersGroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersGroupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
