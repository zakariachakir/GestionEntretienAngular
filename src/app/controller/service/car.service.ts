import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Car} from '../model/car';
import {Observable} from 'rxjs';
import {UrlconfigurationService} from "./urlconfiguration.service";

@Injectable({
  providedIn: 'root'
})
export class CarService {
private url = 'http://'+this.urlconfigurationService.urldb+'/GestionEntretien/vehicule/';
private urlu = 'http://'+this.urlconfigurationService.urldb+'/GestionEntretien/vehicule/update';
private urld = 'http://'+this.urlconfigurationService.urldb+'/GestionEntretien/vehicule/deleteVehicule/';
  constructor(private http: HttpClient, private urlconfigurationService: UrlconfigurationService) {}

  public save(car: Car)  {
   return  this.http.post<number>(this.url, car);
  }

  public update(car: Car)  {
   return  this.http.put<number>(this.urlu, car);
  }
  public delete(reference: string)  {
   return  this.http.delete<number>(this.urld + reference);
  }
  public findAll(): Observable<Car[]> {
   return  this.http.get<Car[]>(this.url);
  }

 }
