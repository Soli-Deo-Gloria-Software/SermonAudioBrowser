import { AfterViewInit, Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, take, takeUntil, tap } from 'rxjs/operators';
import { EnumParse } from '../../utilities';
import { BibleBook, BibleBookNames } from '@soli-deo-gloria-software/bible-books';
import { SermonAudioSeries } from '../../models/sermon-audio-series.model';
import { SermonAudioSermon } from '../../models/sermon-audio-sermon.model';
import { SermonAudioSpeaker } from '../../models/sermon-audio-speaker.model';
import { SermonAudioServiceService } from '../../services/sermon-audio-service.service';
import { ActivatedRoute } from '@angular/router';
import { IBibleReference } from '@soli-deo-gloria-software/bible-reference-finder';

@Component({
    selector: 'app-sermon-list',
    templateUrl: './sermon-list.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SermonListComponent implements OnInit, AfterViewInit, OnDestroy {
  sermons$!: Observable<SermonAudioSermon[]>;
  speakers$!: Observable<SermonAudioSpeaker[]>;
  series$!: Observable<SermonAudioSeries[]>;
  searchKeyword: string = '';
  bibleBook = BibleBook;
  bibleBookNames = BibleBookNames;
  selectedBook?: BibleBook = undefined;
  bibleBooks: BibleBook[] = [];
  chapterFrom?: number;
  chapterTo?: number;
  verseFrom?: number;
  verseTo?: number;
  speaker: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  seriesID: number = 0;
  searchSpinner = 'default';
  sermonId: number = 0;
  referenceFilter: IBibleReference | undefined;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _saService: SermonAudioServiceService, private _spinner: NgxSpinnerService, private _route: ActivatedRoute) { 
    Object.keys(this.bibleBook).filter(key => isNaN(<any>key))
    .forEach(key => {
      let book = EnumParse(this.bibleBook, key);
      if (book)
        this.bibleBooks.push(book);
    });

    this._route.queryParamMap
    .pipe(
      debounceTime(100),
      take(1)
    )
    .subscribe({
      next: query => {
        let speaker = query.get('speaker');
        let series = query.get('series');
        let sermonId = query.get('sermonId');

        if (speaker){
            this.speaker = speaker;
        }

        if (series && !isNaN(+series)) {
          this.seriesID = +series;
        }

        if (sermonId && !isNaN(+sermonId)) {
          this.sermonId = +sermonId;
        }

        this.pageNumber = 1;
        this.getSermons();
      }
    })
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
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
    
    this.sermons$ = this._saService.getSermons(this.pageNumber, this.pageSize, this.searchKeyword, this.referenceFilter?.Book.Book, this.referenceFilter?.StartingChapter, this.referenceFilter?.EndingChapter, this.referenceFilter?.StartingVerse, this.referenceFilter?.EndingVerse, this.speaker, this.seriesID, this.sermonId).pipe(
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
    if (this.seriesID != seriesID){
      this.seriesID = seriesID;
      this.search();
    }
  }

  selectSpeaker(speakerName: string){
    if (this.speaker != speakerName){
      this.speaker = speakerName;
      this.search();
    }
  }

  onReferencesUpdated(refs: IBibleReference[]) {
    if (refs && refs.length) {
      this.referenceFilter = refs[0];
    } else {
      this.referenceFilter = undefined;
    }
  }

  pageChanged(){
    this.getSermons();
  }
}
