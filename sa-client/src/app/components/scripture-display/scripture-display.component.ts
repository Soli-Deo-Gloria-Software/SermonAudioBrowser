import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { EsvPassageMetadata } from 'src/app/models/Esv/esv-passage-metadata.model';

@Component({
  selector: 'app-scripture-display',
  templateUrl: './scripture-display.component.html',
  standalone: false
})
export class ScriptureDisplayComponent implements OnInit {
  @Input() reference: string;
  @Input() parsed: number[];
  @Input() scriptureHtml: SafeHtml;

  constructor(private _sanitizer: DomSanitizer) {
  }

  audioLink: SafeResourceUrl = '';
  ngOnInit():void {
    if (this.parsed && this.parsed.length == 2){
      let startIndex = this.parsed[0];
      let endIndex = this.parsed[1];
      let src = `https://audio.esv.org/david-cochran-heath/mq/${startIndex}-${endIndex}.mp3`;
      this.audioLink = this._sanitizer.bypassSecurityTrustResourceUrl(src);
    }
  }
}
