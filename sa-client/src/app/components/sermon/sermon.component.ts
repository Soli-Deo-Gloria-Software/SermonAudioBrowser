import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SermonAudioSermon } from 'src/app/models/sermon-audio-sermon.model';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { ScriptureService } from 'src/app/services/scripture.service';
import { randomString } from 'src/app/utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { BibleParser } from '@Soli-Deo-Gloria-Software/bible-reference-finder';
import { EsvResponse } from 'src/app/models/Esv/esv-response.model';
import * as AvatarSize from 'src/app/models/enums/avatar-size'
import { DescriptionChunk } from 'src/app/models/description-chunk.model';

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
  scriptureHtml: SafeHtml;
  scriptureReference: string;
  scriptureAudioIndexes: number[];
  spinnerId: string = '';
  esvResponse: EsvResponse;
  descriptionChunks: [DescriptionChunk[]];
  bibleParser: BibleParser = new BibleParser();
  AvatarSize = AvatarSize.AvatarSize;
  maxNumberOfPeaks: number;
  toolTipScripture: SafeHtml;
  toolTipReference: string;
  toolTipIndexes: number[];
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
  }

  computePeakCount(innerWidth: number): number{
    let peaks:number = 900;
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
    let bibleRefs = this.sermon.bibleText;

    if (this.showDescription){
      if (this.sermon.moreInfoText && (!this.descriptionChunks || this.descriptionChunks[0].length == 0))
      {
        this.descriptionChunks = [[]];
        let paragraphs = this.sermon.moreInfoText.split('\n').filter(text => text);
        let parsed = this.bibleParser.parse(this.sermon.moreInfoText);
        paragraphs.forEach(paragraph => {
          let hitFound = false;
          if (parsed && parsed.length > 0){
            let chunks: DescriptionChunk[] = [];
            parsed.forEach(hit => {
              let currentIndex = 0;
              hit.BibleReferences.forEach(ref => {
                if (!bibleRefs.includes(ref.Canonical)){
                  bibleRefs += `; ${ref.Canonical}`;
                }
                if (paragraph.includes(ref.ParsedText)) {
                  hitFound = true;
                  let startIndex = paragraph.indexOf(ref.ParsedText, currentIndex);
                  let textBefore = paragraph.substring(currentIndex, startIndex);
                  currentIndex = startIndex + ref.ParsedText.length;
                  chunks.push({Text: textBefore, CanonicalBibleReference: undefined});
                  chunks.push({Text: ref.ParsedText, CanonicalBibleReference: ref.Canonical});
                  this.descriptionChunks.push(chunks);
                }
              })
            })
          }

          if (!hitFound) {
            this.descriptionChunks.push([{Text: paragraph, CanonicalBibleReference: undefined}])
          }
        });
        
      }
  
      if (!this.scriptureHtml && bibleRefs) {
        this.loadingChange(true);
        this._scriptureService.GetScripture(bibleRefs).subscribe(result => {
          this.esvResponse = result;

          console.log(result);
          if (result.passages){
            let refs = this.bibleParser.parse(bibleRefs);
            this.scriptureHtml = this.sanitizer.bypassSecurityTrustHtml(result.passages[0]);
            this.scriptureAudioIndexes = result.parsed[0];
            this.scriptureReference = refs[0].BibleReferences[0].Canonical;
          }
        }, error => console.log(error))
        .add(() => this.loadingChange(false));
      }
    }
  }

  scriptureChanged(canonical: string){
    if (canonical){
      this.toolTipReference = canonical;
      let index = -1;

      canonical = canonical.toLowerCase();
      this.esvResponse.passage_meta.forEach((meta) => {
        index++;

        let metaCanonical = meta.canonical.toLocaleLowerCase().replace(/^[\w\-\s]+$/, '');
        metaCanonical = encodeURIComponent(metaCanonical);
        metaCanonical = metaCanonical.replace('%E2%80%93', '-'); // esv api uses a strange encoding - have to manually replace the odd dash.
        metaCanonical = decodeURIComponent(metaCanonical);
        console.log(`comparing ${metaCanonical} and ${canonical}`);
        if (metaCanonical == canonical){
          this.toolTipScripture = this.sanitizer.bypassSecurityTrustHtml(this.esvResponse.passages[index]);
          this.toolTipIndexes = this.esvResponse.parsed[index];
          return;
        }
      })
    } else {
      this.toolTipScripture = "Error!"
    }
  }

  selectSeries(seriesID: number){
    this.seriesSelected.emit(seriesID);
  }

  selectSpeaker() {
    console.log('speaker select clicked')
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
