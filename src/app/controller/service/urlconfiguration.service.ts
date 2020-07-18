import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlconfigurationService {
  /* !!!! ici vous devez changer l'url de communication avec BD sous la forme 'lien:Port' (sans ajout de http:;;) */
private _urldb = 'fstentretien.herokuapp.com';
  /* !!!! ici vous devez l'url du front end sous la forme lien:Port (sans ajout de http://) */
private _urlpageaccueil = 'entretienfst.herokuapp.com';


  get urldb(): string {
    return this._urldb;
  }

  get urlpageaccueil(): string {
    return this._urlpageaccueil;
  }

  constructor() { }
}
