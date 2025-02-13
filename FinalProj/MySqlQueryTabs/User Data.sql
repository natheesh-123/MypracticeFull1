USE attendance_management;

DELETE FROM users where id = 999;
INSERT INTO Users (id,name,email,password,role,profile_picture) values 
(998, "selva", "selva@gmail.com", "selva@123","Employee", "SmithPic");


INSERT INTO Users (id,name,email,password,role,profile_picture) values 
(100, "Smith", "Smith@gmail.com", "Smith@123","Student", "ProfilePhotoPlaceholder.jpg"),
(101, "Johnson", "Johnson@gmail.com", "Johnson@123","Student", "ProfilePhotoPlaceholder.jpg"),
(102, "Williams", "Williams@gmail.com", "Williams@123","Student", "ProfilePhotoPlaceholder.jpg"),
(103, "Jones", "Jones@gmail.com", "Jones@123","Student", "ProfilePhotoPlaceholder.jpg"),
(104, "Davis", "Davis@gmail.com", "Davis@123","Student", "ProfilePhotoPlaceholder.jpg"),
(105, "Rodriguez", "Rodriguez@gmail.com", "Rodriguez@123","Student", "ProfilePhotoPlaceholder.jpg"),
(106, "Taylor", "Taylor@gmail.com", "Taylor@123","Student", "ProfilePhotoPlaceholder.jpg"),
(107, "Moore", "Moore@gmail.com", "Moore@123","Student", "ProfilePhotoPlaceholder.jpg"),
(108, "Jackson", "Jackson@gmail.com", "Jackson@123","Student", "ProfilePhotoPlaceholder.jpg"),
(109, "Lee", "Lee@gmail.com", "Lee@123","Student", "ProfilePhotoPlaceholder.jpg"),
(500, "Hill", "Hill@gmail.com", "Hill@123","Teacher", "ProfilePhotoPlaceholder.jpg"),
(600, "Roberts", "Roberts@gmail.com", "Roberts@123","Teacher", "ProfilePhotoPlaceholder.jpg"),
(999, "Allen", "Allen@gmail.com", "Allen@123","Admin", "ProfilePhotoPlaceholder.jpg");

INSERT INTO UsersRegistration (id,name,email,password,role,profile_picture) values 
(110, "Smith", "Smith@gmail.com", "Smith@123","Student", "ProfilePhotoPlaceholder.jpg"),
(111, "Johnson", "Johnson@gmail.com", "Johnson@123","Student", "ProfilePhotoPlaceholder.jpg");

delete from roles;
INSERT INTO roles (id, role_name) values
(1,"Student"), (2,"Teacher"), (3,"Admin");


DELETE FROM permissions;
INSERT INTO permissions (role_id, permission_name) values 
(1, "ViewProfile"), (2, "ViewProfile"), (3, "ViewProfile"),
(1, "EditProfile"), (2, "EditProfile"), (3, "EditProfile"),
(1, "MarkAttendance"), (2, "MarkAttendance"),
(1, "AttendanceHistory"), (2, "AttendanceHistory"),
(2, "ViewStudentAttendance"), (3, "ViewStudentAttendance"),
(3, "ViewTeacherAttendance"),
(3, "ViewAllAttendance"),
(3, "ViewRoles"),
(3, "EditRoles"),
(2, "ViewPermissions"), (3, "ViewPermissions"),
(3, "EditPermissions"),
(1, "MakeLeaveRequest"), (2, "MakeLeaveRequest"), (3, "MakeLeaveRequest"),
(1, "LeaveRequestHistory"), (2, "LeaveRequestHistory"), (3, "LeaveRequestHistory"),
(2, "StudentLeaveRequest"), (3, "StudentLeaveRequest"),
(3, "TeacherLeaveRequest"),
(3, "AllLeaveRequest"),
(1, "ViewLeaveTypes"), (2, "ViewLeaveTypes"), (3, "ViewLeaveTypes"),
(3, "EditLeaveTypes"),
(3, "EditAttendance"),
(2, "StudentAttendanceRequest"), (3, "StudentAttendanceRequest"),
(3, "TeachersAttendanceRequest"),
(3, "AllAttendanceRequest"),
(2, "ViewUsers"), (3, "ViewUsers"),
(3, "EditUsers"),
(3, "NewUserRequests");



//Not for Sql
export const PermissionList = 
["ViewProfile"/*0*/,"EditProfile"/*1*/,"MarkAttendance"/*2*/,"AttendanceHistory"/*3*/,"ViewStudentAttendance"/*4*/,"ViewTeacherAttendance"/*5*/,
"ViewAllAttendance"/*6*/,"ViewRoles"/*7*/,"EditRoles"/*8*/,"ViewPermissions"/*9*/,"EditPermissions"/*10*/,"MakeLeaveRequest"/*11*/,"LeaveRequestHistory"/*12*/,
"StudentLeaveRequest"/*13*/,"TeacherLeaveRequest"/*14*/,"AllLeaveRequest"/*15*/,"ViewLeaveTypes"/*16*/,"EditLeaveTypes"/*17*/,"EditAttendance"/*18*/,
"StudentAttendanceRequest"/*19*/,"TeachersAttendanceRequest"/*20*/,"AllAttendanceRequest"/*21*/,"ViewUsers"/*22*/,"EditUsers"/*23*/, "NewUserRequests"/*24*/]