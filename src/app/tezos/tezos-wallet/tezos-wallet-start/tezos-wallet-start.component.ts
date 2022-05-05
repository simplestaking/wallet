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
  public donwloadUrl
  public donwloadUrlConfig
  public assetUrl = 'https://simplewallet.ams3.digitaloceanspaces.com/'


  constructor(
    private deviceService: DeviceDetectorService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
  }

  download() {

    this.deviceInfo = this.deviceService.getDeviceInfo();
    console.log('[TezosWalletStart][device info]', this.deviceInfo.os)

    // recognize host os
    if (this.deviceInfo.os === 'windows') {
      this.donwloadUrlConfig = this.assetUrl + 'latest.yml'
    } else if (this.deviceInfo.os === 'mac') {
      this.donwloadUrlConfig = this.assetUrl + 'latest-mac.yml'
    }

    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'text/html'
      }),
      responseType: 'text' as 'text'
    }

    // get config for donwload
    this.http.get(this.donwloadUrlConfig, this.httpOptions).subscribe(response => {
      console.log(response)
      this.donwloadUrl = this.assetUrl + jsyaml.safeLoadAll(response)[0].path
      this.startDonwload(this.donwloadUrl)
    })

  }

  // automaticly trigger download
  startDonwload(url) {
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = url
    link.click();
  }

}
