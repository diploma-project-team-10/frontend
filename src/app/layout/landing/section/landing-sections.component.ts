import { Router } from '@angular/router';
import {Component, ElementRef, OnInit} from '@angular/core';
import { FormBuilder} from '@angular/forms';

import { User } from '../../../interfaces/services/user.service';

import { fadeIn } from 'src/app/animations/form-error';
import {AuthenticationService} from '../../../user/_services/authentication.service';
import {IOption} from '../../../ui/interfaces/option';
import {environment} from '../../../../environments/environment';
import {Store} from '@ngrx/store';
import {IAppState} from '../../../interfaces/app-state';
import {HttpService} from '../../../services/http/http.service';
import {TCModalService} from '../../../ui/services/modal/modal.service';
import {UserService} from '../../../user/_services/user.service';
import * as SettingsActions from '../../../store/actions/app-settings.actions';
@Component({
  selector: 'landing-section',
  templateUrl: './landing-sections.component.html',
  styleUrls: ['./landing-sections.component.scss'],
  animations: [fadeIn]
})
export class LandingSectionComponent implements OnInit {
  gender: IOption[];
  logo = environment.logo;

  loading = false;

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
  }

  ngOnInit() {
    this.loading = true;
  }


  save() {

  }
}

