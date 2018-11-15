import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as jsyaml from 'js-yaml';

@Component({
  selector: 'app-tezos-wallet-start',
  templateUrl: './tezos-wallet-start.component.html',
  styleUrls: ['./tezos-wallet-start.component.scss']
})
export class TezosWalletStartComponent implements OnInit {

  public deviceInfo
  public httpOptions
  public appUrl

  constructor(
    private deviceService: DeviceDetectorService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
  }

  download() {

    this.deviceInfo = this.deviceService.getDeviceInfo();
    console.log('[TezosWalletStart][device info]', this.deviceInfo.os)

    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'text/html'
      }),
      responseType: 'text' as 'text'
    }

    this.http.get('https://simplewallet.ams3.digitaloceanspaces.com/latest.yml', this.httpOptions).subscribe(response => {
      this.appUrl = 'https://simplewallet.ams3.digitaloceanspaces.com/' + jsyaml.safeLoadAll(response)[0].path

      const link = document.createElement('a');
      document.body.appendChild(link);
      link.href = this.appUrl;
      link.click();

    })

  }

}
