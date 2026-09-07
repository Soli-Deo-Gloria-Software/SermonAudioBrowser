import { AfterViewInit, Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { EsvPassageMetadata } from 'src/app/models/Esv/esv-passage-metadata.model';

@Component({
  selector: 'app-scripture-display',
  templateUrl: './scripture-display.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ScriptureDisplayComponent implements OnInit {
  @Input() reference: string;
  @Input() parsed: number[];
  @Input() scriptureHtml: SafeHtml;
  showAudio: boolean = false;

  constructor(private _sanitizer: DomSanitizer) {
  }
  unsafeAudioLink: string = '';
  ngOnInit():void {
    if (this.parsed && this.parsed.length == 2){
      let startIndex = this.parsed[0];
      let endIndex = this.parsed[1];
      this.unsafeAudioLink = `https://audio.esv.org/david-cochran-heath/mq/${startIndex}-${endIndex}.mp3`;
    }
  }
}
