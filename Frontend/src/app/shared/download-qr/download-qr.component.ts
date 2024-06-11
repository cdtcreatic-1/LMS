import { Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { selectDataShared } from 'src/app/store/selectors/global.selector';
import html2canvas from 'html2canvas';
import { GlobalButtonsComponent } from '../global-buttons/global-buttons.component';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
    selector: 'app-download-qr',
    templateUrl: './download-qr.component.html',
    styleUrls: ['./download-qr.component.css'],
    standalone: true,
    imports: [QRCodeModule, GlobalButtonsComponent],
})
export class DownloadQrComponent implements OnInit {
  dataQr: string = '';

  public qrCodeDownloadLink: any = '';
  constructor(private store: Store<AppState>) {
    this.store.select(selectDataShared).subscribe((data) => {
      this.dataQr = data.dataQr;
    });
  }

  ngOnInit(): void {}

  onChangeURL(url: any) {
    this.qrCodeDownloadLink = url;
  }

  downloadQr() {
    const myDivToConvert = document.getElementById('capture');
    html2canvas(myDivToConvert!).then((canvas) => {
      const imageData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.setAttribute('download', 'GreenTradeQR.png');
      link.setAttribute('href', imageData);
      link.click();
    });
  }
}
