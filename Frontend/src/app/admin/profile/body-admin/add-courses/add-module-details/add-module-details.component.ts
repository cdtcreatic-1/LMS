import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddDocumentsComponent } from 'src/app/admin/shared/add-documents/add-documents.component';
import { ButtonsNextBackComponent } from 'src/app/admin/shared/buttons-next-back/buttons-next-back.component';
import { DataModule } from '../interfaces';
import { AddCoursesService } from '../services/add-courses.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass, NgIf } from '@angular/common';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { IonicModule } from '@ionic/angular';
import { selectAdminAddCourses } from 'src/app/store/selectors/global.selector';

@Component({
  selector: 'app-add-module-details',
  templateUrl: './add-module-details.component.html',
  styleUrls: ['./add-module-details.component.css'],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    AddDocumentsComponent,
    ButtonsNextBackComponent,
    ReactiveFormsModule,
    MatTooltipModule,
    IonicModule,
    RouterLink,
  ],
})
export class AddModuleDetailsComponent implements OnInit, OnDestroy {
  dataModule?: DataModule;
  idModule: number = NaN;
  idCourse: number = NaN;

  form: FormGroup = this.fb.group({
    title: [''],
    description: [''],
  });

  dataDocument: any = undefined;
  document: any = undefined;

  suscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private addcourseService: AddCoursesService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    let idModule = this.route.snapshot.paramMap.get('idmodule');
    this.idModule = parseInt(idModule!);

    const suscription1 = this.store
      .select(selectAdminAddCourses)
      .subscribe((data) => {
        this.idCourse = data.idCourseSelected;
      });

    this.suscription.add(suscription1);

    if (this.idModule > 0) {
      const suscription = this.addcourseService
        .getModule(this.idModule)
        .subscribe((res) => {
          this.dataModule = res;
          this.form.get('title')?.setValue(res.module_title);
          this.form.get('description')?.setValue(res.module_description);
        });

      this.suscription.add(suscription);
    }
  }

  validatorFields(field: string) {
    return (
      this.form.controls[field].errors && this.form.controls[field].touched
    );
  }

  onChangeLoadDocument(event: any) {
    if (event.target.files[0].size < 3000000) {
      if (event.target.files[0].type === 'application/pdf') {
        this.dataDocument = event.target.files[0];

        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);

          reader.onload = () => {
            this.document = reader.result as string;
          };
        }
      } else {
        this.store.dispatch(
          setIsErrorMessage({
            message: 'Formato no permitido, por favor cargue un pdf',
          })
        );
      }
    } else {
      this.store.dispatch(
        setIsErrorMessage({ message: 'El documentos cargado pesa más de 3Mb' })
      );
    }
  }

  handleNavigate(res?: number) {
    this.router.navigate([
      `/admin/profile/add-courses/add/action=${3}/${
        this.idCourse
      }/add-submodules/${res ? res : this.idModule}`,
    ]);
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.store.dispatch(
        setIsErrorMessage({
          message: 'Por favor, completar todos los campos',
        })
      );
      return;
    }

    if (this.idModule === 0) {
      if (!this.document) {
        this.store.dispatch(
          setIsErrorMessage({
            message: 'Por favor, cargue el documento del módulo',
          })
        );
        return;
      }
    }

    let formdata: FormData = new FormData();

    formdata.append('module_title', this.form.get('title')?.value);
    formdata.append(
      'module_description',
      this.form.get('description')?.value
    );
    formdata.append('module_status', 'true');
    formdata.append('id_course', `${this.idCourse}`);

    if (this.dataDocument) {
      formdata.append(
        'module_resources',
        this.dataDocument,
        this.dataDocument.name
      );
    }

    if (this.dataModule) {
      formdata.append('id_module', `${this.dataModule.id_module}`);
    }

    if (!this.dataModule) {
      this.addcourseService.addModule(formdata).subscribe((res) => {
        if (!res) return;
        this.handleNavigate(res);
      });
    } else {
      this.addcourseService.editModule(formdata).subscribe((res) => {
        if (!res) return;
        this.handleNavigate();
      });
    }
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
