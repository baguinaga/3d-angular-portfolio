import { Component } from '@angular/core';

@Component({
  selector: 'app-fullpage',
  templateUrl: './fullpage.component.html',
  styleUrls: ['./fullpage.component.less'],
})
export class FullpageComponent {
  config;
  fullpage_api: any;

  constructor() {
    this.config = {
      // fullpage.js config
      licenseKey: 'gplv3-license',
      anchors: ['firstPage', 'secondPage', 'thirdPage', 'lastPage'],
      menu: '#menu',
      navigation: true,
      navigationPosition: 'right',
      afterResize: (): void => {},
      afterLoad: (): void => {},
    };
  }

  getRef(fullPageRef: any): void {
    this.fullpage_api = fullPageRef;
  }
}
