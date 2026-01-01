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
  spinnerId: string = '';
  esvResponse: EsvResponse;
  descriptionChunks: DescriptionChunk[][];
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

    if (!this.descriptionChunks || this.descriptionChunks.length == 0)
    {
      this.sermon.moreInfoText = `Scripture: ${this.sermon.bibleText}\n${this.sermon.moreInfoText}`;
      this.descriptionChunks = [[]];
      let paragraphs = this.sermon.moreInfoText.split('\n').filter(text => text);
      let parsed = this.bibleParser.parse(this.sermon.moreInfoText);
      parsed.forEach(hit => hit.BibleReferences.forEach(ref => {
        if (!bibleRefs.includes(ref.Canonical)){
          bibleRefs += `${ref.Canonical}; `;
        }
      }))

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

      paragraphs.forEach(paragraph => {
        let hitFound = false;
        if (parsed && parsed.length > 0){
          let chunks: DescriptionChunk[] = [];
          parsed.forEach(hit => {
            let currentIndex = 0;
            if (hit.BibleReferences.length == 1){
              if (paragraph.includes(hit.ProcessedText))
              {
                hitFound = true;
                  let startIndex = paragraph.indexOf(hit.ProcessedText, currentIndex);
                  let textBefore = paragraph.substring(currentIndex, startIndex);
                  currentIndex = startIndex + hit.ProcessedText.length;
                  if (textBefore) {
                    chunks.push({Text: textBefore, CanonicalBibleReference: undefined});
                  }
                  chunks.push({Text: hit.ProcessedText, CanonicalBibleReference: hit.BibleReferences[0].Canonical});
                  this.descriptionChunks.push([...chunks]);
              }
            }
            else {
              hit.BibleReferences.forEach(ref => {
                if (!bibleRefs.includes(ref.Canonical)){
                  bibleRefs += `; ${ref.Canonical}`;
                }
                if (paragraph.includes(ref.ParsedText)) {
                  hitFound = true;
                  let startIndex = paragraph.indexOf(ref.ParsedText, currentIndex);
                  let textBefore = paragraph.substring(currentIndex, startIndex);
                  currentIndex = startIndex + ref.ParsedText.length;
                  if (textBefore) {
                    chunks.push({Text: textBefore, CanonicalBibleReference: undefined});
                  }
                  chunks.push({Text: ref.ParsedText, CanonicalBibleReference: ref.Canonical});
                  this.descriptionChunks.push([...chunks]);
                }
              })
            }
          })
        }

        if (!hitFound) {
          this.descriptionChunks.push([{Text: paragraph, CanonicalBibleReference: undefined}])
        }
      });
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
