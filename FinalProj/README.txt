1. Drop database 		(MySql_Tables_Querry.txt)
2. Create Database 		(MySql_Tables_Querry.txt)
3. Create Tables 		(MySql_Tables_Querry.txt)
4. Create Trigger and Event 	(MySql_Triggers.txt)
5. Insert Data			(MySql_Users_Roles_Permissions_Datas.txt, MySql_Attendance_Data.txt)


CHANGE LOG - 08/02/2025 7PM
1.  Changed the inserted data in Permissions Table in Mysql.
    Added all permissions to every role just for now.

2. In .NET, removed the [HttpGet("role/{role}")]  controller, added role parameter to [HttpGet("limit/{count}")].

3. Added NgRx in Angular, Works Fine. Just Follow the Steps in (NgRx_State_Management.txt).
    i. added ngrx to most components.

3. Changes to UserModule/UserLogin Component.  
    i. added ngrx and steps to add user data from backend to the store and localStorage.
    ii. Used Reactive Forms in the HTML.

4. Added Main Dashboard (UserModule/user-dashboard) and default routing to display (UserModule/user-details) by default
    i. user-details Component has examples of How the links are displayed in the HTML.
    ii.Not Fully Complete.

5. Create 
    i.AttendanceModule/(attendance-history) - Shows the Attendance details of the logged in user
    ii.AttendanceModule/(view-all-attendance) - Shows the Attendance details of all users
    iii.AttendanceModule/(view-student-attendance) - Shows the Attendance details of all Students
    iv.AttendanceModule/(view-teacher-attendance) - Shows the Attendance details of all teachers

6. Given Some Routing.








CHANGE LOG - 09/02/2025 11:30PM
1. Changed The Validation of Login Page Form
2. Updated How Messages Are displayed in the UI
3. Updated Dashboard to correspond to the permissions available to the user.
4. Added a Profile page
5. Changed the User Registration Page and The Add some required controller for handling Image uploads.
6. Added some api's for Role and Permissions Controller
7. Added Roles and Permissions Module. And Some other modules.
8. Added New Permissions in the MYSQL, so check for data changes.
10. AND MANY OTHER.



date request from server.