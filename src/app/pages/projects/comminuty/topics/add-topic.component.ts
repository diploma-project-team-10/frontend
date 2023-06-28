import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

import { Store } from '@ngrx/store';
import {BasePageComponent} from '../../../base-page';
import { HttpService } from '../../../../services/http/http.service';
import {IAppState} from '../../../../interfaces/app-state';

import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as PageActions from '../../../../store/actions/page.actions';
import {Status} from '../../../../interfaces/services/util.service';
import {Topic} from '../../../../interfaces/services/projects/community.service';

@Component({
  selector: 'add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.scss']
})
export class AddTopicComponent implements OnInit {
  @Input() program = '';
  successCode = '';
  errorCode = '';

  apiUrl = '';
  id = '';

  topics: Topic[] = [];
  children = false;

  constructor(store: Store<IAppState>, httpSv: HttpService,
              private formBuilder: FormBuilder,
              private http: HttpClient) {
    this.successCode = 'Successfully saved!';
    this.errorCode = 'Not saved!';

    this.apiUrl = environment.apiUrl;
  }

  initBasicForm() {
  }

  ngOnInit() {
    this.initBasicForm();
    this.getTopics();
  }

  initTable(): void {}

  childrenData() {
    for (let i = 0; i < this.topics.length; i++) {
      if (this.topics[i].parentId == null || this.topics[i].parentId === '') { continue; }
      const itemIndex = this.topics.findIndex(topic => topic.id === this.topics[i].parentId);
      if (this.topics[itemIndex] !== undefined) {
        this.topics[itemIndex].children.push(this.topics[i]);
      }
    }
    for (let i = this.topics.length - 1; i >= 0; i--) {
      if (this.topics[i].parentId != null
          && this.topics[i].parentId !== ''
      ) {
        this.topics.splice(i, 1);
      }
    }
    this.children = true;
  }

  getTopics() {
    this.initTable();
    return this.http.get<Topic[]>(`${environment.apiUrl}/api/project/community/topic/list/${this.program}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.topics = data;
          if (this.topics.length === 0) {
          } else {
            for (let i = 0; i < this.topics.length; i++) {
              this.topics[i].children = [];
              this.topics[i].hidden = true;
            }
          }
          this.childrenData();
        });
  }
}
