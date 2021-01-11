create schema NyZaKa;


create table NyZaKa.Users (
Handle      varchar(100)   NOT NULL ,
Acsess      varchar(100)   NOT NULL ,
E_mail      varchar(100)   NOT NULL ,
Password_   varchar(80)   NOT NULL ,
Fname       varchar(80)   NOT NULL ,
Lname       varchar(80)   ,
Rate_max    int           NOT NULL ,
Rate_cur    int           NOT NULL ,
PRIMARY KEY  (Handle)       );


create table NyZaKa.Contest (
Contest_ID    int       NOT NULL  AUTO_INCREMENT,
Day_          Datetime           NOT NULL ,
Hour_         Time           NOT NULL ,
Duration      int           NOT NULL ,
PRIMARY KEY  (Contest_ID)       );


create table NyZaKa.Documentation (
ID       		 	int        NOT NULL AUTO_INCREMENT,
DocName         char(50)  NOT NULL ,
Topic      			varchar(20)     NOT NULL ,
Statment      		varchar(1000)     NOT NULL ,
Doc_date     			DATETIME         	NOT NULL ,
Writer       	varchar(100)        NOT NULL ,
foreign key  (Writer) REFERENCES users (Handle) ,
PRIMARY KEY  (ID)       );



create table NyZaKa.Articles (
ID        int       NOT NULL AUTO_INCREMENT,
ArtName       char(50)  NOT NULL,
Topic      varchar(20)     NOT NULL ,
Statment      varchar(1000)          NOT NULL ,
Art_date     DATETIME         NOT NULL ,
Writer       varchar(100)        NOT NULL ,
foreign key  (Writer) REFERENCES users (Handle) ,
PRIMARY KEY  (ID)       );

create table NyZaKa.Groups_ (
Name_        varchar(20)       NOT NULL ,
Owner_       varchar(100)     NOT NULL ,
foreign key  (Owner_) REFERENCES users (Handle) ,
PRIMARY KEY  (Name_)       );

/* Group Admins */
create table NyZaKa.Teams (
Name_         varchar(20)       NOT NULL ,
Team_Rate_max    int           NOT NULL ,
Team_Rate_cur    int           NOT NULL ,
Member1       varchar(100)     NOT NULL ,
Member2       varchar(100)     ,
Member3       varchar(100)     ,
foreign key  (Member1) REFERENCES users (Handle) ,
foreign key  (Member2) REFERENCES users (Handle) ,
foreign key  (Member3) REFERENCES users (Handle) ,
PRIMARY KEY  (Name_)       );






create table NyZaKa.Friends (
Follower       varchar(100)       NOT NULL ,
Followee       varchar(100)       NOT NULL ,
foreign key  (Follower) REFERENCES users (Handle) ,
foreign key  (Followee) REFERENCES users (Handle) ,
PRIMARY KEY  (Follower ,Followee )       );




create table NyZaKa.Group_Members (
Group_Name        varchar(40)       NOT NULL ,
Group_Member       varchar(100)       NOT NULL ,
foreign key  (Group_Member) REFERENCES users (Handle) ,
foreign key (Group_Name) REFERENCES Groups_  (Name_),
PRIMARY KEY  (Group_Name ,Group_Member )       );

create table NyZaKa.Group_Admins (
  Group_Name  varchar(40) NOT NULL,
  Group_Admin  varchar(100)  NOT NULL,
  foreign key  (Group_Admin) REFERENCES users (Handle) ,
  foreign key (Group_Name) REFERENCES Groups_  (Name_),
  PRIMARY KEY  (Group_Name ,Group_Admin ) 
);

create table NyZaKa.Participate (
Contest_ID        int    NOT NULL ,
Participant       varchar(100)       NOT NULL ,
Score        int   ,
foreign key  (Contest_ID) REFERENCES Contest (Contest_ID) ,
foreign key  (Participant) REFERENCES users (Handle) ,
PRIMARY KEY  (Contest_ID ,Participant )       );

create table NyZaKa.Team_Participate (
Contest_ID        int    NOT NULL,
Team_Participant       varchar(20)       NOT NULL ,
Score        int   ,
foreign key  (Contest_ID) REFERENCES Contest (Contest_ID) ,
foreign key  (Team_Participant) REFERENCES Teams (Name_) ,
PRIMARY KEY  (Contest_ID ,Team_Participant )       );

/*
create table NyZaKa.Make_Contest (
Contest_ID      char(3)       NOT NULL ,
Writer       varchar(100)       NOT NULL ,
foreign key  (Contest_ID) REFERENCES Contest (Contest_ID) ,
foreign key  (Writer) REFERENCES users (Handle) ,
PRIMARY KEY  (Contest_ID ,Writer )       );
*/

create table NyZaKa.Problem (
Problem_ID  int       NOT NULL AUTO_INCREMENT,
Topic       varchar(20)   ,
NameProblem varchar(20)   NOT NULL ,
writer      varchar(100)   NOT NULL ,
input       varchar(1000)   NOT NULL ,
output      varchar(1000)   NOT NULL ,
statment    varchar(1000)   NOT NULL ,
Input_Format varchar(1000) ,
Output_Format varchar(1000),
score       int          NOT NULL ,
difficulty int            ,
Sample_Input varchar(45),
Sample_Output varchar(45),
foreign key  (writer) REFERENCES users (Handle) ,
PRIMARY KEY  (Problem_ID)       );

create table NyZaKa.Contest_Problems (
	Contest_ID    int       NOT NULL ,
	  Problem_ID  int       NOT NULL ,
      foreign key(contest_ID) references contest (Contest_ID) ,
      foreign key(problem_ID) references problem (Problem_ID) ON DELETE CASCADE,
      primary key(Contest_ID,Problem_ID)
);

create table NyZaKa.Submissions (
ID				int auto_increment,
Problem_ID  int      NOT NULL,
User_      varchar(100)          NOT NULL ,
Time_     DATETIME         NOT NULL ,
Output       varchar(1000)       ,
Submission_Status       varchar(20)        NOT NULL ,
foreign key  (Problem_ID) REFERENCES Problem (Problem_ID) ON DELETE CASCADE,
foreign key  (User_) REFERENCES users (Handle) ,
PRIMARY KEY  (ID)       );


create table NyZaKa.Team_Submissions (
ID				int NOT NULL AUTO_INCREMENT,
Problem_ID     int     NOT NULL ,
Team_Name      varchar(20)          NOT NULL ,
Time_     DATETIME         NOT NULL ,
Output       varchar(1000)   ,
Submission_Status       varchar(20)        NOT NULL ,
foreign key  (Problem_ID) REFERENCES Problem (Problem_ID) ON DELETE CASCADE ,
foreign key  (Team_Name) REFERENCES Teams (Name_) ,
PRIMARY KEY  (ID)       );

