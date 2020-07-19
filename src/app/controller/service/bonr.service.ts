import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BonsR} from '../model/bons-r.model';
import {UrlconfigurationService} from "./urlconfiguration.service";

@Injectable({
  providedIn: 'root'
})
export class BonrService {
  private url = this.urlconfigurationService.urldb+'/GestionEntretien/bonreparation/';
  private urlu = this.urlconfigurationService.urldb+'/GestionEntretien/bonreparation/update';
  private urld = this.urlconfigurationService.urldb+'/GestionEntretien/bonreparation/delete/';
  constructor(private http: HttpClient , private urlconfigurationService: UrlconfigurationService) {}

  public save(bonreparation: BonsR)  {
    return  this.http.post<number>(this.url, bonreparation);
  }

  public update(bonreparation: BonsR)  {
    return  this.http.put<number>(this.urlu, bonreparation);
  }
  public delete(reference: string)  {
    return  this.http.delete<number>(this.urld + reference);
  }
  public findAll(): Observable<BonsR[]> {
    return  this.http.get<BonsR[]>(this.url);
  }
}
