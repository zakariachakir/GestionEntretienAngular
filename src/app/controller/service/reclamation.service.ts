import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Car} from '../model/car';
import {Reclamation} from '../model/reclamation.model';
import {ReclamationComponent} from '../../components/reclamation/reclamation.component';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  private reclamation = new Reclamation();
  // tslint:disable-next-line:variable-name
  private _reclamationsFounded = new Array<Reclamation>();
  private _foundedReclamationsNonTraiter = new Array<Reclamation>();
  private url = 'http://localhost:8090/GestionEntretien/reclamation/';
  constructor(private http: HttpClient, private toast: ToastrService) {
  }

  public findAll() {
    this.http.get<Array<Reclamation>>(this.url).subscribe(
      data => {
          this.reclamationsFounded = data.reverse();
          console.log('Reclamations data : ' + data.length);
      }, error => {
        console.log('error in the link');
        this.toast.error('erreur du serveur merci d\' actualiser la page');
      }
    );

  }

  public save(reclamation: Reclamation, username: string) {
    this.http.post<number>(this.url + username, reclamation).subscribe(
      data => {
        if (data === -1) {
          console.log('reclamation existe deja ');
        } else if (data === -2) {
          console.log('reclament not found');
          this.toast.error('erreur vuillez vous connecter à nouveau');
        } else {
          console.log('reclamation saved');
          this.toast.success('Reclamation enregitrée');
          this.findAll();
        }
      }, error => {
        console.log('error in the save link');
        this.toast.error('erreur du serveur merci d\' actualiser la page');
      }
    );
  }

  public update(reclamation: Reclamation) {
    this.http.put<number>(this.url + 'update', reclamation).subscribe(
      data => {
        if (data === -1) {
          console.log('reclamation not found');
          this.toast.error('erreur vuillez vous connecter à nouveau');
        } else {
          console.log('reclamation updated');
          this.toast.info('Reclamation modifiée');
          this.findAll();
        }
      }, error => {
        console.log('error in the update link');
        this.toast.error('erreur du serveur merci d\' actualiser la page');
      }
    );
  }

  public delete(reference: string) {
    this.http.delete<number>(this.url + 'deleteReclamation/' + reference).subscribe(
      data => {
        if (data === -1) {
          console.log('reclamation not found');
          this.toast.error('erreur vuillez vous connecter à nouveau');
        } else {
          console.log('reclamation deleted');
          this.toast.success('Reclamaton supprimée');
        }
      }, error => {
        console.log('error in the delete link');
        this.toast.error('erreur du serveur merci d\' actualiser la page');
      }
    );
  }

  public reclamationSeen(reference: string) {
    this.http.get<number>(this.url + reference).subscribe(
      data => {
        console.log('success reclamation seen');
        this.toast.success('Reclamation vue');
        this.findAll();
      }, error => {
        console.log('erroror in the link');
        this.toast.error('erreur du serveur merci d\' actualiser la page');
      }
    );
  }

  public findAllReclamationsNonTraiter() {
   this.http.get<Array<Reclamation>>(this.url + 'reclamations').subscribe(
     data => {
       this.foundedReclamationsNonTraiter = data.reverse();
       console.log('Reclamation non traitées data: ' + data.length);
     }, error => {
       console.log('error in the link');
       this.toast.error('erreur du serveur merci d\' actualiser la page');
     }
   );
  }


  get foundedReclamationsNonTraiter(): Reclamation[] {
    return this._foundedReclamationsNonTraiter;
  }

  set foundedReclamationsNonTraiter(value: Reclamation[]) {
    this._foundedReclamationsNonTraiter = value;
  }

  get reclamationsFounded(): Reclamation[] {
    if (this._reclamationsFounded == null) {
      this._reclamationsFounded = new Array<Reclamation>();
    }
    return this._reclamationsFounded;
  }

  set reclamationsFounded(value: Reclamation[]) {
    this._reclamationsFounded = value;
  }
}
