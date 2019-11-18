import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryCreatorComponent } from './factory-creator.component';

describe('FactoryCreatorComponent', () => {
  let component: FactoryCreatorComponent;
  let fixture: ComponentFixture<FactoryCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoryCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
