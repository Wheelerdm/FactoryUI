import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryEditorComponent } from './factory-editor.component';

describe('FactoryEditorComponent', () => {
  let component: FactoryEditorComponent;
  let fixture: ComponentFixture<FactoryEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoryEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
