import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(private store: Store<any>) { }

  ngOnInit() {
  }

  generateMnemonic(){
    this.store.dispatch({type:"ACCOUNT_GENERATE_MNEMONIC"})
  }

  generateKeys(){
    this.store.dispatch({type:"ACCOUNT_GENERATE_KEYS"})    
  }

  create(){
    this.store.dispatch({type:"ACCOUNT_CREATE"})    
  }
  
}
