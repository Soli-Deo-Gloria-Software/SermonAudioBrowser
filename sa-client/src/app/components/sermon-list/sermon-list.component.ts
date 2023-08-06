import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { BibleBook } from 'src/app/models/enums/bible-book';
import { SermonAudioSeries } from 'src/app/models/sermon-audio-series.model';
import { SermonAudioSermon } from 'src/app/models/sermon-audio-sermon.model';
import { SermonAudioSpeaker } from 'src/app/models/sermon-audio-speaker.model';
import { SermonAudioServiceService } from 'src/app/services/sermon-audio-service.service';

@Component({
  selector: 'app-sermon-list',
  templateUrl: './sermon-list.component.html',
  styles: [
  ]
})
export class SermonListComponent implements OnInit, AfterViewInit, OnDestroy {
  sermons$: Observable<SermonAudioSermon[]>;
  speakers$: Observable<SermonAudioSpeaker[]>;
  series$: Observable<SermonAudioSeries[]>;
  searchKeyword: string = '';
  bibleBook = BibleBook;
  selectedBook?: BibleBook = undefined;
  bibleLabels = [];
  chapterFrom?: number;
  chapterTo?: number;
  verseFrom?: number;
  verseTo?: number;
  speaker: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  seriesID: number = 0;
  searchSpinner = 'fillerDueToJankyImplementation';
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _saService: SermonAudioServiceService, private _spinner: NgxSpinnerService) { 
    this.bibleLabels = Object.keys(this.bibleBook);
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.getSermons();
    this.getSpeakers();
    this.getSeries();
  }

  ngOnDestroy(): void {
    //If a user navigates away, terminate all api requests
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
   }

  search(){
    this.pageNumber = 1;
    
    //the ui blocks duplicate search requests with ngx-spinner; however, we should abandon the first request if user finds away to duplicate search requests.
    this.ngUnsubscribe.next();
    this.getSermons();
  }

  getSermons(){
    this._spinner.show(this.searchSpinner);
    
    this.sermons$ = this._saService.getSermons(this.pageNumber, this.pageSize, this.searchKeyword, this.selectedBook, this.chapterFrom, this.chapterTo, this.verseFrom, this.verseTo, this.speaker, this.seriesID).pipe(
      takeUntil(this.ngUnsubscribe),
      map(results => 
        {
          this.totalCount = results.totalCount;
          return results.results;
        }),
        tap(() => this._spinner.hide(this.searchSpinner))
    );
  }

  getSpeakers(){
    this.speakers$ = this._saService.getSpeakers().pipe(
      takeUntil(this.ngUnsubscribe),
      map(results => results.results)
    );
  }

  getSeries(){
    this.series$ = this._saService.getSeries().pipe(
      takeUntil(this.ngUnsubscribe),
      map(results => results.results)
    );
  }

  selectSeries(seriesID: number){
    this.seriesID = seriesID;
    this.search();
  }

  selectSpeaker(speakerName: string){
    this.speaker = speakerName;
    this.search();
  }

  pageChanged(){
    this.getSermons();
  }
}
