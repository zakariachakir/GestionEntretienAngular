import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BonsC} from '../model/bons-c.model';
import {UrlconfigurationService} from "./urlconfiguration.service";

@Injectable({
  providedIn: 'root'
})
export class BoncService {
  private url = 'http://'+this.urlconfigurationService.urldb+'/GestionEntretien/boncarburant/';
  private urlu = 'http://'+this.urlconfigurationService.urldb+'/GestionEntretien/boncarburant/update';
  private urld = 'http://'+this.urlconfigurationService.urldb+'/GestionEntretien/boncarburant/delete/';
  constructor(private http: HttpClient, private urlconfigurationService: UrlconfigurationService) {}

  public save(boncarburant: BonsC)  {
    return  this.http.post<number>(this.url, boncarburant);
  }

  public update(boncarburant: BonsC)  {
    return  this.http.put<number>(this.urlu, boncarburant);
  }
  public delete(reference: string)  {
    return  this.http.delete<number>(this.urld + reference);
  }
  public findAll(): Observable<BonsC[]> {
    return  this.http.get<BonsC[]>(this.url);
  }
}
