import { Component, input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-scripture-display',
  templateUrl: './scripture-display.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ScriptureDisplayComponent implements OnInit {
  reference = input.required<string>();
  parsed = input.required<number[]>();
  scriptureHtml = input.required<SafeHtml>();
  showAudio: boolean = false;

  constructor(private _sanitizer: DomSanitizer) {
  }
  unsafeAudioLink: string = '';
  ngOnInit():void {
    let parsedValue = this.parsed();
    if (parsedValue && parsedValue.length == 2){
      let startIndex = parsedValue[0];
      let endIndex = parsedValue[1];
      this.unsafeAudioLink = `https://audio.esv.org/david-cochran-heath/mq/${startIndex}-${endIndex}.mp3`;
    }
  }
}
