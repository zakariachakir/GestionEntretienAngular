import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Entretien} from '../model/entretien.model';
import {UrlconfigurationService} from "./urlconfiguration.service";

@Injectable({
  providedIn: 'root'
})
export class EntretienService {
  private url = this.urlconfigurationService.urldb+'/GestionEntretien/entretien/';
  private urld = this.urlconfigurationService.urldb+'/GestionEntretien/entretien/delete/';
  constructor(private http: HttpClient, private urlconfigurationService: UrlconfigurationService) {}

  public findAll(): Observable<Entretien[]> {
   return this.http.get<Entretien[]>(this.url);
  }

  public delete(reference: string) {
    this.http.delete<number>(this.urld + reference).subscribe(
      data => {
        console.log('success');

      },
      error => {
        console.log('error delete');
      }
    );
  }
}
