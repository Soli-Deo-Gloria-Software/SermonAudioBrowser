import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SermonAudioV2ResponseWrapper } from '../models/sermon-audio-v2-response-wrapper.model';
import { SermonAudioSermon } from '../models/sermon-audio-sermon.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { BibleBook, BibleBookOsisCodes } from '@soli-deo-gloria-software/bible-books';
import { SermonAudioSpeaker } from '../models/sermon-audio-speaker.model';
import { SermonAudioSeries } from '../models/sermon-audio-series.model';
import { IBibleReference } from '@soli-deo-gloria-software/bible-reference-finder';

@Injectable({
  providedIn: 'root'
})
export class SermonAudioServiceService {
  private _baseApiURL = '';
  constructor(private _httpClient: HttpClient) { 
    this._baseApiURL = environment.proxySermonApi;
  }

  public getSpeakers(): Observable<SermonAudioV2ResponseWrapper<SermonAudioSpeaker>>{
    return this._httpClient.get<any>(`${this._baseApiURL}/speakers`).pipe(map(results => {
      if (results.body)
      {
        let body: SermonAudioV2ResponseWrapper<SermonAudioSpeaker> = JSON.parse(results.body);
        return body;
      }

      return results.result;
    }));
  }

  public getSeries(): Observable<SermonAudioV2ResponseWrapper<SermonAudioSeries>>{
    return this._httpClient.get<any>(`${this._baseApiURL}/series`).pipe(map(results => {
      
      if (results.body)
      {
        let body: SermonAudioV2ResponseWrapper<SermonAudioSeries> = JSON.parse(results.body);
        body.results = body.results.sort((first, second) => 0 - (first.latest < second.latest ? -1 : 1));

        return body;
      }

      return results.result;
    }))
  }

  public getSermons(pageNumber: number, pageSize: number, keyword?: string, reference?: IBibleReference, speaker?: string, seriesID?: number, sermonId?: number) : Observable<SermonAudioV2ResponseWrapper<SermonAudioSermon>>{
    let params: HttpParams = new HttpParams();

    params = params.append('page', pageNumber);
    params = params.append('pageSize', pageSize);

    if (keyword)
    {
      params = params.append('searchKeyword', encodeURIComponent(keyword));
    }

    params = this.getReferenceParams(reference, params);

    if (speaker)
    {
      params = params.append('speakerName', speaker);
    }

    if (seriesID){
      params = params.append('series', seriesID);
    }

    if (sermonId && sermonId > 0){
      params = params.append('sermonIDs', sermonId)
    }

    return this._httpClient.get<any>(`${this._baseApiURL}/sermons`, {params: params}).pipe(
      map(results => 
      {
        let body: SermonAudioV2ResponseWrapper<SermonAudioSermon> = JSON.parse(results.body);
        return body;
      }));
  }

  private getReferenceParams(reference: IBibleReference|undefined, params: HttpParams) : HttpParams {
    if (!reference || !reference.Book) {
      return params;
    }

    params = params.append('book', reference.Book.OsisCode);

    if (reference.StartingChapter) {
      params = params.append('chapter', reference.StartingChapter);
    }

    if (reference.StartingVerse) {
      params = params.append('verse', reference.StartingVerse);
    }

    if (reference.EndingChapter) { 
        params = params.append('chapterEnd', reference.EndingChapter);
    }

    if (reference.EndingVerse) { 
        params = params.append('verseEnd', reference.EndingVerse);
    }

    return params;
  }

  public downloadWaveform(id: number): Observable<number[]>{
    let params: HttpParams = new HttpParams();
    params = params.append('peaksOnly', true);
    return this._httpClient.get<any>(`${this._baseApiURL}/sermons/${id}/waveform`, {params: params}).pipe(
      map(results => {
        let body: number[] = JSON.parse(results.body);
        return body;
      })
    );
  }
}
