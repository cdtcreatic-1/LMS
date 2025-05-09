import { NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddIconMessageComponent } from 'src/app/admin/shared/add-icon-message/add-icon-message.component';
import { AddCoursesService } from '../services/add-courses.service';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import { selectAdminAddCourses } from 'src/app/store/selectors/global.selector';
import { Submodule } from '../interfaces';

@Component({
  selector: 'app-add-submodules',
  templateUrl: './add-submodules.component.html',
  styleUrls: ['./add-submodules.component.css'],
  standalone: true,
  imports: [NgFor, AddIconMessageComponent, RouterLink],
})
export class AddSubmodulesComponent implements OnInit, OnDestroy {
  idAction: number = NaN;
  idModule: number = NaN;
  
  dataSubmodules: Submodule[] = [];

 //suscription = new Subscription();
  suscription: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private addCourseService: AddCoursesService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    let idModule = this.route.snapshot.paramMap.get('idmodule');
    this.idModule = parseInt(idModule!);

    

    const suscription1 = this.store
      .select(selectAdminAddCourses)
      .subscribe((data) => {
        this.idAction = data.idAction;
      });

    const suscription2 = this.addCourseService
      .getAllSubModules(this.idModule)
      .subscribe((res) => {
        this.dataSubmodules = res.submodules;
      });


    this.suscription.push(suscription1);//lo cambie de add a push
    this.suscription.push(suscription2);//lo cambie de add a push
  }
  
  /*handleGetSubmodule() {
    const suscription2 = this.addCourseService
      .getObjetives(this.idModule)
      .subscribe((res) => {
        this.dataSubmodules = res.submodules;
      });

    this.suscription.push(suscription2);
  }*/
  


  /*ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }*/ //estaba asi originalmente

  ngOnDestroy(): void {
    this.suscription.forEach((suscription) => {
      suscription.unsubscribe();
    });
  }

  deleteSubModule(index: number, idSubmodule: number): void {
    const suscription = this.addCourseService
      .deleteObjetive(idSubmodule) // Llamada al backend 
      .subscribe({
        next: (res: boolean) => {
          if (res) { // Si la respuesta es true
            this.dataSubmodules.splice(index, 1); // Elimina del array localmente
          } else {
            alert('No se pudo eliminar el submódulo. Intente nuevamente.');
          }
        },
        error: (err) => {
          console.error('Error al eliminar el submódulo:', err);
          alert('Ocurrió un error en la eliminación.');
        },
      });
  
    this.suscription.push(suscription); // Agrega la suscripción para limpiarla luego
  }
  //
  /*deleteSubModule(index: number): void {
    this.dataSubmodules.splice(index, 1); // Elimina el módulo de la lista
  }
  /*
  deleteSubModulo(idsubmodule: number) {
    const suscription4 = this.addCourseService
      .deleteObjetive(idsubmodule)
      .subscribe((res) => {
        if (!res) return;
        this.handleGetObjetives();
      });

    this.suscription.push(suscription4);
  }
  //*/
}
