import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  formularioRegister: FormGroup;
  url_roles = 'http://hapa.llerenajuarez.online/web/get_roles';
  url_sedes = 'http://hapa.llerenajuarez.online/web/get_sedes';
  url_save = 'http://hapa.llerenajuarez.online/web/register_app';
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  roles: Rol[] = [];
  sedes: Sede[] = [];

  async loadRoles(){
    const alert = await this.ac.create({
      cssClass: 'my-custom-class',
      header: 'Hapa Alerta',
      subHeader: 'Sin datos',
      message: 'No existen registros',
      buttons: ['OK']
    });
    this.hc.post(this.url_roles, this.httpOptions).subscribe(data => {
      if(data["status"]){
        this.roles = JSON.parse(data["roles"]);
        console.info(this.roles);
      }else{
        alert.present();
        return;
      }
    });
  }

  async loadSedes(){
    const alert = await this.ac.create({
      cssClass: 'my-custom-class',
      header: 'Hapa Alerta',
      subHeader: 'Sin datos',
      message: 'No existen registros',
      buttons: ['OK']
    });
    this.hc.post(this.url_sedes, this.httpOptions).subscribe(data => {
      if(data["status"]){
        this.sedes = JSON.parse(data["sedes"]);
        console.info(this.sedes);
      }else{
        alert.present();
        return;
      }
    });
  }

  constructor(public fb: FormBuilder, public ac: AlertController, public hc: HttpClient, private rt: Router) { 
    this.loadRoles();
    this.loadSedes();
    this.formularioRegister = this.fb.group({
      "rol": new FormControl("", [Validators.required]),
      "sede": new FormControl("", [Validators.required]),
      "nombres": new FormControl("", [Validators.required]),
      "apellidos": new FormControl("", [Validators.required]),
      "email": new FormControl("", [Validators.required, Validators.email]),
      "tipo_documento": new FormControl("", [Validators.required]),
      "documento": new FormControl("", [Validators.required]),
      "telefono": new FormControl("", [Validators.required]),
      "direccion": new FormControl("", [Validators.required]),
      "fecha_nacimiento": new FormControl("", [Validators.required])
    })
  }

  ngOnInit() {
  }

  public closeAlerts() {
    if(this.ac) this.ac.dismiss();
  }

  async showMessage(msg) {
    const alert = await this.ac.create({
      header: 'Hapa Informa',
      subHeader: 'Iniciando registro',
      message: msg
    });

    await alert.present();
  }

  async register(){
    this.showMessage('Espere, estamos procesando su registro');
    var f = this.formularioRegister.value;
    if(this.formularioRegister.invalid){
      const alert = await this.ac.create({
        cssClass: 'my-custom-class',
        header: 'Hapa Alerta',
        subHeader: 'Error con datos',
        message: '??Los campos son obligatorios!',
        buttons: ['OK']
      });
  
      await alert.present();
      return;
    }

    var persona = {
      telefono: f.telefono,
      direccion: f.direccion,
      fecha_nacimiento: f.fecha_nacimiento,
      tipo_documento: f.tipo_documento,
      nro_documento: f.documento,
      roles: f.rol,
      sede: f.sede,
      email: f.email,
      nombres: f.nombres,
      apellidos: f.apellidos
    }

    this.hc.post(this.url_save, JSON.stringify(persona), this.httpOptions).subscribe(data => {
      if(data["status"]){
        //var persona = JSON.parse(data["persona"]);
        //var datos_persona = persona[0].fields;
        this.closeAlerts();
        this.rt.navigate(['/login'])
      }else{        
        this.showMessage('??Se ha registrado un error al momento de crear su usuario!')
        return;
      }
    });    
  }

}

export interface FieldsSedes {
  nombre: string;
  region: string;
  cliente: number;
  grupo: [];
}

export interface Sede{ 
  model: string;
  pk:number;
  fields: FieldsSedes; 
}

export interface FieldsRoles {
  nombre: string;
  descripcion: string  
}

export interface Rol{ 
  model: string;
  pk:number;
  fields: FieldsRoles; 
}