import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; 
import { catchError, of, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'any'
})
export class ApiServiceService {

  constructor(private http: HttpClient) { }
  getUserDetails() { 
    return this.http.get( environment.apiURL+'/getUserInfo')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Handle 404 Not Found error
            console.error('not authenticated');
          } else if (error.status === 500) {
            // Handle 500 Internal Server Error
            console.error('Internal server error');
          } else {
            // Handle other errors
            console.error('An error occurred:', error);
          }
          return of(error.message); // Rethrow the error to be handled by the subscriber
        })
      );
    
  }
}
