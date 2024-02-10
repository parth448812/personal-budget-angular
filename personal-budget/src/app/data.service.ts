import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data: any;
  private dataUrl = 'http://localhost:3000/budget';

  constructor(private http: HttpClient) {}

  fetchData(): Observable<any[]> { // Return an Observable
    if (!this.data) {
      return this.http.get<any[]>(this.dataUrl);
    } else {
      return new Observable<any[]>(observer => {
        observer.next(this.data);
        observer.complete();
      });
    }
  }

  setData(data: any[]): void {
    this.data = data;
  }

  getData(): any[] {
    return this.data;
  }
}
