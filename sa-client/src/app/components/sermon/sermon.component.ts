import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SermonAudioSermon } from 'src/app/models/sermon-audio-sermon.model';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { ScriptureService } from 'src/app/services/scripture.service';
import { randomString } from 'src/app/utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { BibleParser } from '@soli-deo-gloria-software/bible-reference-finder';
import { EsvResponse } from 'src/app/models/Esv/esv-response.model';

@Component({
  selector: 'app-sermon',
  templateUrl: './sermon.component.html',
  styles: [
  ]
})
export class SermonComponent implements OnInit {
  @Input() sermon: SermonAudioSermon;
  @Output() seriesSelected: EventEmitter<number> = new EventEmitter();
  @Output() speakerSelected: EventEmitter<string> = new EventEmitter();

  sermonAudioUrl: SafeResourceUrl;
  sermonAudioVideoUrl: SafeResourceUrl;
  hasVideo: boolean;
  videoThumbnailUrl: SafeResourceUrl;
  showVideo: boolean = false;
  showAudio: boolean = false;
  showDescription: boolean = false;
  scriptureHtml: SafeHtml;
  spinnerId: string = '';
  esvResponse: EsvResponse;
  esvIndex: number = 0;
  showScriptureDropDown: boolean = false;
  descriptionChunks: string[] = [];
  bibleParser: BibleParser = new BibleParser();
  constructor(private sanitizer: DomSanitizer, private _scriptureService: ScriptureService, private _spinner: NgxSpinnerService) { 
    this.spinnerId = randomString();
  }

  ngOnInit(): void {
    this.sermonAudioUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://embed.sermonaudio.com/player/a/${this.sermon.sermonID}/`);
    if (this.sermon.media.video.length > 0)
    {
      this.sermonAudioVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://embed.sermonaudio.com/player/v/${this.sermon.sermonID}/`);
      this.hasVideo = true;
    }
  }

  toggleDescription(){
    this.showDescription = !this.showDescription;
    let bibleRefs = this.sermon.bibleText;

    if (this.showDescription){
      if (this.sermon.moreInfoText)
      {
        let parsed = this.bibleParser.parse(this.sermon.moreInfoText);
        if (parsed && parsed.length > 0){
          parsed.forEach(hit => {
            hit.BibleReferences.forEach(ref => {
              bibleRefs += `; ${ref.Canonical}`
            })
          })
        }

        this.descriptionChunks = this.sermon.moreInfoText.split('\n').filter(chunk => chunk);
      }
  
      if (!this.scriptureHtml && bibleRefs) {
        this._spinner.show(this.spinnerId);
        this._scriptureService.GetScripture(bibleRefs).subscribe(result => {
          this.esvResponse = result;
          this.showScriptureDropDown = this.esvResponse.passage_meta.length > 1;

          console.log(result);
          if (result.passages){
            this.scriptureHtml = this.sanitizer.bypassSecurityTrustHtml(result.passages[0]);
          }
        }, error => console.log(error))
        .add(() => this._spinner.hide(this.spinnerId));
      }
    }
  }

  scriptureChanged(){
    this.scriptureHtml = this.sanitizer.bypassSecurityTrustHtml(this.esvResponse.passages[this.esvIndex]);
  }

  selectSeries(seriesID: number){
    this.seriesSelected.emit(seriesID);
  }

  selectSpeaker(speakerName: string)
  {
    this.speakerSelected.emit(speakerName);
  }
}
