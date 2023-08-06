import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SermonAudioV2ResponseWrapper } from '../models/sermon-audio-v2-response-wrapper.model';
import { SermonAudioSermon } from '../models/sermon-audio-sermon.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { BibleBook, OsisBookAbbreviations } from '../models/enums/bible-book';
import { SermonAudioSpeaker } from '../models/sermon-audio-speaker.model';
import { SermonAudioSeries } from '../models/sermon-audio-series.model';

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

  public getSermons(pageNumber: number, pageSize: number, keyword?: string, book?: BibleBook, chapterFrom?: number, chapterTo?: number, verseFrom?: number, verseTo?: number, speaker?: string, seriesID?: number) : Observable<SermonAudioV2ResponseWrapper<SermonAudioSermon>>{
    let params: HttpParams = new HttpParams();

    params = params.append('page', pageNumber);
    params = params.append('pageSize', pageSize);

    if (keyword)
    {
      params = params.append('searchKeyword', encodeURIComponent(keyword));
    }

    if (book)
    {
      let osis = OsisBookAbbreviations[book];
      params = params.append('book', osis);
    }

    if (chapterFrom && chapterFrom > 0)
    {
      params = params.append('chapter', chapterFrom);
      
      if (chapterTo && chapterTo > 0){
        params = params.append('chapterEnd', chapterTo);
      }
    }

    if (verseFrom && verseFrom > 0)
    {
      params = params.append('verse', verseFrom);
      
      if (verseTo && verseTo > 0){
        params = params.append('verseEnd', verseTo);
      }
    }

    if (speaker)
    {
      params = params.append('speakerName', speaker);
    }

    if (seriesID){
      params = params.append('series', seriesID);
    }

    return this._httpClient.get<any>(`${this._baseApiURL}/sermons`, {params: params}).pipe(
      map(results => 
      {
        let body: SermonAudioV2ResponseWrapper<SermonAudioSermon> = JSON.parse(results.body);
        return body;
      }));
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
