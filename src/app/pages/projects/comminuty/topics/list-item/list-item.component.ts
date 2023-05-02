import {
  Component,
  OnInit,
  HostBinding,
  ElementRef,
  Renderer2,
  AfterViewInit, Input, Output, EventEmitter,
} from '@angular/core';
import {Topic} from '../../../../../interfaces/services/projects/community.service';
import {TCModalService} from '../../../../../ui/services/modal/modal.service';
import {Content} from '../../../../../ui/interfaces/modal';
import {environment} from '../../../../../../environments/environment';
import {Status} from '../../../../../interfaces/services/util.service';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {id} from '@swimlane/ngx-charts';
import {ExpEx} from '../../../../../interfaces/services/projects/sendex';


@Component({
  selector: 'topic-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class TopicListItemComponent implements OnInit {
  @Input() data: Topic[] = [];
  @Input() program = '';

  index;
  successColor = 'success';
  successIcon = 'icofont-check tc-icon-wrap';
  color = [];
  icon = [];

  iconString = 'icofont-caret-right tc-icon-wrap';
  newTopic = '';

  constructor(private modal: TCModalService,
              private http: HttpClient,
              private toastr: ToastrService) {}

  ngOnInit() {
  }

  addChildren(children: Topic[], parentId: string, pos: number) {
    this.data[pos].hidden = false;
    this.iconString = 'icofont-caret-down tc-icon-wrap';
    children.push({ id: '', title: '', key: '', children: [], parentId: parentId, orderNum: 0, hidden: false});
  }

  saveTopic(topic: Topic, i: number) {
    let sUrl = `${environment.apiUrl}/api/project/community/topic/new`;
    if (topic.id && topic.id !== '') {
      sUrl = `${environment.apiUrl}/api/project/community/topic/update`;
    }
    return this.http.post<Status>(sUrl, topic)
        .subscribe({
          next: data => {
            if (data.status === 1) {
              this.color[i] = this.successColor;
              this.icon[i] = this.successIcon;
              topic.id = data.value;
            } else {
              this.toastr.error(data.message, 'Error', { closeButton: true });
            }
          },
          error: error => {
            this.toastr.error('Not saved!', 'Error', { closeButton: true });
          }
        });
  }

  removeTopic(i: number) {
    if (this.data[i].id != null && this.data[i].id !== '') {
      this.http.delete<Status>(`${environment.apiUrl}/api/project/community/topic/delete/${this.data[i].id}`)
          .subscribe({
            next: data => {
              if (data.status === 1) {
                this.toastr.success(data.message, 'Success', { closeButton: true });
                this.data.splice(i, 1);
                this.color.splice(i, 1);
                this.icon.splice(i, 1);
              } else {
                this.toastr.success(data.message, 'Warning', { closeButton: true });
              }
            },
            error: error => {
              this.toastr.error('Not saved!', 'Error', { closeButton: true });
            }
          });
    } else {
      this.data.splice(i, 1);
      this.color.splice(i, 1);
      this.icon.splice(i, 1);
    }

    this.modal.close();
  }

  closeModal() {
    this.modal.close();
  }

  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null, index = -1) {
    this.index = index;
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
    // this.removeTopic(index);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].orderNum = i + 1;
    }
    this.topicList();
  }

  topicList() {
    this.http.post(`${environment.apiUrl}/api/project/community/topic/update/order`, this.data)
        .subscribe({
          next: data => console.log('success => ' + data),
          error: error => console.log('Error => ' + error)
        });
  }

  toggle(pos: number) {
    this.data[pos].hidden = !this.data[pos].hidden;
    if (this.data[pos].hidden) {
      this.iconString = 'icofont-caret-right tc-icon-wrap';
    } else {
      this.iconString = 'icofont-caret-down tc-icon-wrap';
    }
  }

  addTopic() {
    this.data.push({ id: '', title: this.newTopic, children: [], parentId: this.program, orderNum: 0, hidden: true });
    const index = this.data.length - 1;
    this.saveTopic(this.data[index], index);
    this.newTopic = '';
  }

}
