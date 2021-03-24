import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
import { UsuarioModels } from "../../models/usuario.models";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  usuario: UsuarioModels = new UsuarioModels();
  errorPass: boolean = false;
  errorEmail: boolean = false;
  recordarme= false;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('email')) {
      this.usuario.email= localStorage.getItem('email');
      this.recordarme=true;
    }
  }

  logins(forum: NgForm) {
    if (!forum.valid) {
      return;
    }
    Swal.showLoading();
    if (forum.invalid) {
      return;
    }
    this.auth.login(this.usuario).subscribe(
      (resp) => {
        console.log(resp);
        this.errorPass = false;
        Swal.close();
        if(this.recordarme){
          localStorage.setItem('email',this.usuario.email);
        }else{
          localStorage.setItem('email','');
        }
        this.router.navigateByUrl("/home");
      },
      (err) => {
        console.log(err.error.error.message);

        if (err.error.error.message == "INVALID_PASSWORD") {
          this.errorPass = true;
          this.errorEmail = false;

          Swal.fire({
            title: "Error al autenticar",
            text: err.error.error.message,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        } else if (err.error.error.message == "EMAIL_NOT_FOUND") {
          this.errorEmail = true;
          this.errorPass = false;

          Swal.fire({
            title: "Error al autenticar",
            text: err.error.error.message,
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
      }
    );

    console.log("formulario login enviado");
    console.log(this.usuario);
    console.log(forum);
  }
}
