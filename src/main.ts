import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { TrezorConnect } from 'trezor-connect'

if (environment.production) {

  // add Google Analytics script to <head>
  const script = document.createElement('script');
  script.innerHTML = `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-114065646-1');`;
  document.head.appendChild(script);

  enableProdMode();
}

// hack remove after angular fixes issue
declare var fs: any;

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
