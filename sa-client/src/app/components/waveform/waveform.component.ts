import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { WaveformPeak } from 'src/app/models/waveform-peak.model';
import { SermonAudioServiceService } from 'src/app/services/sermon-audio-service.service';
import * as utilities from 'src/app/utilities';

@Component({
    selector: 'app-waveform',
    templateUrl: './waveform.component.html',
    styleUrls: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class WaveformComponent implements OnInit, AfterViewInit {
  peaks$!: Observable<WaveformPeak[]>;
  @Input() sermonId!: number;
  @Input() height!: number;
  @Input() maxHeight!: number;
  @Input() maxNumberOfPeaks: number = 1500;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @Output() loadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  peakWidth!:number;
  constructor(private _sermonAudioClient: SermonAudioServiceService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    //If a user navigates away, terminate all api requests
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
   }

  ngAfterViewInit(): void {
    this.loadingChange.emit(true);
    this.peaks$ = this._sermonAudioClient.downloadWaveform(this.sermonId).pipe( 
      takeUntil(this.ngUnsubscribe),
      map(result => {
        let peaks: number[] = [];
        if (this.maxNumberOfPeaks >= result.length)
        {
          peaks = result;
        }
        else{
          peaks = utilities.reduceWaveform(result, this.maxNumberOfPeaks);
        }

        //Convert to percents - use relative height to make better use of space.
        let max = Math.max(...peaks)
        let adjustment = 1 - max - .005;
        peaks = peaks.map(peak => peak = (peak + (adjustment * (peak/max))) * 100);
        this.peakWidth = Math.max((100/peaks.length) - utilities.peakGutterPercent, 0);
        return peaks;
      }),
      catchError(() => {
        let peaks = utilities.DefaultWaveform(this.maxNumberOfPeaks);
        this.peakWidth = (100/peaks.length) - utilities.peakGutterPercent;
        return of(peaks);
      }),
      map(peaks => {
        let index = 0;
        let indexedPeaks: WaveformPeak[] = [];
        peaks.forEach(peak => {
          indexedPeaks.push({
            index: index,
            peakHeight: peak
          });
          index++;
        })
        return indexedPeaks;
      }),
      tap(() => 
      {
        this.loadingChange.emit(false);
      })
    );
  }
}
