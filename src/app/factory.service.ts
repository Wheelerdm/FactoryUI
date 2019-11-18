import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Factory } from './factory'; 
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError,  tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FactoryService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };
  
  private factoryUrl = environment.apiUrl;  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  
  private log(message: string) {
    this.messageService.add(`FactoryService: ${message}`);
  }

  addFactory (factory: Factory): Observable<Factory> {
    return this.http.post<Factory>(this.factoryUrl, factory)
      .pipe(
        catchError(this.handleError('addFactory', factory))
      );
  }
  updateFactory (factory: Factory): Observable<Factory> {
    const url = `${this.factoryUrl}/${factory.id}`;
    return this.http.put<Factory>(url, factory)
      .pipe(
        catchError(this.handleError('updateFactory', factory))
      );
  }
  deleteFactory (id: Number): Observable<{}> {
    const url = `${this.factoryUrl}/${id}`;
    return this.http.delete<Factory>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError('deleteFactory', id))
      );
  }
  getRootFactory(): Observable<Factory> {
    // return of(this.FACTORIES);
    //return this.FACTORIES;
    return this.http.get<Factory>(this.factoryUrl)
    .pipe(
      tap(_ => this.log('fetched factories')),
      catchError(this.handleError<Factory>('getRootFactory'))
    );
  }

  //generates a random int between min & max
  generateChildName(min, max): string {  
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }
  
/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}

