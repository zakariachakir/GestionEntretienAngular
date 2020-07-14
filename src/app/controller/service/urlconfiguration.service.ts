import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlconfigurationService {
  /* !!!! ici vous devez changer l'url de communication avec BD sous la forme 'lien:Port' (sans ajout de http:;;) */
private _urldb = 'localhost:9091';
  /* !!!! ici vous devez l'url du front end sous la forme lien:Port (sans ajout de http://) */
private _urlpageaccueil = 'localhost:4201';


  get urldb(): string {
    return this._urldb;
  }

  get urlpageaccueil(): string {
    return this._urlpageaccueil;
  }

  constructor() { }
}
