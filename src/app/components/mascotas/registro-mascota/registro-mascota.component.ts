import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ModalDirective } from "projects/angular-bootstrap-md/src/public_api";
import { MDBModalRef, MDBModalService } from "angular-bootstrap-md";
import { Cliente } from "src/app/models/cliente";
import { Mascota } from "src/app/models/mascota";
import { Tipomascota } from "src/app/models/tipomascota";
import { MascotaService } from "src/app/services/mascota.service";
import swal from "sweetalert2";
import { AuthService } from "src/app/services/auth.service";
import { Usuario } from "src/app/models/usuario";

@Component({
  selector: "app-registro-mascota",
  templateUrl: "./registro-mascota.component.html",
  styleUrls: ["./registro-mascota.component.css"],
})
export class RegistroMascotaComponent implements OnInit {
  mascotas: Mascota[] = [];

  mascota: Mascota = new Mascota();

  tipomascota: Tipomascota[] = [];

  cliente: Cliente[] = [];

  titulo: string = "Agregar Mascota";
  /*** */

  button = document.getElementsByClassName("crud");
  input = document.getElementsByClassName("form-input");

  /***** */
  myform: FormGroup;
  IdMascota: FormControl;
  Nombres: FormControl;
  Raza: FormControl;
  FechaNacimiento: FormControl;
  Sexo: FormControl;
  TipoMascota: FormControl;
  Cliente: FormControl;
  clienteLog: Cliente;
  constructor(
    private mascotasService: MascotaService,
    private router: Router,
    public _authService: AuthService //private modalService: NgbModal
  ) {}

  authService = this._authService;

  ngOnInit(): void {
    this.getClienteIdUsuario(this.authService.usuario);

    // console.log(this.getClienteIdUsuario(this.authService.usuario));

    this.mascotasService
      .getMascotas()
      .subscribe((data) => (this.mascotas = data));
    this.createFormControls();
    this.createForm();
  }

  submitted: boolean = false;

  createFormControls() {
    this.IdMascota = new FormControl("", [Validators.nullValidator]);
    this.Nombres = new FormControl("", [Validators.required]);
    this.Raza = new FormControl("", [Validators.required]);
    this.FechaNacimiento = new FormControl("", [Validators.required]);
    this.Sexo = new FormControl("", [Validators.required]);
    this.TipoMascota = new FormControl("", [Validators.required]);
    //this.Cliente = new FormControl("", [Validators.required]);
  }

  createForm() {
    this.myform = new FormGroup({
      name: new FormGroup({
        IdMascota: this.IdMascota,
        Nombres: this.Nombres,
        Raza: this.Raza,
        FechaNacimiento: this.FechaNacimiento,
        Sexo: this.Sexo,
        TipoMascota: this.TipoMascota,
        //Cliente: this.Cliente,
      }),
    });
  }
  cerrarmodal() {
    this.submitted = false;
    this.basicModal.hide();
    this.myform.reset();

    //this.usuarioService.getRegiones().subscribe((ubigeo) => (this.ubigeo = []));
  }
  @ViewChild("basicModal", { static: true }) basicModal: ModalDirective;
  //@ViewChild("content", { static: true }) public contentModal;

  openModalCrud(accion: string, idMascota?: number): void {
    this.createFormControls();
    this.createForm();

    this.basicModal.show();

    if (accion == "detalle") {
      //this.titulo = "Detalles de Usuario"

      console.log(this.mascota.idmascota);
      this.getMascota(idMascota);
      this.getTipoMascota();
      for (let j = 0; j < this.input.length; j++) {
        this.input[j].setAttribute("disabled", "");
      }
    } else if (accion == "editar") {
      this.titulo = "Actualizar Información";
      this.mascota.idmascota = idMascota;
      this.getMascota(idMascota);
      this.getTipoMascota();
      console.log(this.mascota.idmascota);
    } else if (accion == "agregar") {
      this.mascota.cliente = this.clienteLog;
      this.getTipoMascota();
      this.mascota.idmascota = 0;
      this.titulo = "Registro de Mascota";
      //this.modalAgregar();
      //this.myform.clearValidators();
    }
  }

  //----------------------------- SUBMIT DE FORMULARIO

  verificarDatos(): void {
    for (let j = 0; j < this.input.length; j++) {
      if (this.myform.invalid) {
        swal.fire({
          icon: "error",
          title: "Cuidado...! Aun te faltan datos por completar. ",
          // text: 'Oops...'
        });
        this.submitted = true;
        console.log(this.submitted);
        //this.myform.invalid;
      }
      if (this.myform.valid) {
        //this.click = false;
        swal
          .fire({
            title: "Verificar tus datos antes de continuar...",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, registrarse",
          })
          .then((result) => {
            if (this.mascota.idmascota === 0) {
              if (result.isConfirmed) {
                swal.fire(
                  "Registro Exitoso...!",
                  `${this.mascota.nombre} bienvenido a nuestra veterinaria`,
                  "success"
                );
                this.insert();
                // this.modalService.dismissAll();
              }
            } else if (
              this.mascota.idmascota != 0 &&
              this.mascota.idmascota > 0
            ) {
              if (result.isConfirmed) {
                console.log("click update");
                swal.fire(
                  "Update Exitoso...!",
                  `${this.mascota.idmascota} tus datos se actualizaron correctamente`,
                  "success"
                );
                this.update();
                //this.modalService.dismissAll();
              }
            }
          });
      }
    }
  }

  //----------------------------------- CURD MASCOTA  ---------

  insert(): void {
    this.mascotasService.insert(this.mascota).subscribe((response) => {
      let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
      // this.router.navigate([window.location.reload()]);
    });
  }

  update(): void {
    this.mascotasService.update(this.mascota).subscribe((response) => {
      let currentUrl = this.router.url;
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
      // this.router.navigate([window.location.reload()]);
    });
  }

  delete(mascota: Mascota): void {
    swal
      .fire({
        title: `Seguro desea eliminar a ${mascota.nombre}...`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.mascotasService
            .delete(mascota.idmascota)
            .subscribe((response) => {
              this.mascotas = this.mascotas.filter((mas) => mas != mascota);
              swal.fire(`Su mascota ha sido eliminada...!`, "success");
            });
        }
      });
  }

  //------- CLIENTE LOGUEADO AL SISTEMA

  getClienteIdUsuario(usu: Usuario) {
    this.mascotasService
      .getCliente(usu)
      .subscribe((cliente) => (this.clienteLog = cliente));
  }
  //------------------------
  getMascota(idMascota: number) {
    this.mascotasService
      .getMascota(idMascota)
      .subscribe((data) => (this.mascota = data));
  }

  getTipoMascota() {
    this.mascotasService
      .getTipoMascota()
      .subscribe((data) => (this.tipomascota = data));
  }

  getClientes() {
    this.mascotasService
      .getClientes()
      .subscribe((data) => (this.cliente = data));
  }
}
