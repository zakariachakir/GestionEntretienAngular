import {Component, OnInit, PipeTransform} from '@angular/core';
import {ConfirmationService, MessageService, SelectItem} from 'primeng/api';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Localdetail} from '../../controller/model/localdetail.model';
import {LocaldetailService} from '../../controller/service/localdetail.service';
import {MaterielService} from '../../controller/service/materiel.service';
import {LocalService} from '../../controller/service/local.service';
import {Materiel} from '../../controller/model/materiel.model';
import {Local} from '../../controller/model/local.model';
import {ToastrService} from 'ngx-toastr';
import {UrlconfigurationService} from "../../controller/service/urlconfiguration.service";

@Component({
  selector: 'app-localdetail',
  templateUrl: './localdetail.component.html',
  styleUrls: ['./localdetail.component.css']
})
export class LocaldetailComponent implements OnInit {
  typeuser = localStorage.getItem('type');
  value: boolean;
  cancel: boolean;
  displayDialog: boolean;
  submitted: boolean;
  local = new Localdetail();
  private url = this.urlconfigurationService.urlpageaccueil+'/GestionEntretien/locale/';
  selectedLocal: Localdetail;
  newLocal: boolean;

  locals = new Array<Localdetail>();

  cols: any[];


  userform: FormGroup;


  errorS: number;
  errorC: number;
  constructor(private fb: FormBuilder, private urlconfigurationService: UrlconfigurationService,
              private materielService: MaterielService,
              private localService: LocalService,
              private localdetailService: LocaldetailService,
              private toast: ToastrService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    if (this.typeuser === 'normal' ) {
      window.location.href = this.urlconfigurationService.urlpageaccueil+'/accueil';
    } else {

      this.localdetailService.findAll();

      this.userform = this.fb.group({
        referencelocal: new FormControl('', Validators.required),
        materiellocal: new FormControl('', Validators.required),
        dateachat: new FormControl('', Validators.required),
      });
      this.localService.findAll();
      this.materielService.findAll();
      this.cols = [
        {field: 'referenceML', header: 'Référence'},
        {field: 'materielLocale', header: 'Matériel'},
        {field: 'localeAssocie', header: 'Local, Département'},
        {field: 'dateAffectation', header: 'Date d\'affectation '},
      ];
    }
  }

  confirm() {
    this.confirmationService.confirm({
      message: 'Voulez-vous vraiment effectuer cette action?',
      accept: () => {
        this.delete();
      }
    });
  }
  showDialogToAdd() {
    this.newLocal = true;
    this.local = new Localdetail();
    this.displayDialog = true;
    this.cancel = true;
  }

  save() {
    const localls = this.localdetailService.foundedLocalDetails;
    if (this.newLocal) {
      this.localdetailService.save(this.local).subscribe(
        data => {
          if (data === 1) {
            this.toast.success('Matériel affecté');
            this.localdetailService.findAll();
            this.local = null;
            this.displayDialog = false;
          } else if (data === -2) {
            this.toast.error('Veuillez choisir un local');
          } else if (data === -1) {
            this.toast.error('Réference déja existe');
          }
        }
          , error => {
          console.log('error in the link');
          this.toast.error('erreur du serveur merci d\' actualiser la page');
        }
      );
    } else {
      this.localdetailService.update(this.local).subscribe(
        data => {
          if (data === -1) {
            this.toast.warning('Veuillez choisir un local');
          } else if (data === -2) {
            this.toast.warning('Réference déja existant');
          } else {
            console.log('success Materiel updated');
            this.toast.info('Matériel modifié');
            this.localdetailService.findAll();
            this.local = null;
            this.displayDialog = false;
          }
        }, error => {
          console.log('error in the link');
          this.toast.error('erreur du serveur merci d\' actualiser la page');
        }
      );

    }


  }



  delete() {
    const index = this.localdetailService.foundedLocalDetails.indexOf(this.selectedLocal);
    this.localdetailService.foundedLocalDetails = this.localdetailService.foundedLocalDetails.filter((val, i) => i !== index);
    this.localdetailService.delete(this.selectedLocal.reference);
    this.local = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newLocal = false;
    this.local = this.cloneLocal(event.data);
    this.displayDialog = true;
    this.cancel = false;
  }

  cloneLocal(c: Localdetail): Localdetail {
    const local = new Localdetail();
    for (const prop in c) {
      local[prop] = c[prop];
    }
    return local;
  }

  get foundedLocalDetails(): Localdetail[] {
    return this.localdetailService.foundedLocalDetails;
  }
  get foundedMaterielToChoose(): Materiel[] {
    return this.materielService.foundedMateriels;
  }
  get foundedLocalToChoose(): Local[] {
    return this.localService.foudedLocales;
  }
}
