import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoxxianComponent } from './voxxian.component';

describe('VoxxianComponent', () => {
  let component: VoxxianComponent;
  let fixture: ComponentFixture<VoxxianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoxxianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoxxianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
