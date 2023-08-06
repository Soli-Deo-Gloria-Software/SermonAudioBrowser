import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EsvResponse } from '../models/Esv/esv-response.model';

@Injectable({
  providedIn: 'root'
})
export class ScriptureService {
  private _baseUrl: string = '';
  constructor(private _httpClient: HttpClient) { 
    this._baseUrl = environment.proxyEsvApi;
  }

  public GetScripture(query: string): Observable<EsvResponse> {
    let params: HttpParams = new HttpParams();
    params = params.append("q", query);
    return this._httpClient.get<any>(`${this._baseUrl}/search`, { params: params }).pipe(
      map(results => {
        if (results.body) {
          let response: EsvResponse = JSON.parse(results.body)
          return response;
        }

        return results.results;
      })
    );
  }
}
