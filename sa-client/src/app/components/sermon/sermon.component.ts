import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SermonAudioSermon } from 'src/app/models/sermon-audio-sermon.model';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { ScriptureService } from 'src/app/services/scripture.service';
import { randomString } from 'src/app/utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { BibleParser, TextParagraph } from '@soli-deo-gloria-software/bible-reference-finder';
import { EsvResponse } from 'src/app/models/Esv/esv-response.model';
import * as AvatarSize from 'src/app/models/enums/avatar-size'

@Component({
  selector: 'app-sermon',
  templateUrl: './sermon.component.html',
  standalone: false
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
  spinnerId: string = '';
  esvResponse: EsvResponse;
  descriptionParagraphs: TextParagraph[];
  bibleParser: BibleParser = new BibleParser();
  AvatarSize = AvatarSize.AvatarSize;
  maxNumberOfPeaks: number;
  toolTipScripture: SafeHtml;
  toolTipReference: string;
  toolTipIndexes: number[];
  sermonScriptures: string[] = [];
  constructor(private sanitizer: DomSanitizer, private _scriptureService: ScriptureService, private _spinner: NgxSpinnerService) { 
  }

  ngOnInit(): void {
    this.spinnerId = randomString();
    this.sermonAudioUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://embed.sermonaudio.com/player/a/${this.sermon.sermonID}/`);
    if (this.sermon.media.video.length > 0)
    {
      this.sermonAudioVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://embed.sermonaudio.com/player/v/${this.sermon.sermonID}/`);
      this.hasVideo = true;
    }

    this.maxNumberOfPeaks = this.computePeakCount(window.innerWidth);
    let scriptures = this.sermon.bibleText?.split(";") ?? [];
    scriptures.forEach(s => this.sermonScriptures.push(s.trim()))
  }

  computePeakCount(innerWidth: number): number{
    let peaks:number = 850;
    if (innerWidth <= 576){
      peaks = 150;
    } else if (innerWidth <= 768){
      peaks = 250;
    } else if (innerWidth <= 992){
      peaks = 500;
    } else if (innerWidth <= 1200){
      peaks = 750;
    }

    return peaks;
  }

  toggleDescription(){ //TODO: optimize
    this.showDescription = !this.showDescription;
    let bibleRefs = '';

    if (!this.descriptionParagraphs || this.descriptionParagraphs.length == 0)
    {
      if (this.sermon.moreInfoText) {
        this.sermon.moreInfoText = `Scripture: ${this.sermon.bibleText}\n${this.sermon.moreInfoText}`;
      } else {
        this.sermon.moreInfoText = `Scripture: ${this.sermon.bibleText}`;
      }

      let parseResult = this.bibleParser.parseAndSplit(this.sermon.moreInfoText);
      this.descriptionParagraphs = parseResult.Paragraphs;
      parseResult.Paragraphs.forEach(paragraph => {
        paragraph.Segments.forEach(segment => {
          if (segment.Reference?.Canonical && !bibleRefs.includes(segment.Reference.Canonical)) {
            bibleRefs += `${segment.Reference.Canonical}; `;
          }
        })
      })

      bibleRefs = bibleRefs.substring(0, Math.max(0, bibleRefs.length-2));

      if (bibleRefs) {
        this.loadingChange(true);
        this._scriptureService.GetScripture(bibleRefs).subscribe(result => {
          this.esvResponse = result;
        }, error => console.log(error))
        .add(() => {
          this.loadingChange(false)
        });
      }
    }
  }

  scriptureChanged(canonical: string){
    if (canonical){
      this.toolTipReference = canonical;

      canonical = canonical.toLowerCase();
      let index = this.esvResponse.passage_meta.findIndex(meta => meta.canonical.toLowerCase() == canonical);

      if (index > -1) {
        this.toolTipScripture = this.sanitizer.bypassSecurityTrustHtml(this.esvResponse.passages[index]);
        this.toolTipIndexes = this.esvResponse.parsed[index];
      } else {
        this.toolTipScripture = "Error!";
      }
    }
  }

  selectSeries(seriesID: number){
    this.seriesSelected.emit(seriesID);
  }

  selectSpeaker() {
    this.speakerSelected.emit(this.sermon.speaker.displayName);
  }

  loadingChange(showSpinner: boolean){
    if (showSpinner){
      this._spinner.show(this.spinnerId);
    } else {
      this._spinner.hide(this.spinnerId);
    }
  }
}
