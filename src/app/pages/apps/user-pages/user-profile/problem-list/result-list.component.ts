import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';

import {Store} from '@ngrx/store';
import {HttpService} from '../../../../../services/http/http.service';
import {IAppState} from '../../../../../interfaces/app-state';

import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {IPageContent} from '../../../../../interfaces/services/page/page-content';
import {FieldService} from '../../../../../interfaces/services/reference/field.service';
import {Program} from '../../../../../interfaces/services/projects/community.service';

@Component({
    selector: 'quiz-result-list',
    templateUrl: './result-list.component.html',
    styleUrls: ['./result-list.component.scss']
})
export class QuizResultListComponent implements OnInit {
    @Input() userId = '';

    pageSize = 20;
    pageIndex = 1;
    totalData = 0;
    loading = false;

    programList: Program[] = [];
    programList1 = [];

    sortData = {};
    queryParams: any = {};
    routeSnapshot = '';
    result = [
        {
            title: 'Математика',
            result: '19/20',
            relatedTopics: ['Arithmethic', 'Algebraic expressions'],
            createdAt: '10.05.2023'
        },
        {
            title: 'Математика',
            result: '16/20',
            relatedTopics: ['Arithmethic', 'Algebraic expressions'],
            createdAt: '04.05.2023'
        },
        {
            title: 'Математика',
            result: '13/20',
            relatedTopics: ['Arithmethic', 'Algebraic expressions'],
            createdAt: '01.04.2023'
        },
    ];

    constructor(store: Store<IAppState>, httpSv: HttpService,
                private formBuilder: FormBuilder,
                private http: HttpClient, private router: Router,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private fieldService: FieldService
    ) {
    }

    ngOnInit() {
        this.getListOfResult();
        this.openProgramList();
    }

    initTable(): void {
        this.routeSnapshot = this.route.snapshot['_routerState'].url;
        const urlTree = this.router.parseUrl(this.routeSnapshot);
        this.routeSnapshot = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
        this.renderQueryParams(this.queryParams);

    }

    getListOfResult() {
        this.initTable();
    }

    onChangePageIndex(param) {
        this.pageIndex = param;
        this.loading = true;
        this.getListOfResult();
        this.renderQueryParams({page: this.pageIndex});
    }

    renderQueryParams(queryParams: Params) {
        const keys = Object.keys(queryParams);
        const keys2 = Object.keys(this.queryParams);
        const param = {};
        keys2.forEach(item => {
            param[item] = this.queryParams[item];
        });

        keys.forEach(item => {
            param[item] = queryParams[item];
        });
        this.queryParams = param;
        this.router.navigate([this.routeSnapshot], {
            queryParams: this.queryParams
        }).then(r => {});
    }

    openProgramList() {
        return this.http.get<Program[]>(`${environment.apiUrl}/api/project/community/programs/list`)
            .pipe(map(data => {
                return data;
            }))
            .subscribe(data => {
                this.programList = data;
                for (let i = 0; i < this.programList.length; i++) {
                    this.programList1.push({
                        label: this.programList[i].title,
                        value: this.programList[i].id
                    });
                }
                this.programList1.push({
                    label: 'None',
                    value: ''
                });
            });
    }
}
