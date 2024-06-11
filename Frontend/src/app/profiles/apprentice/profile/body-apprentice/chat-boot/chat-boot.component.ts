import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { setDataChatBoot } from 'src/app/store/actions/user-menu-apprentice.action';
import { AppState } from 'src/app/store/app.state';
import { ApprenticeService } from '../../services/apprentice.service';
import { Subscription } from 'rxjs';
import { AllCourses, Course, DataChatBoot } from '../../interfaces';
import { selectApprentice } from 'src/app/store/selectors/global.selector';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { intialValueChatBooot } from 'src/app/store/constants';

@Component({
  selector: 'app-chat-boot',
  templateUrl: './chat-boot.component.html',
  styleUrls: ['./chat-boot.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, NgClass, IonicModule, ReactiveFormsModule],
})
export class ChatBootComponent implements OnInit, OnDestroy {
  @ViewChild('chat', { static: false }) chatElement: ElementRef;

  form: FormGroup = this.fb.group({
    question: [''],
  });

  dataChatBoot: DataChatBoot[];
  isOpenModalChat = signal<boolean>(false);
  courseName: string = '';

  suscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private appservice: ApprenticeService
  ) {}

  ngOnInit() {}

  openCloseModalChat(value: boolean) {
    this.isOpenModalChat.set(value);

    this.store.select(selectApprentice).subscribe((data) => {
      this.dataChatBoot = data.dataChatBoot;
      if (!value || data.dataChatBoot.length > 0) return;

      const suscription1 = this.store.dispatch(
        setDataChatBoot({
          data: intialValueChatBooot,
        })
      );

      this.courseName = data.dataModules?.course_title!;
      this.suscription.add(suscription1);
    });
  }

  // Modal

  scrollToBottom(): void {
    try {
      this.chatElement.nativeElement.scrollTop =
        this.chatElement.nativeElement.scrollHeight;
    } catch (err) {}
  }

  handleSubmit() {
    const question = this.form.value?.question;
    if (question.length > 0) {
      const suscription = this.store.dispatch(
        setDataChatBoot({
          data: { value: this.form.value['question'], id: 1 },
        })
      );
      this.appservice
        .setChatBoot(question, this.courseName)
        .subscribe((res) => {
          if (!res) return;
          this.store.select(selectApprentice).subscribe((data) => {
            this.dataChatBoot = data.dataChatBoot;
            setTimeout(() => {
              this.scrollToBottom();
            }, 0);
          });
          this.form.reset();
        });

      this.suscription.add(suscription);
    }
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
