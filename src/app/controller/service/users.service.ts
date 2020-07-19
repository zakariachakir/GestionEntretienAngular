import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Users} from '../model/users.model';
import {Observable} from 'rxjs';
import {UrlconfigurationService} from "./urlconfiguration.service";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private urls = this.urlconfigurationService.urldb+'/GestionEntretien/Login/';
  private urlu = this.urlconfigurationService.urldb +'/GestionEntretien/Login/update';
  private urld = this.urlconfigurationService.urldb+'/GestionEntretien/Login/delete/';
  private urlfind = this.urlconfigurationService.urldb+'/GestionEntretien/Login/username/';
  private _user = new Users();
  get user(): Users {
    return this._user;
  }

  set user(value: Users) {
    this._user = value;
  }

  constructor(private http: HttpClient,private urlconfigurationService: UrlconfigurationService) { }
  public save(user: Users) {
   return  this.http.post<number>(this.urls, user);
  }
  public update(user: Users) {
   return  this.http.put<number>(this.urlu, user);
  }
  public delete(username: string) {
   return  this.http.delete<number>(this.urld + '/' + username);
  }

  public findAll(): Observable<Users[]>{
    return this.http.get<Users[]>(this.urls);
  }
  public findbyUsername(user: string): Observable<Users> {
   return  this.http.get<Users>(this.urlfind + user);
  }


}
