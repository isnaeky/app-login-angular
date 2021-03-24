import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UsuarioModels } from "../../models/usuario.models";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

import Swal from "sweetalert2";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent implements OnInit {
  usuario: UsuarioModels;
  error: boolean = false;
  recordarme= false;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.usuario = new UsuarioModels();
  }

  onSubmit(f: NgForm) {
    if (f.invalid) {
      return;
    }
    Swal.showLoading();
    this.auth.nuevoUser(this.usuario).subscribe(
      (resp) => {
        console.log(resp);
        this.error = false;
        Swal.close();
        if(this.recordarme){
          localStorage.setItem('email',this.usuario.email);
        }
        this.router.navigateByUrl("/home");
      },
      (err) => {
        console.log(err.error.error.message);
        if (err.error.error.message == "EMAIL_EXISTS") {
          this.error = true;
          Swal.fire({
            title: "Error al autenticar",
            text: err.error.error.message,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
      }
    );

    console.log("formulario enviado");
    console.log(this.usuario);
    console.log(f);
  }
}
