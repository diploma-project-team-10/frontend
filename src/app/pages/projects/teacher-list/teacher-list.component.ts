import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../base-page';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { UserService } from '../../../user/_services/user.service';
import { Router } from '@angular/router';

import { ApexPlotOptions, ChartComponent } from 'ng-apexcharts';
import {
  ChartLineOptions,
  ChartOptions,
} from '../../../interfaces/dashboard/dashboard';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss'],
})
export class PageTeacherListComponent extends BasePageComponent
  implements OnInit, OnDestroy {

  gender: any[] = [
    { value: 1, label: 'Boys' },
    { value: 2, label: 'Girls' },
  ];
  speciality = [];
  city = [];

  isAdmin = false;
  pageSize = 10;
  loading = false;
  totalData = 3;

  filter = {};

  comAdmin: any[];
  pageIndex = 1;

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {
    super(store, httpSv);
    this.pageData = {
      title: '',
      loaded: true,
    };
  }

  async ngOnInit() {
    super.ngOnInit();
    this.getCommunityTeacherList();
  }

  prepareOption(value: any[]): any[] {
    const rr = [];
    value.forEach((item) => {
      rr.push({ value: item.id, label: item.value });
    });
    return rr;
  }

  // Month Statistic by report
  async getByUrl(url: string): Promise<any> {
    return this.http
      .get<any>(url)
      .toPromise()
      .then((response) => response)
      .catch();
  }

  onChangePageIndex(event) {
    this.pageIndex = event;
  }

  getCommunityTeacherList() {
    this.comAdmin = [
      {id: 1,  fio: 'Dr. John', gender: 'Male', subject: 'Math'},
      {id: '5354f5ca-baba-4d04-b395-730a67a89f6b',  fio: 'Karabalaeva Aikorkem', gender: 'Female', subject: 'Biology'},
      {id: 1,  fio: 'Dr. John', gender: 'Male', subject: 'Physics'}
    ];
  }
}
