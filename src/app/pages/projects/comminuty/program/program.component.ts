import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../user/_services/user.service';
import { FieldService } from '../../../../interfaces/services/reference/field.service';
import { ToastrService } from 'ngx-toastr';
import { TCModalService } from '../../../../ui/services/modal/modal.service';
import { BasePageComponent } from '../../../base-page';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Status } from '../../../../interfaces/services/util.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';

@Component({
    selector: 'app-program',
    templateUrl: './program.component.html',
    styleUrls: ['./program.component.scss']
})

export class ProgramComponent extends BasePageComponent implements OnInit, OnDestroy {
    @Input() referenceId = null;
    labelForm: FormGroup;

    innerValue: any[] = [];
    id: string;
    isNew = true;
    apiUrl = environment.apiUrl;
    redirectUrl = '/vertical/community/program/edit';
    passport = {};
    title = '';

    removeIndex: number;

    loading = false;
    isEmpty = false;
    isFocused = false;

    exists = false;
    imgUrl = '';
    maxSize = 5;

    constructor(store: Store<IAppState>,
                httpSv: HttpService,
                protected formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private http: HttpClient,
                private router: Router,
                private userService: UserService,
                private fieldService: FieldService,
                private toastr: ToastrService,
                private modal: TCModalService,
    ) {
        super(store, httpSv);
        this.pageData = {
            title: 'Passport Direction',
            loaded: true
        };
    }

    async ngOnInit() {
        if (this.route.snapshot.params['id']) {
            this.id = this.route.snapshot.params['id'];
            this.isNew = false;
            this.exists = true;
        }
        super.ngOnInit();
        this.setLoaded();
        this.loading = true;
        this.getPassport();
    }

    postRequest(url, postParam): Promise<Status> {
        return this.http.post<Status>(url, postParam)
            .toPromise()
            .then(response => response as Status)
            .catch();
    }

    getPassport() {
        if (!this.isNew) {
            const url = `${environment.apiUrl}/api/project/community/program/${this.id}`;
            return this.http.get<any>(url).pipe(map(data => {
                    return data;
                })).subscribe(
                    async data => {
                        if (Object.keys(data).length) {
                            this.passport = data;
                            this.imgUrl = this.passport['image'];
                            this.loading = false;
                        } else {
                            this.isEmpty = true;
                        }
                    },
                    error => {
                        this.isEmpty = true;
                    });
        } else {
            this.loading = false;
        }
    }

    async savePassport() {
        this.loading = true;
        const title = this.passport['title'] ? this.passport['title'] : this.title;
        if (title.split(' ').size > 5) {
            this.toastr.error('Title max 5 words', 'Error', { closeButton: true });
            this.loading = false;
        } else {
            const body = {
                id: this.passport['id'] ? this.passport['id'] : '',
                image: this.imgUrl ? this.imgUrl : this.passport['image'],
                title: this.passport['title'] ? this.passport['title'] : this.title
            };
            const result = await this.postRequest(`${environment.apiUrl}/api/project/community/program/save`, body);
            if (result.status === 1) {
                this.toastr.success(result.message, 'Success', { closeButton: true });
                this.passport = result.value;
                if (this.id == null && this.passport['id']) {
                    this.router.navigate([this.redirectUrl, this.passport['id']]).then();
                }
            } else {
                this.toastr.error(result.message, 'Error', { closeButton: true });
            }
            this.loading = false;
        }
    }

    async deletePassport() {
        this.modal.close();
        return this.http.delete<Status>(`${environment.apiUrl}/api/project/community/program/${this.id}`)
            .subscribe({
                next: data => {
                    if (data.status === 1) {
                        this.toastr.success(data.message, 'Success', { closeButton: true });
                        this.router.navigate(['/vertical/community/program/list']).then(r => { });
                    } else {
                        this.toastr.error(data.message, 'Error', { closeButton: true });
                    }
                },
                error: error => {
                    this.toastr.error('Not saved!', 'Error', { closeButton: true });
                }
            });
    }

    focused() {
        this.isFocused = true;
    }

    openModalRemove(
        body: any,
        header: any = null,
        footer: any = null,
        options: any = null,
        index: number = -1
    ) {
        this.removeIndex = index;
        this.modal.open({
            body: body,
            header: header,
            footer: footer,
            options: options
        });
    }

    closeModal() {
        this.modal.close();
    }

    change($event: any) {
        // console.log($event);
    }

    round(value, precision): number {
        const multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
}
