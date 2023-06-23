import { Router } from '@angular/router';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { User } from '../../interfaces/services/user.service';

import { fadeIn } from 'src/app/animations/form-error';
import { AuthenticationService } from '../../user/_services/authentication.service';
import { IOption } from '../../ui/interfaces/option';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { HttpService } from '../../services/http/http.service';
import { TCModalService } from '../../ui/services/modal/modal.service';
import { Content } from '../../ui/interfaces/modal';
import { UserService } from '../../user/_services/user.service';
import * as SettingsActions from '../../store/actions/app-settings.actions';
import { BaseLayoutComponent } from '../base-layout';

@Component({
  selector: 'page-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations: [fadeIn],
})
export class PageLandingComponent extends BaseLayoutComponent
  implements OnInit {
  gender: IOption[];
  currentAvatar: string | ArrayBuffer;
  defaultAvatar: string;

  editPencil = false;
  appMenu = environment.appMenu;
  logo = environment.logo;
  index;

  loading = false;
  currentUser: User;

  constructor(
    store: Store<IAppState>,
    fb: FormBuilder,
    httpSv: HttpService,
    router: Router,
    elRef: ElementRef,
    modal: TCModalService,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    super(store, fb, httpSv, router, elRef, modal);
    // this.currentUser =
    //     this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    super.ngOnInit();
    this.store.dispatch(new SettingsActions.Update({ layout: 'vertical' }));
    this.loading = true;
  }

  getSidebarStyles(): any {
    return {
      'background-image': `linear-gradient(188deg, ${this.appSettings.sidebarBg}, ${this.appSettings.sidebarBg2} 65%)`,
      color: this.appSettings.sidebarColor,
    };
  }

  closeModal() {
    this.modal.close();
  }
  openModal<T>(
    body: Content<T>,
    header: Content<T> = null,
    options: any = null,
    index = -1
  ) {
    this.index = index;
    this.modal.open({
      body: body,
      header: header,
      options: options,
    });
  }

  save() {}
}
