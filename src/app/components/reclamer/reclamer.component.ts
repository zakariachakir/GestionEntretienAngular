import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmationService, MessageService, SelectItem} from 'primeng/api';
import {Reclamation} from '../../controller/model/reclamation.model';
import {ReclamationService} from '../../controller/service/reclamation.service';
import {Local} from '../../controller/model/local.model';
import {LocalService} from '../../controller/service/local.service';
import {MaterielService} from '../../controller/service/materiel.service';
import {Materiel} from '../../controller/model/materiel.model';
import {LocaldetailService} from '../../controller/service/localdetail.service';
import {Localdetail} from '../../controller/model/localdetail.model';
import {ToastrService} from 'ngx-toastr';
import {UrlconfigurationService} from "../../controller/service/urlconfiguration.service";

@Component({
  selector: 'app-reclamer',
  templateUrl: './reclamer.component.html',
  styleUrls: ['./reclamer.component.css']
})
export class ReclamerComponent implements OnInit {
  value: boolean;
  cancel: boolean;
  displayDialog: boolean;
  displayDialogM: boolean;

  reclamation = new Reclamation();

  selectedReclamation: Reclamation;


  newReclamation: boolean;

  reclamations = Array<any>();


  userform: FormGroup;
  userform1: FormGroup;

  selectedLocale = new  Local();

  cols: any[];
  cancelmodify: boolean;

  constructor(private fb: FormBuilder, private urlconfigurationService: UrlconfigurationService, private reclamationService: ReclamationService,
              private localService: LocalService,
              private localdetailService: LocaldetailService,
              private toast: ToastrService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  confirm() {
    this.confirmationService.confirm({
      message: 'Voulez-vous vraiment effectuer cette action?',
      accept: () => {
        this.delete();
      }
    });
  }

  ngOnInit() {

    this.reclamationService.findbyreclament(localStorage.getItem('username'));
    this.localService.findAll();
    this.cols = [
      { field: 'reference', header: 'Référence' },
      { field: 'reclamentName', header: 'Réclamant' },
      { field: 'date', header: 'Date' },
      { field: 'objet', header: 'Objet' },
      { field: 'description', header: 'Description' },
      { field: 'nomLocale', header: 'Local' },
      { field: 'nomMateriel', header: 'Matériel' },
      { field: 'etat', header: 'État' }
    ];
    this.userform = this.fb.group({
      objet: new FormControl('', Validators.required),
      local: new FormControl('', Validators.required),
      description : new FormControl('', Validators.required),
    });


    this.userform1 = this.fb.group({
      objett: new FormControl('', Validators.required),
      locale: new FormControl('', Validators.required),
      desc: new FormControl('', Validators.required),
    });

  }
/*
  start() {
    if (localStorage.getItem('type') === 'administrateur') {

      this.reclamationService.findAll();
      this.reclamations = this.reclamationsFounded;
    } else {
      console.log(localStorage.getItem('nom') + ', ' + localStorage.getItem('prenom'));
      this.reclamationService.findbyreclament(localStorage.getItem('nom') + ', ' + localStorage.getItem('prenom'));
      this.reclamations = this.foundedReclamationsemploye;
    }
  }
*/
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

     // this.reclamationService.save(this.reclamation, localStorage.getItem('username'));
      this.saveReclamation(this.reclamation, localStorage.getItem('username'));
      reclamations.push(this.reclamation);
    } else {
      reclamations[this.reclamationService.reclamationsFounded.indexOf(this.selectedReclamation)] = this.reclamation;
      // update locale associe;

      this.updateReclamation(this.reclamation);
    }
    this.reclamationService.reclamationsFounded = reclamations;


  }

  delete() {
    this.deleteReclamation(this.selectedReclamation.reference);
    this.reclamation = null;
    this.displayDialog = false;
    this.displayDialogM = false;
  }

  onRowSelect(event) {
    this.newReclamation = false;
    this.reclamation = this.cloneReclamation(event.data);
    if (this.reclamation.etat === 'Bien Traitée') {
      this.cancelmodify = true;
    } else {
      this.cancelmodify = false;
    }
    if (this.reclamation.nomMateriel === 'Pas de matériel' || this.reclamation.nomMateriel == null) {
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


  get foundedLocales(): Local[] {
    return this.localService.foudedLocales;
  }
  get foundedReclamationsemploye(): Reclamation[] {
    return this.reclamationService.foundedReclamationsemploye;
  }



  public saveReclamation(reclamation: Reclamation, userneme: string) {
    this.reclamationService.save(reclamation, userneme).subscribe(
      data => {
        if (data === -1) {
          console.log('reclamation existe deja ');
        } else if (data === -2) {
          console.log('reclament not found');
          this.toast.error('veuillez vous connecter à nouveau');
        } else if (data === -3) {
          console.log('locale undefined');
          this.toast.warning('Veuillez choisir un local');
        } else {
          console.log('reclamation saved');
          this.toast.success('Réclamation enregistrée');
          this.reclamation = null;
          this.displayDialog = false;
          this.displayDialogM = false;
          this.reclamationService.findbyreclament(localStorage.getItem('username'));

        }
      }, error => {
        console.log('error in the save link');
        this.toast.error('erreur du serveur merci d\' actualiser la page');
      }
    );
  }
  updateReclamation(reclamation: Reclamation) {
    this.reclamationService.update(reclamation).subscribe(
      data => {

        if (data === -1) {
          this.toast.warning('merci de choisir le matériel');
        } else if (data === -2) {
          this.toast.warning('Cette réclamation est bien traitée, vous pouvez pas la modifiée');
        } else {
          console.log('reclamation updated');
          this.toast.info('Réclamation modifiée');
          this.reclamation = null;
          this.displayDialog = false;
          this.displayDialogM = false;
          this.reclamationService.findbyreclament(localStorage.getItem('username'));
        }
      }, error => {
        console.log('error in the update link');
        this.toast.error('erreur du serveur merci d\' actualiser la page');
      }
    );
  }
  deleteReclamation(ref: string) {
    this.reclamationService.delete(ref).subscribe(
      data => {
        if (data === -1) {
          console.log('reclamation not found');
          this.toast.error('erreur du serveur merci de recharger la page');
        } else {
          console.log('reclamation deleted');
          this.toast.success('Réclamaton supprimée');
          this.reclamationService.findbyreclament(localStorage.getItem('username'));
        }
      }, error => {
        console.log('error in the delete link');
        this.toast.error('erreur du serveur merci d\' actualiser la page');
      }
    );
  }
}
