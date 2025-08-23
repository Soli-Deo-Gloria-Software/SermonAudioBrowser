import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { SermonAudioServiceService } from 'src/app/services/sermon-audio-service.service';
import * as utilities from 'src/app/utilities';

@Component({
    selector: 'app-waveform',
    templateUrl: './waveform.component.html',
    styleUrls: [],
    standalone: false
})
export class WaveformComponent implements OnInit, AfterViewInit {
  peaks$: Observable<number[]>;
  @Input() sermonId: number;
  @Input() height: number;
  @Input() maxHeight: number;
  @Input() maxNumberOfPeaks: number;
  spinnerId: string = '';
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  peakWidth:number;
  constructor(private _sermonAudioClient: SermonAudioServiceService, private _spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinnerId = utilities.randomString();
  }

  ngOnDestroy(): void {
    //If a user navigates away, terminate all api requests
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
   }

  ngAfterViewInit(): void {
    this._spinner.show(this.spinnerId);
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

        //Convert to percents.
        peaks = peaks.map(val => val * 100);
        let max = Math.max(...peaks)
        if (max < 75) {
          peaks = peaks.map(peak => peak = peak + (1 / 20))
        }
        this.peakWidth = (100/peaks.length) - utilities.peakGutterPercent;
        return peaks;
      }),
      catchError(() => {
        let peaks = utilities.DefaultWaveform(this.maxNumberOfPeaks);
        this.peakWidth = (100/peaks.length) - utilities.peakGutterPercent;
        return of(peaks);
      }),
      tap(() => 
      {
        this._spinner.hide(this.spinnerId);
      })
    );
  }
}
