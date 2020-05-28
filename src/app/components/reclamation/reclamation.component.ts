import { Component, OnInit } from '@angular/core';
import {Car} from '../../controller/model/car';
import {CarService} from '../../controller/service/car.service';
import {Reclamation} from '../../controller/model/reclamation.model';
import {ReclamationService} from '../../controller/service/reclamation.service';
import {MenuItem, SelectItem} from 'primeng';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {

  value: boolean;
  cancel: boolean;
  displayDialog: boolean;
  displayDialogM: boolean;

  reclamation = new Reclamation();

  selectedReclamation: Reclamation;

  newReclamation: boolean;

  materiels: Array<any>;


  cols: any[];

  locales: Array<any>;
  constructor(private reclamationService: ReclamationService, private toast: ToastrService) { }


  ngOnInit() {
    this.reclamationService.findAll();
    this.cols = [
      { field: 'reference', header: 'Réference' },
      { field: 'reclamentName', header: 'Réclament' },
      { field: 'date', header: 'Date' },
      { field: 'objet', header: 'Objet' },
      { field: 'description', header: 'Description' },
      { field: 'nomLocale', header: 'Locale' },
      { field: 'nomMateriel', header: 'Matériel' },
      { field: 'etat', header: 'Etat' }
    ];
  }
  showDialogToAdd() {
    this.newReclamation = true;
    this.reclamation = new Reclamation();
    this.displayDialog = true;
    this.displayDialogM = false;
    this.cancel = true;
  }

  showDialogToAddM() {

    this.newReclamation = true;
    this.reclamation = new Reclamation();
    this.displayDialogM = true;
    this.displayDialog = false;
    this.cancel = true;
  }

  save() {
    const reclamations = this.reclamationService.reclamationsFounded;
    if (this.newReclamation) {
      console.log(sessionStorage.getItem('username'));
      this.saveReclamation(this.reclamation, sessionStorage.getItem('username'));
      reclamations.push(this.reclamation);
      } else {
      reclamations[this.reclamationService.reclamationsFounded.indexOf(this.selectedReclamation)] = this.reclamation;
    }
    this.reclamationService.reclamationsFounded = reclamations;
  }

  delete() {
    const index = this.reclamationService.reclamationsFounded.indexOf(this.selectedReclamation);
    this.reclamationService.reclamationsFounded = this.reclamationService.reclamationsFounded.filter((val, i) => i !== index);
    this.reclamationService.delete(this.selectedReclamation.reference);
    this.reclamation = null;
    this.displayDialog = false;
    this.displayDialogM = false;
  }

  onRowSelect(event) {
    this.newReclamation = false;
    this.reclamation = this.cloneReclamation(event.data);
    if (this.reclamation.nomMateriel === 'Pas de materiel' || this.reclamation.nomMateriel == null) {
      this.displayDialog = true;
    } else {
      this.displayDialogM = true;
    }
    this.cancel = false;
  }

  cloneReclamation(r: Reclamation): Reclamation {
    const reclamation = new Reclamation();
    for (const prop in r) {
      reclamation[prop] = r[prop];
    }
    return reclamation;
  }

  get reclamationsFounded(): Reclamation[] {
    return this.reclamationService.reclamationsFounded;
  }

  public reclamationSeen(reclamation: Reclamation) {
    if (reclamation.etat === 'Sous Traitement') {
      this.toast.warning('la reclamation est deja vue');
    } else if (reclamation.etat === 'Bien Traitée') {
      this.toast.warning('la reclamation est bien traitée, vous pouvez pas faire cette action');
    } else {
      this.reclamationService.reclamationSeen(reclamation.reference);
      }
    }
    public saveReclamation(reclamation: Reclamation, userneme: string) {
    this.reclamationService.save(reclamation, userneme).subscribe(
      data => {
        if (data === -1) {
          console.log('reclamation existe deja ');
        } else if (data === -2) {
          console.log('reclament not found');
          this.toast.error('erreur vuillez vous connecter à nouveau');
        } else if (data === -3) {
          console.log('locale undefined');
          this.toast.warning('merci de choisir un locale');
        } else {
          console.log('reclamation saved');
          this.toast.success('Reclamation enregitrée');
          this.reclamationService.findAll();
          this.reclamation = null;
          this.displayDialog = false;
          this.displayDialogM = false;
        }
      }, error => {
        console.log('error in the save link');
        this.toast.error('erreur du serveur merci d\' actualiser la page');
      }
    );
    }
  }
