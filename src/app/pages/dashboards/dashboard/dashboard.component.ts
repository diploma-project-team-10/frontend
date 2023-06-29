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
  ChartOptionColumns,
  ChartOptions,
} from '../../../interfaces/dashboard/dashboard';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class PageDashboardComponent extends BasePageComponent
  implements OnInit, OnDestroy {
  @ViewChild('chart') chart: ChartComponent;
  public attendanceEnglish: Partial<ChartLineOptions>;
  public radialBar: Partial<ChartOptions>;
  @ViewChild('barChart') barChart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  // public attendanceEnglish: Partial<ChartLineOptions>;
  // public radialBar: Partial<ChartOptions>;

  semester: any[] = [
    { value: 1, label: 'Семестр 1' },
    { value: 2, label: 'Семестр 2' },
  ];
  months: any[] = [
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
  ];
  gender: any[] = [
    { value: 1, label: 'Boys' },
    { value: 2, label: 'Girls' },
  ];
  englevel = [];
  university = [];
  speciality = [];
  mentors = [];
  city = [];

  isAdmin = false;

  filter = {
    monthReport: {
      semester: null,
      month: null,
      city: [],
      mentors: [],
      university: [],
      speciality: [],
      gender: null,
      loading: false,
    },
    specCount: {
      mentors: [],
      university: [],
      speciality: [],
      city: [],
      englevel: [],
      gender: null,
      specHumCourse: null,
      specTechCourse: null,
      loading: false,
    },
    rating12: {
      semester: null,
      city: [],
      mentors: [],
      gender: null,
      loading: false,
    },
    rating34: {
      semester: null,
      city: [],
      mentors: [],
      gender: null,
      loading: false,
    },
    filterAttLin: {
      semester: null,
      month: [],
      mentors: [],
      gender: null,
      loading: false,
    },
  };

  countStatistic = {};

  listOfStudentFiltered = {};
  mothReportFiltered = {};

  attLin = [];
  att = {
    9: { label: 'September', count: 0, isSelected: true },
    10: { label: 'October', count: 0, isSelected: true },
    11: { label: 'November', count: 0, isSelected: true },
    12: { label: 'December', count: 0, isSelected: true },
    1: { label: 'January', count: 0, isSelected: false },
    2: { label: 'February', count: 0, isSelected: true },
    3: { label: 'March', count: 0, isSelected: true },
    4: { label: 'April', count: 0, isSelected: true },
    5: { label: 'May', count: 0, isSelected: true },
  };

  studentData12: any[];
  studentData: any[];
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
      title: 'Dashboard',
      loaded: true,
    };

    const data = [];
    const categories = [];

    Object.entries(this.attLin).forEach(([key, value]) => {
      if (value.isSelected) {
        data.push(value.count);
        categories.push(value.label);
      }
    });

    this.radialBar = {
      series: [0],
      colors: ['#3D3DD8'],
      chart: {
        height: 275,
        width: 275,
        offsetX: -10,
        offsetY: -10,
        type: 'radialBar',
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '70%',
          },
          track: {
            margin: 0,
            strokeWidth: '100%',
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: '46px',
              color: '#3D3DD8',
              fontWeight: 700,
              show: true,
            },
          },
        },
      },
      labels: [],
      legend: {
        itemMargin: {
          horizontal: 0,
          vertical: 0,
        },
      },
    };
    this.chartOptions = {
      series: [
        {
          name: 'Topic',
          data: [4, 10, 5],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + '';
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758'],
        },
      },

      xaxis: {
        categories: ['Biology', 'Math', 'Physics'],
        position: 'top',
        labels: {
          offsetY: -18,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
          offsetY: -35,
        },
      },

      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + '';
          },
        },
      },
      title: {
        text: "'Quiz Count'",

        offsetY: 320,
        align: 'center',
        style: {
          color: '#444',
        },
      },
    };

    const now = new Date();
    let month = now.getMonth();
    if ([0, 1].includes(month)) {
      month = 12;
    } else if ([5, 6, 7].includes(month)) {
      month = 4;
    } else if (month === 8) {
      month = 9;
    }
    this.filter.monthReport.month = month;
  }

  async ngOnInit() {
    super.ngOnInit();
    // TODO истеу керек
    // if (!await this.userService.isAdmin()) {
    //   this.router.navigate(['/vertical/user-profile']).then(r => {
    //   });
    // }
    this.isAdmin = await this.userService.isAdmin();
    this.getPrepareOption().then((r) => {
      this.speciality = this.prepareOption(r['speciality']);
      this.university = this.prepareOption(r['university']);
      this.mentors = this.prepareOption(r['mentors']);
      this.city = this.prepareOption(r['city']);
      if (r.hasOwnProperty('englevel')) {
        this.englevel = this.prepareOption(r['englevel']);
      }
    });

    // Rating 1,2 and 3,4
    // await this.getRatingStudents('freshman', 'rating12');
    //     .then(r => {
    //   this.studentData12 = r;
    // });
    // await this.getRatingStudents('big', 'rating34');
    //     .then(r => {
    //   this.studentData34 = r;
    // });
  }

  prepareOption(value: any[]): any[] {
    const rr = [];
    value.forEach((item) => {
      rr.push({ value: item.id, label: item.value });
    });
    return rr;
  }
  async getPrepareOption(): Promise<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/api/profile/fields/list`)
      .toPromise()
      .then((response) => response)
      .catch();
  }

  async applyFilter(type: string, course: string = '') {
    switch (type) {
      case 'specCount':
        this.filter.specCount.loading = true;
        this.getCountStatistic().then((r) => {
          const mentors = this.countStatistic['MENTOR'];
          this.countStatistic = r;
          if (!this.countStatistic['MENTOR']) {
            this.countStatistic['MENTOR'] = mentors;
          }
          this.filter.specCount.loading = false;
        });
        break;
      case 'rating':
        await this.getRatingStudents(course, 'rating12');
        if (course === 'freshman') {
        } else if (course === 'big') {
          await this.getRatingStudents(course, 'rating34');
        }
    }
  }

  // Count
  async getCountStatistic(): Promise<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/api/dashboard/count`)
      .toPromise()
      .then((response) => response)
      .catch();
  }
  getPercentageCount(value: any[], key: string): number {
    let allCount = 0;
    let keyCount = 0;
    value.forEach((item) => {
      allCount += item['count'];
      if (item['gender_enum'] === key) {
        keyCount = item['count'];
      }
    });
    return (keyCount * 100) / allCount;
  }
  getTotalCount(value: any[]): number {
    let result = 0;
    value.forEach((item) => {
      result += item['count'];
    });

    return result;
  }

  // Month Statistic by report
  async getByUrl(url: string): Promise<any> {
    return this.http
      .get<any>(url)
      .toPromise()
      .then((response) => response)
      .catch();
  }
  round(value: any): number {
    return Math.round(Number(value));
  }
  abs(value: any): number {
    return Math.abs(Number(value));
  }

  // Rating
  async getRatingStudents(
    course: string = '',
    filter: string = 'rating'
  ): Promise<any> {
    this.filter[filter].loading = true;
    this.filter[filter].loading = true;
    let url = `${environment.apiUrl}/api/dashboard/data/rating/list`;
    if (course.length) {
      url = `${environment.apiUrl}/api/dashboard/data/rating/list/all?cr=${course}`;
    }
    return this.http
      .get<any>(url)
      .toPromise()
      .then((response) => {
        this.studentData = response;
        this.filter[filter].loading = false;
      })
      .catch();
  }
  onChangePageIndex(event) {
    this.pageIndex = event;
  }
}
