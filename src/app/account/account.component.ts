import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  private account
  private account$
  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.account$ = this.store.select('account')
    this.account$.subscribe(data => this.account = data)
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
