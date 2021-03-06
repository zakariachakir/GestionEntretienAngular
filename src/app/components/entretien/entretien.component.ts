import { Component, OnInit } from '@angular/core';
import {Entretien} from '../../controller/model/entretien.model';
import {EntretienService} from '../../controller/service/entretien.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {UrlconfigurationService} from "../../controller/service/urlconfiguration.service";

@Component({
  selector: 'app-entretien',
  templateUrl: './entretien.component.html',
  styleUrls: ['./entretien.component.css']
})
export class EntretienComponent implements OnInit {
  cols: any[];
  enretiens: Entretien[];
  typeuser = localStorage.getItem('type');


  constructor(private entretienService: EntretienService, private urlconfigurationService: UrlconfigurationService, private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    if (this.typeuser === 'normal' ) {
      window.location.href = this.urlconfigurationService.urlpageaccueil+'/accueil';
    } else {
      this.cols = [
        { field: 'numFacture', header: 'Numéro Entretien' },
        { field: 'nomMateriel', header: 'Nom Matériel' },
        { field: 'prestataire', header: 'Prestataire de service' },
        { field: 'nomLocale', header: 'Nom Local' },
        { field: 'montant', header: 'Montant(DH)' },
        { field: 'dateEntretien', header: 'Date Entretien' }
      ];
      this.find();
    }
  }
  public find() {
    this.entretienService.findAll().subscribe(
      data => {
        this.enretiens = data.reverse();
      }
    );
  }
  confirm(entretien: Entretien) {
    this.confirmationService.confirm({
      message: 'Voulez-vous vraiment effectuer cette action?',
      accept: () => {
        this.delete(entretien);
      }
    });
  }

  public delete(entretien: Entretien) {
  this.messageService.add({severity: 'warn', summary: 'Succés', detail: 'Entretien supprimé'});
  const index = this.enretiens.indexOf(entretien);
  this.enretiens = this.enretiens.filter((val, i) => i !== index);
  this.entretienService.delete(entretien.numFacture);
  }
  }


