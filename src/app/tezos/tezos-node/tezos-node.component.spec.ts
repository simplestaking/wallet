import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TezosNodeComponent } from './tezos-node.component';

describe('TezosNodeComponent', () => {
  let component: TezosNodeComponent;
  let fixture: ComponentFixture<TezosNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TezosNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TezosNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
