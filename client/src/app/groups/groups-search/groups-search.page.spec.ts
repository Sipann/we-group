import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupsSearchPage } from './groups-search.page';

describe('GroupsSearchPage', () => {
  let component: GroupsSearchPage;
  let fixture: ComponentFixture<GroupsSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupsSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
