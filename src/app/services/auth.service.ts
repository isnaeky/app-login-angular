import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UsuarioModels } from "../models/usuario.models";
import { map } from "rxjs/operators";
import { hostViewClassName } from "@angular/compiler";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userToken: String;

  private url = "https://identitytoolkit.googleapis.com/v1/accounts:";
  private apikey = "AIzaSyCfd-q3rsFdmxnXkFiK5pqx03MVOKnvtk4";
  //crear nuevo usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //Login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(private http: HttpClient) {
    this.leerToken();
  }
  logout() {}
  login(usuario: UsuarioModels) {
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true,
    };

    return this.http
      .post(`${this.url}signInWithPassword?key=${this.apikey}`, authData)
      .pipe(
        map((resp) => {
          this.guardarToken(resp["idToken"]);
          return resp;
        })
      );
  }
  nuevoUser(usuario: UsuarioModels) {
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true,
    };

    return this.http
      .post(`${this.url}signUp?key=${this.apikey}`, authData)
      .pipe(
        map((resp) => {
          this.guardarToken(resp["idToken"]);
          return resp;
        })
      );
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem("token", idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem("expira", hoy.getTime().toString());
  }

  private leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    } else {
      this.userToken = "";
    }
    return this.userToken;
  }

  autenticado(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem("expirar"));

    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      console.log('Expirado ');
      return false;
    } else {
      console.log('No Expirado ');
      return true;
    }
  }
}
