import {Routes} from '@angular/router';
import {CompanyListComponent} from '../pages/projects/courses/company/list';
import {AuthGuard} from '../user/_helpers/auth.guard';
import {AddTopicComponent} from '../pages/projects/comminuty/topics/add-topic.component';
import {AddProblemComponent} from '../pages/projects/comminuty/add-problem/add-problem.component';
import {ProblemListComponent} from '../pages/projects/comminuty/problem-list/problem-list.component';
import {QuizComponent} from '../pages/projects/comminuty/quiz/quiz.component';
import {ProgramComponent} from '../pages/projects/comminuty/program/program.component';
import {EditCompanyComponent} from '../pages/projects/courses/admin/company/edit';
import {ViewCompanyComponent} from '../pages/projects/courses/company/view';
import {EditPackageComponent} from '../pages/projects/courses/admin/package/edit';
import {EditTeacherComponent} from '../pages/projects/courses/admin/teacher/edit';
import {TeacherListComponent} from '../pages/projects/courses/teacher/list';
import {ViewTeacherComponent} from '../pages/projects/courses/teacher/view';
import {EditCourseComponent} from '../pages/projects/courses/admin/course/edit';
import {EditModuleComponent} from '../pages/projects/courses/admin/module/edit';
import {EditLessonComponent} from '../pages/projects/courses/admin/lesson/edit';
import {CourseListComponent} from '../pages/projects/courses/course/list';
import {EditQuizCourseComponent} from '../pages/projects/courses/admin/quiz/edit';
import {CourseListCardComponent} from '../pages/projects/courses/course/list-card/course-list-card.component';
import {ViewCourseComponent} from '../pages/projects/courses/course/view/course';
import {ViewModuleComponent} from '../pages/projects/courses/course/view/module/view-module.component';
import {ViewLessonComponent} from '../pages/projects/courses/course/view/lesson';
import {ViewQuizComponent} from '../pages/projects/courses/course/view/quiz';
import {PassportListComponent} from '../pages/projects/comminuty/program-list/list.component';

export const COURSES_ROUTES: Routes = [
  {
    path: 'companies',
    children: [
      { path: 'list', component: CompanyListComponent },
      { path: 'view/:id', component: ViewCompanyComponent },
    ]
  },
  {
    path: 'admin/companies',
    children: [
      { path: 'add', component: EditCompanyComponent },
      { path: 'edit/:id', component: EditCompanyComponent },
    ],
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/package',
    children: [
      { path: 'add', component: EditPackageComponent },
      { path: 'edit/:id', component: EditPackageComponent },
    ],
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },

  {
    path: 'teacher',
    children: [
      { path: 'list', component: TeacherListComponent },
      { path: 'view/:id', component: ViewTeacherComponent },
    ]
  },
  {
    path: 'admin/teacher',
    children: [
      { path: 'add', component: EditTeacherComponent },
      { path: 'edit/:id', component: EditTeacherComponent },
    ],
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'course',
    children: [
      { path: 'list', component: CourseListComponent },
      { path: 'main', component: CourseListCardComponent },
      { path: 'view/:id', component: ViewCourseComponent },
      { path: 'module/view/:id', component: ViewModuleComponent },
      { path: 'lesson/view/:id', component: ViewLessonComponent },
      { path: 'quiz/view/:id', component: ViewQuizComponent },
    ],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'admin/course',
    children: [
      { path: 'add', component: EditCourseComponent },
      { path: 'edit/:id', component: EditCourseComponent },
      { path: 'module/add', component: EditModuleComponent },
      { path: 'module/edit/:id', component: EditModuleComponent },
      { path: 'lesson/add', component: EditLessonComponent },
      { path: 'lesson/edit/:id', component: EditLessonComponent },
      { path: 'quiz/add', component: EditQuizCourseComponent },
      { path: 'quiz/edit/:id', component: EditQuizCourseComponent },
    ],
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },

  {
    path: 'quiz',
    children: [
      // { path: 'list/:companyId', component: PackageListComponent },
    ]
  },
];

export const COMMUNITY_ROUTES: Routes = [
    {
        path: 'program',
        children: [
            {path: 'list', component: PassportListComponent},
            {path: 'add', component: ProgramComponent},
            {path: 'edit/:id', component: ProgramComponent},
        ],
        canActivate: [AuthGuard],
        data: {roles: ['community_admin']}
    },
    {
        path: 'quiz/:id', component: QuizComponent,
        canActivate: [AuthGuard],
        data: {roles: ['community_admin']}
    },
    {
        path: 'problem',
        children: [
            {path: 'add', component: AddProblemComponent},
            {path: 'add/:topicId', component: AddProblemComponent},
            {path: 'edit/:problemId', component: AddProblemComponent},
            {path: 'edit/:problemId/:copied', component: AddProblemComponent},
        ],
        canActivate: [AuthGuard],
        data: {roles: ['community_admin']}
    },
];
