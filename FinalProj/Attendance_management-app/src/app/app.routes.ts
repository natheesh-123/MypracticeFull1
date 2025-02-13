import { Routes } from '@angular/router';

import { EditUsersComponent } from './AdminModule/edit-users/edit-users.component';
import { NewUserRequestsComponent } from './AdminModule/new-user-requests/new-user-requests.component';

import { AttendanceMarkComponent } from './AttendanceModule/attendance-mark/attendance-mark.component';
import { AttendanceHistoryComponent } from './AttendanceModule/attendance-history/attendance-history.component';
import { ViewStudentAttendanceComponent } from './AttendanceModule/view-student-attendance/view-student-attendance.component';
import { ViewTeacherAttendanceComponent } from './AttendanceModule/view-teacher-attendance/view-teacher-attendance.component';
import { ViewAllAttendanceComponent } from './AttendanceModule/view-all-attendance/view-all-attendance.component';

import { AttendanceRequestStudentComponent } from './AttendanceRequestModule/attendance-request-student/attendance-request-student.component';
import { AttendanceRequestTeacherComponent } from './AttendanceRequestModule/attendance-request-teacher/attendance-request-teacher.component';
import { ViewAllAttendancerequestComponent } from './AttendanceRequestModule/view-all-attendancerequest/view-all-attendancerequest.component';

import { LeaveRequestComponent } from './LeaveModule/leave-request/leave-request.component';
import { LeaveRequestHistoryComponent } from './LeaveModule/leave-request-history/leave-request-history.component';
import { LeaveTypeComponent } from './LeaveModule/leave-type/leave-type.component';
import { StudentLeaveRequestComponent } from './LeaveModule/student-leave-request/student-leave-request.component';
import { TeacherLeaveRequestComponent } from './LeaveModule/teacher-leave-request/teacher-leave-request.component';

import { ViewPermissionsComponent } from './PermissionModule/view-permissions/view-permissions.component';
import { EditPermissionsComponent } from './PermissionModule/edit-permissions/edit-permissions.component';

import { ViewRolesComponent } from './RolesModule/view-roles/view-roles.component';

import { UserLoginComponent } from './UserModule/user-login/user-login.component';
import { UserRegistrationComponent } from './UserModule/user-registration/user-registration.component';
import { UserDashboardComponent } from './UserModule/user-dashboard/user-dashboard.component';
import { ViewProfileComponent } from './UserModule/view-profile/view-profile.component';
import { ForgotPasswordComponent } from './UserModule/forgot-password/forgot-password.component';
import { UserDetailsComponent } from './UserModule/user-details/user-details.component';
import { AllLeaveRequestComponent } from './LeaveModule/all-leave-request/all-leave-request.component';

export const routes: Routes = [
    {path:"", component:UserLoginComponent},
    {path:"userregistration", component:UserRegistrationComponent},
    {path:"forgotpassword", component:ForgotPasswordComponent},
    {path:"dashboard", component:UserDashboardComponent, children:[
        {path:"", component:UserDetailsComponent},
        {path:"profile", component:ViewProfileComponent},

        {path:"markatt", component:AttendanceMarkComponent},
        {path:"atthistory", component:AttendanceHistoryComponent},
        {path:"studentatt", component:ViewStudentAttendanceComponent},
        {path:"teacheratt", component:ViewTeacherAttendanceComponent},
        {path:"allattendance", component:ViewAllAttendanceComponent},

        {path:"studentattreq", component:AttendanceRequestStudentComponent},
        {path:"teacherattreq", component:AttendanceRequestTeacherComponent},
        {path:"allattreq", component:ViewAllAttendancerequestComponent},

        {path:"reqleave", component:LeaveRequestComponent},
        {path:"reqleavehistory", component:LeaveRequestHistoryComponent},
        {path:"leavetypes", component:LeaveTypeComponent},
        {path:"studentleavereq", component:StudentLeaveRequestComponent},
        {path:"teacherleavereq", component:TeacherLeaveRequestComponent},
        {path:"allleavereq", component:AllLeaveRequestComponent},

        {path:"viewpermissions", component:ViewPermissionsComponent},
        {path:"editpermissions", component:EditPermissionsComponent},

        {path:"viewroles", component:ViewRolesComponent},

        {path:"newuserreq", component:NewUserRequestsComponent},
        {path:"userlist", component:EditUsersComponent},
    ]},
    {path:"**", component:UserLoginComponent}

];
