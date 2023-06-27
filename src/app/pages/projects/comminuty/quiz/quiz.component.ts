import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import { BasePageComponent } from '../../../base-page';
import {
  GenerateQuiz,
  Program,
  Questions,
  Variant,
} from '../../../../interfaces/services/projects/community.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Status } from '../../../../interfaces/services/util.service';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TCModalService } from '../../../../ui/services/modal/modal.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import * as PageActions from '../../../../store/actions/page.actions';
import { Content } from '../../../../ui/interfaces/modal';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent extends BasePageComponent implements OnInit {
  programId = '';
  successCode = '';
  errorCode = '';
  loading = false;
  langType = 'kz';

  quiz: GenerateQuiz[] = [
    {
      id: null,
      answerVariants: [],
      answerRelVariants: [],
      description: '',
      descriptionRu: '',
      descriptionEn: '',
      answerType: '',
    },
  ];

  question: GenerateQuiz = {
    id: null,
    answerVariants: [],
    answerRelVariants: [],
    studentAnswer: [],
    description: '',
    descriptionRu: '',
    descriptionEn: '',
    answerType: '',
  };

  program: string;

  userAnswer: any = null;
  leftPosition: number = null;
  rightPosition: number = null;
  answerFill: Variant = {
    id: '',
    text: '',
    textRu: '',
    textEn: '',
    textRel: '',
    textRuRel: '',
    textEnRel: '',
    isAnswer: true,
    orderNum: 0,
  };
  started = false;
  finished = false;
  index;

  @ViewChild('resModal') resModal: any;
  totalSec: number = 5;
  minutes: string;
  seconds: string;

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private modal: TCModalService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService
  ) {
    super(store, httpSv);
    this.pageData = {
      title: 'Quiz',
      loaded: true,
    };
    this.successCode = 'Successfully saved!';
    this.errorCode = 'Not saved!';
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.programId = this.route.snapshot.params['programId'];
    // console.log(this.programId);
    // this.selectProgram();
  }

  initTable(): void {
    setTimeout(
      () => this.store.dispatch(new PageActions.Update({ loaded: true })),
      0
    );
  }

  selectProgram() {
    this.http
      .get<Status>(
        `${environment.apiUrl}/api/project/community/quiz/start/${this.programId}`
      )
      .pipe(
        map((data) => {
          return data;
        })
      )
      .subscribe((data) => {
        if (data.status === 1) {
          this.programId = data.value;
          this.started = true;
          this.nextQuestion();
          this.updateTimer();
          this.toastr.success(data.message, 'Success', { closeButton: true });
        } else {
          this.toastr.error(data.message, 'Error', { closeButton: true });
        }
      });
  }

  nextQuestion() {
    // this.question.answerVariants = JSON.stringify(this.question.variants);
    this.userAnswer = {
      id: this.programId,
      leftPosition: this.leftPosition,
      rightPosition: this.rightPosition,
      question: this.question,
      // answer: null
    };
    this.setAnswer(this.userAnswer);

    return this.http
      .post<Status>(
        `${environment.apiUrl}/api/project/community/quiz/getQuestion`,
        this.userAnswer
      )
      .subscribe({
        next: (data) => {
          if (data.status === 1) {
            this.toastr.success(data.message, 'Success', { closeButton: true });
            this.leftPosition = data.value.leftPosition;
            this.rightPosition = data.value.rightPosition;
            this.question = data.value.question;
          } else {
            this.toastr.error(data.message, 'Error', { closeButton: true });
          }
        },
        error: (error) => {
          this.toastr.error(error, 'Error', { closeButton: true });
        },
      });
  }

  onDrop(event, arr) {
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    for (let i = 0; i < arr.length; i++) {
      arr[i].orderNum = i + 1;
    }
  }

  private setAnswer(userAnswer: any) {
    let answer = [];
    switch (userAnswer.question.answerType) {
      case 1:
        for (let i = 0; i < this.question.answerVariants.length; i++) {
          if (this.question.answerVariants[i].id === this.answerFill.id) {
            this.answerFill = this.question.answerVariants[i];
          }
        }
      // tslint:disable-next-line:no-switch-case-fall-through
      case 3:
        this.answerFill.isAnswer = true;
        answer.push(this.answerFill);
        break;
      case 2:
        for (let i = 0; i < this.question.answerVariants.length; i++) {
          if (this.question.answerVariants[i].isAnswer) {
            answer.push(this.question.answerVariants[i]);
          }
        }
        break;
      case 4:
        answer = null;
        break;
      case 5:
        answer = null;
        break;
      default:
        break;
    }
    userAnswer.question.studentAnswer = answer;
  }

  startTimer() {
    this.minutes = this.pad(Math.floor(this.totalSec / 60));
    this.seconds = this.pad(Math.floor(this.totalSec % 60));
    this.totalSec--;
  }
  updateTimer() {
    setInterval(() => {
      if (this.totalSec > -1) this.startTimer();
      else {
        this.finished = true;
        // this.openModal(this.resModal);
      }
    }, 1000);
  }
  pad(n: number) {
    return (n < 10 ? '0' : '') + n;
  }

  openModal(content: any) {
    this.modal.open(content);
  }
}
