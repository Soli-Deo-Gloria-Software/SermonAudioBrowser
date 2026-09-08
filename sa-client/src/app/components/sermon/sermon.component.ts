import { Component, EventEmitter, input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { SermonAudioSermon } from '../../models/sermon-audio-sermon.model';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { ScriptureService } from '../../services/scripture.service';
import { randomString } from '../../utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { BibleParser, TextParagraph } from '@soli-deo-gloria-software/bible-reference-finder';
import { EsvResponse } from '../../models/Esv/esv-response.model';
import * as AvatarSize from '../../models/enums/avatar-size'

@Component({
  selector: 'app-sermon',
  templateUrl: './sermon.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class SermonComponent implements OnInit {
  sermon = input.required<SermonAudioSermon>();
  @Output() seriesSelected: EventEmitter<number> = new EventEmitter();
  @Output() speakerSelected: EventEmitter<string> = new EventEmitter();

  sermonAudioUrl!: SafeResourceUrl;
  sermonAudioVideoUrl!: SafeResourceUrl;
  hasVideo!: boolean;
  videoThumbnailUrl!: SafeResourceUrl;
  showVideo: boolean = false;
  showAudio: boolean = false;
  showDescription: boolean = false;
  spinnerId: string = '';
  esvResponse!: EsvResponse;
  descriptionParagraphs!: TextParagraph[];
  bibleTexts: string[] = [];
  bibleParser: BibleParser = new BibleParser();
  AvatarSize = AvatarSize.AvatarSize;
  maxNumberOfPeaks!: number;
  toolTipScripture!: SafeHtml;
  toolTipReference!: string;
  toolTipIndexes!: number[];
  sermonScriptures: string[] = [];
  avatarUrl: string|undefined;
  constructor(private sanitizer: DomSanitizer, private _scriptureService: ScriptureService, private _spinner: NgxSpinnerService) { 
  }

  ngOnInit(): void {
    let sermon = this.sermon();
    if (!sermon.speaker?.albumArtURL.includes('generic')) {
      this.avatarUrl = sermon.speaker?.roundedThumbnailImageURL;
    }

    this.spinnerId = randomString();
    this.sermonAudioUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://embed.sermonaudio.com/player/a/${sermon.sermonID}/`);
    if (sermon.media?.video.length ?? 0 > 0)
    {
      this.sermonAudioVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://embed.sermonaudio.com/player/v/${sermon.sermonID}/`);
      this.hasVideo = true;
    }

    this.maxNumberOfPeaks = this.computePeakCount(window.innerWidth);
    let scriptures = sermon.bibleText?.split(";") ?? [];
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

  toggleDescription() {
    if (!this.sermon().moreInfoText) {
      return;
    }
    this.showDescription = !this.showDescription;
    this.loadDescription(false);
  }

  loadDescription(skipScriptureLoad: boolean) {
    if (!this.descriptionParagraphs || this.descriptionParagraphs.length == 0)
    {
      let sermon = this.sermon();
      let parseText = `Scripture: ${sermon.bibleText}`;
      if (sermon.moreInfoText) {
        parseText += `\n${sermon.moreInfoText}`;
      }

      let parseResult = this.bibleParser.findAndSplitText(parseText);
      this.descriptionParagraphs = [];
      parseResult.Paragraphs.forEach((paragraph, index) => {
        if (index > 0) {
          this.descriptionParagraphs.push(paragraph);
        }

        paragraph.Segments.forEach(segment => {
          let canonical = segment.Reference?.getCanonical()
          if (canonical && !this.bibleTexts.includes(canonical)) {
            this.bibleTexts.push(canonical);
          }
        })
      })
      if (!skipScriptureLoad) {
        this.loadScripture();
      }
    }
  }

  loadScripture(canonical?: string) {
    if (!this.esvResponse) {
      if (!this.bibleTexts || this.bibleTexts.length === 0) {
        this.loadDescription(true);
      }

      let bibleRefs = this.bibleTexts.join('; ');
      if (bibleRefs) {
        this.loadingChange(true);
        this._scriptureService.GetScripture(bibleRefs).subscribe(result => {
          this.esvResponse = result;
        }, error => console.log(error))
        .add(() => {
          this.loadingChange(false);
          this.scriptureChanged(canonical);
        });
      }
    } else {
      this.scriptureChanged(canonical);
    }
  }

  private scriptureChanged(canonical?: string){
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

  selectSeries(seriesID: number|undefined){
    if (seriesID)
      this.seriesSelected.emit(seriesID);
  }

  selectSpeaker() {
    let sermon = this.sermon();
    if (sermon?.speaker)
      this.speakerSelected.emit(sermon.speaker.displayName);
  }

  loadingChange(showSpinner: boolean){
    if (showSpinner){
      this._spinner.show(this.spinnerId);
    } else {
      this._spinner.hide(this.spinnerId);
    }
  }
}
