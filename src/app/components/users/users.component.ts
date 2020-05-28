import { Component, OnInit } from '@angular/core';
import {Message, MessageService, SelectItem} from 'primeng/api';
import {Users} from '../../controller/model/users.model';
import {UsersService} from '../../controller/service/users.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  value: boolean;
  cancel: boolean;
  displayDialog: boolean;
  submitted: boolean;
  user = new Users();

  selectedUser: Users;

  newUser: boolean;

  users = new Array<Users>();

  cols: any[];

  type: SelectItem[];

   errorS: number ;
   errorC: number ;

  userform: FormGroup;

  msgs: Message[] = [];

  constructor(private fb: FormBuilder, private messageService: MessageService, private userService: UsersService) {
  }

  ngOnInit(): void {
    this.userform = this.fb.group({
      nom: new FormControl('', Validators.required),
      prenom: new FormControl('', Validators.required),
      telephone: new FormControl('', Validators.compose([Validators.required,
        Validators.pattern(/(\+212|0|212)([ \-_/]*)(\d[ \-_/]*){9}/)])),
      usernamee: new FormControl('', Validators.required),
      passwordd: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required)
    });

    this.cols = [
      {field: 'reference', header: 'Reference '} ,
      {field: 'nom', header: 'Nom '} ,
      {field: 'prenom', header: 'Prénom'},
      {field: 'telephone', header: 'Numero de Telephone'},
      {field: 'username', header: 'Nom d\'utilisateur'},
      {field: 'password', header: 'Mot de passe'},
      {field: 'type', header: 'Type utilisateur'}
    ];
    this.type = [];
    this.type.push({label: 'Selectionnez le Type', value: ''});
    this.type.push({label: 'Administrateur', value: 'administrateur'});
    this.type.push({label: 'Employé', value: 'employé'});

    this.find();
  }

  public find() {
    this.userService.findAll().subscribe(
      data => {
        this.users = data.reverse();
      },
      error => {
        console.log('error find');
      });
  }


  showDialogToAdd() {
    this.newUser = true;
    this.user = new Users();
    this.displayDialog = true;
    this.cancel = true;
  }

  save() {
    const use = this.users;
    if (this.newUser) {
      this.userService.save(this.user).subscribe(
        data => {
          console.log(data);
          this.errorS = data;
          if (this.errorS === 1) {
            this.messageService.add({severity: 'success', summary: 'Succés', detail: 'Opération Enregistrée'});
            this.find();
            this.user = null;
            this.displayDialog = false;
          } else if (this.errorS === -1){
            this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Utilisateur déja existe'});
          } else if (this.errorS === -5){
            this.messageService.add({severity: 'error', summary: 'Erreur', detail: 'Numéro de télephone déja existe'});
          }
        }, error => {
          console.log('error');
        }
      );
    } else {
    //  use[this.users.indexOf(this.selectedUser)] = this.user;
      use[this.users.indexOf(this.selectedUser)] = this.user;
      this.userService.update(this.user).subscribe(
        data => {
          console.log(data);
          this.messageService.add({severity: 'info', summary: 'Succés', detail: 'Opération Enregistrée'});
          this.find();
          this.user = null;
          this.displayDialog = false;
        }, error => {
          console.log('error update');
        }
      );
    }
  }


  delete() {
    const index = this.users.indexOf(this.selectedUser);
    this.users = this.users.filter((val, i) => i !== index);
    this.userService.delete(this.selectedUser.reference).subscribe(
      data => {
        this.messageService.add({severity: 'warn', summary: 'Succés', detail: 'Utilisateur Supprimé'});
      },
      error => {
        console.log('error delete');
      }
    );
    this.user = null;
    this.displayDialog = false;
  }

  onRowSelect(event) {
    this.newUser = false;
    this.user = this.cloneUser(event.data);
    this.displayDialog = true;
    this.cancel = false;
  }

  cloneUser(c: Users): Users {
    const use = new Users();
    for (const prop in c) {
      use[prop] = c[prop];
    }
    return use;
  }
}
