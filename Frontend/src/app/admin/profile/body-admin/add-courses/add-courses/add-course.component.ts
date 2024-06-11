import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppState } from 'src/app/store/app.state';
import { AddCoursesService } from '../services/add-courses.service';
import { Store } from '@ngrx/store';
import { selectAdminAddCourses } from 'src/app/store/selectors/global.selector';
import { ResponseGetCourse } from '../interfaces';
import { Subscription } from 'rxjs';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { setIsErrorMessage } from 'src/app/store/actions/error-message.actions';
import { setIdActionCourse } from 'src/app/store/actions/admin-add-course.actions';
import { handleKeyDown } from 'src/app/shared/helpers';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    IonicModule,
    RouterLink,
    ReactiveFormsModule,
    MatTooltipModule,
    DecimalPipe,
  ],
})
export class AddCourseComponent implements OnInit, OnDestroy {
  idAction: number = 1;
  idCourse: number = NaN;
  dataCourse?: ResponseGetCourse;

  currectDate: string = new Date().toISOString().split('T')[0];

  form: FormGroup = this.fb.group({
    title: [''],
    description: [''],
    duration: [''],
    instructor_name: [''],
    date_start: [''],
    price: [''],
  });

  dataImage: any = undefined;
  image: any = undefined;

  dataDocument: any = undefined;
  document: any = undefined;

  suscription = new Subscription();

  constructor(
    private addCourseService: AddCoursesService,
    private store: Store<AppState>,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const suscription1 = this.store
      .select(selectAdminAddCourses)
      .subscribe((data) => {
        this.idAction = data.idAction;
        this.idCourse = data.idCourseSelected;

        if (data.idCourseSelected > 0) {
          this.addCourseService
            .getCourse(data.idCourseSelected)
            .subscribe((res) => {
              this.dataCourse = res;

              this.form.get('title')?.setValue(res.course_title);
              this.form.get('description')?.setValue(res.course_description);
              this.form.get('duration')?.setValue(res.course_duration);
              this.form
                .get('instructor_name')
                ?.setValue(res.course_instructor_name);
              this.form.get('date_start')?.setValue(res.course_start_date);
              this.form.get('price')?.setValue(res.course_price);
            });
        }
      });

    this.suscription.add(suscription1);
  }

  validatorFields(field: string) {
    return (
      this.form.controls[field].errors && this.form.controls[field].touched
    );
  }

  handleKeyDown(e: any) {
    handleKeyDown(e);
  }

  onChangeLoadImage(event: any) {
    if (event.target.files[0].size < 3000000) {
      if (
        event.target.files[0].type === 'image/png' ||
        event.target.files[0].type === 'image/jpeg'
      ) {
        const dataImage = event.target.files[0];
        this.dataImage = dataImage;

        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);

          reader.onload = () => {
            this.image = reader.result as string;
          };
        }
      } else {
        this.store.dispatch(
          setIsErrorMessage({
            message: 'Formato no permitido, por favor cargue una imagen',
          })
        );
      }
    } else {
      this.store.dispatch(
        setIsErrorMessage({ message: 'La imagen cargada pesa más de 3Mb' })
      );
    }
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

  handleNavigate() {
    this.router.navigate([
      `/admin/profile/add-courses/add/action=${this.idAction}/${this.idCourse}/add-objetives`,
    ]);

    if (this.idAction === 1 || this.idAction === 3) {
      this.addCourseService.getAllCourses();
    }
  }

  handleSubmit() {
    if (this.idAction === 1 || this.idAction === 3) {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.store.dispatch(
          setIsErrorMessage({
            message: 'Por favor, completar todos los campos',
          })
        );
        return;
      }

      if (this.idAction === 1) {
        if (!this.dataImage) {
          this.store.dispatch(
            setIsErrorMessage({
              message: 'Por favor, cargue la imagen del curso',
            })
          );
          return;
        }

        if (!this.document) {
          this.store.dispatch(
            setIsErrorMessage({
              message: 'Por favor, cargue el documento del curso',
            })
          );
          return;
        }
      }

      let formdata: FormData = new FormData();

      formdata.append('course_title', this.form.get('title')?.value);
      formdata.append(
        'course_description',
        this.form.get('description')?.value
      );
      formdata.append('course_duration', this.form.get('duration')?.value);
      formdata.append(
        'course_instructor_name',
        this.form.get('instructor_name')?.value
      );
      formdata.append('course_price', this.form.get('price')?.value);
      formdata.append('course_start_date', this.form.get('date_start')?.value);
      formdata.append('course_status', 'true');
      formdata.append('course_video', 'undefined sdvsvdsdsdvjkjv');

      if (this.dataImage) {
        formdata.append('course_photo', this.dataImage, this.dataImage.name);
      }

      if (this.dataDocument) {
        formdata.append(
          'course_curriculum_file',
          this.dataDocument,
          this.dataDocument.name
        );
      }

      if (this.idAction === 3) {
        formdata.append('id_course', this.idCourse.toString());
      }

      if (this.idAction === 1) {
        const suscription = this.addCourseService
          .setAddCourse(formdata)
          .subscribe((res) => {
            if (!res) {
              return;
            }

            this.store.dispatch(
              setIdActionCourse({ idAction: 3, idCourse: res })
            );
            this.router.navigate([
              `/admin/profile/add-courses/add/action=${3}/${res}/add-objetives`,
            ]);
          });

        this.suscription.add(suscription);
      } else {
        const suscription = this.addCourseService
          .setEditCourse(formdata)
          .subscribe((res) => {
            if (!res) {
              return;
            }
            this.handleNavigate();
          });
        this.suscription.add(suscription);
      }
    } else {
      this.handleNavigate();
    }
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
