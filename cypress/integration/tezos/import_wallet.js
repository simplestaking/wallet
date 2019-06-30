/// <reference types="Cypress" />

import { of } from 'rxjs';
import { withLatestFrom, flatMap, map, tap, catchError, delay } from 'rxjs/operators';
import { initializeWallet, transaction, confirmOperation } from 'tezos-wallet'

context('Tezos Trezor Wallet', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5200/tezos/wallet/start')
        // cy.visit('https://wallet.simplestaking.com/')
    })

    
    it('Activate Tezos account', () => {

        console.log('[Activate Tezos account][env]', environment )

        of([]).pipe(

            // wait until sodium is ready
            initializeWallet(stateWallet => ({
                // secretKey: state.tezos.tezosWalletDetail.secretKey,
                // publicKey: state.tezos.tezosWalletDetail.publicKey,
                // publicKeyHash: state.tezos.tezosWalletDetail.publicKeyHash,
                // // set tezos node
                // node: state.tezos.tezosNode.api,
                // // set wallet type: WEB, TREZOR_ONE, TREZOR_T
                // type: action.payload.walletType,
                // // set HD path for HW wallet
                // path: state.tezos.tezosWalletDetail.path ? state.tezos.tezosWalletDetail.path : undefined
            })),

            // send xtz
            transaction(stateWallet => ({
                // to: state.tezos.tezosOperationTransaction.form.to,
                // amount: state.tezos.tezosOperationTransaction.form.amount,
                // fee: state.tezos.tezosOperationTransaction.form.fee,
            })),
        )

    })

    // it('Import Tezos wallet from Trezor', () => {

    //     // click on get started button 
    //     cy.get('.mat-flat-button').click()

    //     // wait for trezor connect to initialize
    //     cy.wait(3000);

    //     // launch trezor connect popup
    //     cy.get('body').then(($body) => {
    //         if ($body.find('.tezos-trezor-connect > .mat-flat-button').length === 0) {
    //             cy.get('.trezor-disconnected > .mat-flat-button').click()
    //         }
    //      })
 
    //     // click on select address
    //     cy.get('.tezos-trezor-connect > .mat-flat-button').click()

    //     // click on second row in address table
    //     cy.get('#mat-checkbox-52 > .mat-checkbox-layout > .mat-checkbox-inner-container',
    //         { timeout: 15000, force: true }).click()
    //     // test selector from Chrome Dev Tools
    //     // cy.now('get','#mat-checkbox-51 > .mat-checkbox-layout > .mat-checkbox-inner-container', { timeout: 10000 } ).then(($btn)=> { $btn.click() })

    //     // click on add contract 
    //     cy.get('#cdk-step-content-0-1 > .tezos-trezor-new > .tezos-trezor-new-next > .mat-flat-button').click()

    //     // add name 
    //     cy.get('#mat-input-0').type('test_account_1')

    //     // click on add contract 
    //     cy.get('#cdk-step-content-0-2 > .tezos-trezor-new > .tezos-trezor-new-next > .mat-flat-button').click()
        
    //     // // click on finish
    //     // cy.get('#cdk-step-content-0-3 > .tezos-trezor-new > .tezos-trezor-new-next > .mat-flat-button').click()

    // })

})
