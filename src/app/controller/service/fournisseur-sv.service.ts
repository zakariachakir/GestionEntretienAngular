import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FournisseurSV} from '../model/fournisseurSV.model';
import {Reclamation} from '../model/reclamation.model';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class FournisseurSVService {

  private _foundedFourniseurs = new Array<FournisseurSV>();
  private url = 'http://localhost:8090/GestionEntretien/fournisseur/';
  constructor(private http: HttpClient) { }

  public save(fournisseur: FournisseurSV) {
    this.http.post<number>(this.url, fournisseur).subscribe(
      data => {
        if (data === 1) {
          console.log('success fournisseur saved');
          this.findAll();
        } else {
          console.log('fournisseur existe deja');
          alert('fournisseur existe deja');
        }
      }, error => {
        console.log('error in the link to save fournisseur');
      }
    );
  }
  public findAll() {
    this.http.get<Array<FournisseurSV>>(this.url).subscribe(
      data => {
        this._foundedFourniseurs = data.reverse();
        console.log('Fournisurs founded');
        console.log('ha data: ' + data.length);
      }, error => {
        console.log(error);
        console.log('error in the link findAll');
      }
    );
  }
  public update(fournisseur: FournisseurSV) {
    this.http.put<number>(this.url + 'update', fournisseur).subscribe(
      data => {
        if (data === 1) {
          console.log('fournisseur updated');
        } else {
          console.log('fournisseur not updated');
        }
      }, error => {
        console.log('error in the link');
      }
    );
  }
  public delete(nom: string, adress: string) {
    this.http.delete<number>(this.url + 'deleteFournisseur/' + nom + '/' + adress).subscribe(
      data => {
        if (data === 1) {
          console.log('fournisseur deleted');
        } else {
          console.log('fournisseur not deleted');
        }
      }, error => {
        console.log('error in the link');
      }
    );
  }

  get foundedFourniseurs(): FournisseurSV[] {
    return this._foundedFourniseurs;
  }

  set foundedFourniseurs(value: FournisseurSV[]) {
    this._foundedFourniseurs = value;
  }

}
