import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import { IOption } from '../../../../ui/interfaces/option';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { filter, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../user/_services/user.service';
import { FieldService } from '../../../../interfaces/services/reference/field.service';
import { Status } from '../../../../interfaces/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { Content } from '../../../../ui/interfaces/modal';
import { TCModalService } from '../../../../ui/services/modal/modal.service';
import { ChartComponent } from 'ng-apexcharts';
import {
  ChartLineOptions,
  ChartOptions,
} from '../../../../interfaces/dashboard/dashboard';
import { AuthenticationService } from '../../../../user/_services/authentication.service';

@Component({
  selector: 'page-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class PageUserProfileComponent extends BasePageComponent
  implements OnInit, OnDestroy {
  @ViewChild('chart') chart: ChartComponent;
  public rating: Partial<ChartLineOptions>;
  numDir = 5;
  gender: IOption[];
  status: IOption[];
  currentAvatar: string | ArrayBuffer;
  defaultAvatar: string;
  profile: any;

  id: string;
  loading = false;
  isEmpty = false;

  phones: any[] = [];
  isAdmin = false;
  referenceId = '00000000-0000-0000-0000-000000000017';
  fieldsData = {};
  apiUrl = environment.apiUrl;
  canEdit = false;
  canDelete = false;

  selectedSemester = 'semester1';
  semester: any[] = [
    { value: 'semester1', label: 'FirstSemester' },
    { value: 'semester2', label: 'SecondSemester' },
    { value: 'year', label: 'Year' },
  ];

  selectedMonth = 'september';

  switchValue = true;
  isEduWT = false;
  isPractice = false;
  isStudent = false;
  isMentor = false;
  ratingPrograms = [{
    value: '1',
    label: 'Math',
    data: [1500, 1350, 1620, 1590, 1700, null, null, null]
  }, {
    value: '2',
    label: 'Biology',
    data: [1500, 1420, 1800, 1920, 1760, null, null, null]
  }];
  ratingProgram: any;

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private fieldService: FieldService,
    private toastr: ToastrService,
    private modal: TCModalService,
    private authenticationService: AuthenticationService
  ) {
    super(store, httpSv);
    this.pageData = {
      title: '',
      loaded: true,
    };
    // this.chartRadar = new ApexChart();
    const data = [];
    const categories = [];
    this.rating = {
      series: [
        {
          name: 'Ратинг',
          data: data,
          color: '#3D3DD8'
        },
      ],
      chart: {
        height: 200,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: categories,
        labels: {
          show: false
        }
      },
      yaxis: {
        min: 0,
        max: 3000,
        tickAmount: 6
      }
    };

    this.defaultAvatar = 'assets/content/anonymous-400.jpg';
    this.currentAvatar = this.defaultAvatar;

    if (this.route.snapshot.params['id']) {
      this.id = this.route.snapshot.params['id'];
    }
  }

  async ngOnInit() {
    super.ngOnInit();
    this.setLoaded();
    this.loading = true;
    this.fieldsData = await this.fieldService.getReferenceFields(
      this.referenceId,
      'object'
    );
    this.getProfile();
    this.getProfileRating();
    this.isAdmin = await this.userService.isAdmin();
    this.isStudent = await this.userService.roleAccount(['student']);
    this.isMentor = await this.userService.roleAccount(['mentor']);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  gotoProfile() {
    this.router.navigateByUrl('/vertical/profile/edit/' + this.id).then();
  }

  getProfile() {
    let url = `${environment.apiUrl}/api/v2/profiles/user/type/view`;
    if (this.id) {
      url = `${environment.apiUrl}/api/v2/profiles/user/${this.id}?fields=`;
    }
    return this.http.get<any>(url)
      .pipe(map((data) => {return data;}))
      .subscribe(
        async (data) => {
          if (Object.keys(data).length) {
            this.profile = data;
            if (this.profile['id']) {
              this.canEdit = await this.fieldService.mayAccessRecord(
                'edit',
                this.referenceId,
                this.profile['id']
              );
              this.canDelete = await this.fieldService.mayAccessRecord(
                'delete',
                this.referenceId,
                this.profile['id']
              );
            }
            this.loading = false;
          } else {
            this.isEmpty = true;
          }
        },
        (error) => {
          this.isEmpty = true;
        }
      );
  }

  removeRecord() {
    this.modal.close();
    return this.http
      .post<Status>(
        `${environment.apiUrl}/api/reference/record/remove/${this.referenceId}/${this.id}`,
        {}
      )
      .subscribe({
        next: (data) => {
          if (data.status === 1) {
            this.toastr.success(data.message, 'Success', { closeButton: true });
            this.router
              .navigate([
                '/vertical/reference/record/section',
                this.referenceId,
                this.referenceId,
              ])
              .then((r) => {});
          } else {
            this.toastr.error(data.message, 'Error', { closeButton: true });
          }
        },
        error: (error) => {
          this.toastr.error('Not saved!', 'Error', { closeButton: true });
        },
      });
  }

  openModal<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null,
    options: any = null
  ) {
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options,
    });
  }

  closeModal() {
    this.modal.close();
  }

  ratingChange() {
    const ratingProgram = this.ratingPrograms.find(item => item.value === this.ratingProgram);
    this.rating.series = [{
        name: 'Ратинг',
        data: ratingProgram.data,
        color: '#3D3DD8'
      }];
  }

  getProfileRating() {
    this.ratingProgram = this.ratingPrograms[0].value;
  }

    isStudentOrMentor() {
        return this.isStudent || this.isMentor;
    }
}
