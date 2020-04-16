import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderArchivePage } from './order-archive.page';

describe('OrderArchivePage', () => {
  let component: OrderArchivePage;
  let fixture: ComponentFixture<OrderArchivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderArchivePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderArchivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
