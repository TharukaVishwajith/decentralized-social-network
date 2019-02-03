import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcoinComponent } from './testcoin.component';

describe('TestcoinComponent', () => {
  let component: TestcoinComponent;
  let fixture: ComponentFixture<TestcoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestcoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestcoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
