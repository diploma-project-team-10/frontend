import { Component, OnInit } from '@angular/core';
import {BasePageComponent} from '../../../base-page';
import {Store} from '@ngrx/store';
import {IAppState} from '../../../../interfaces/app-state';
import {HttpService} from '../../../../services/http/http.service';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../../../user/_services/user.service';
import {FieldService} from '../../../../interfaces/services/reference/field.service';
import {ToastrService} from 'ngx-toastr';
import {TCModalService} from '../../../../ui/services/modal/modal.service';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';

@Component({
  selector: 'passport-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class PassportListComponent extends BasePageComponent implements OnInit {
  apiUrl = environment.apiUrl;
  passports = [];
  private loading: boolean;
  private isEmpty: boolean;

  constructor(store: Store<IAppState>,
              httpSv: HttpService,
              protected formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private http: HttpClient,
  ) {
    super(store, httpSv);
    this.pageData = {
      title: 'Programs',
      loaded: true
    };
  }

  async ngOnInit() {
    super.ngOnInit();
    this.getPassports();
  }


  private getPassports() {
    const url = `${environment.apiUrl}/api/project/community/program/list`;
    return this.http.get<any>(url)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(
            async data => {
              if (Object.keys(data).length) {
                this.passports = data;
                this.loading = false;
              } else {
                this.isEmpty = true;
              }
            },
            error => {
              this.isEmpty = true;
            });
  }

}
