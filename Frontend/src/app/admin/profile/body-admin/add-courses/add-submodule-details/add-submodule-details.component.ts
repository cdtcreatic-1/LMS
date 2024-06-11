import { Component, OnInit } from '@angular/core';
import { Submodule } from '../interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AddCoursesService } from '../services/add-courses.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { Subscription } from 'rxjs';
import { NgClass, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IonicModule } from '@ionic/angular';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { selectAdminAddCourses } from 'src/app/store/selectors/global.selector';

@Component({
  selector: 'app-add-submodule-details',
  templateUrl: './add-submodule-details.component.html',
  styleUrls: ['./add-submodule-details.component.css'],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    ReactiveFormsModule,
    MatTooltipModule,
    IonicModule,
    RouterLink,
  ],
})
export class AddSubmoduleDetailsComponent implements OnInit {
  dataSubModule?: Submodule;
  idModule: number = NaN;
  idSubModule: number = NaN;
  idCourse: number = NaN;

  form: FormGroup = this.fb.group({
    title: [''],
    description: [''],
    urlVideo: [''],
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

    let idSubModule = this.route.snapshot.paramMap.get('idsubmodule');
    this.idSubModule = parseInt(idSubModule!);

    const suscription1 = this.store
      .select(selectAdminAddCourses)
      .subscribe((data) => {
        this.idCourse = data.idCourseSelected;
      });

    this.suscription.add(suscription1);

    if (this.idSubModule > 0) {
      const suscription = this.addcourseService
        .getSubModule(this.idSubModule)
        .subscribe((res) => {
          this.dataSubModule = res;
          this.form.get('title')?.setValue(res.submodule_title);
          this.form.get('description')?.setValue(res.submodule_summary);
          this.form.get('urlVideo')?.setValue(res.submodule_class_video);
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
      }/add-evaluation-details/${this.idModule}/${
        res ? res : this.idSubModule
      }`,
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

    if (this.idSubModule === 0) {
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

    formdata.append('submodule_title', this.form.get('title')?.value);
    formdata.append('submodule_summary', this.form.get('description')?.value);
    formdata.append('submodule_class_video', this.form.get('urlVideo')?.value);
    formdata.append('submodule_status', 'true');
    formdata.append('id_module', `${this.idModule}`);

    if (this.dataDocument) {
      formdata.append(
        'submodule_resources',
        this.dataDocument,
        this.dataDocument.name
      );
    }

    if (this.dataSubModule) {
      formdata.append('id_submodule', `${this.dataSubModule?.id_submodule}`);
    }

    if (!this.dataSubModule) {
      this.addcourseService.addSubModule(formdata).subscribe((resAdd) => {
        if (!resAdd) return;
        this.handleNavigate(resAdd);
      });
    } else {
      this.addcourseService.editSubModule(formdata).subscribe((res) => {
        if (!res) return;
        this.handleNavigate();
      });
    }
  }
}
