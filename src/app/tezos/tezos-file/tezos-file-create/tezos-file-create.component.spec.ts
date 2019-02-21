import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosFileCreateComponent } from './tezos-file-create.component';

describe('TezosFileCreateComponent', () => {
  let component: TezosFileCreateComponent;
  let fixture: ComponentFixture<TezosFileCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosFileCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosFileCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
