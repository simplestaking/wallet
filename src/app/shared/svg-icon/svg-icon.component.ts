import { Component, OnInit, Input  } from '@angular/core';

@Component({
  selector: 'svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent implements OnInit {

  @Input() icon;
  
  constructor() { }

  ngOnInit() {
  }

}
