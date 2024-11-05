"""Mt_Sunset URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from backend import views
from backend.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path("ckeditor5/", include('django_ckeditor_5.urls')),
    path('user/settings/', UserSettingsView.as_view(), name='user_settings'),
    
    #Web Site Urls
    path('', WebsiteView.as_view(), name='WebsiteHome', kwargs={'template': 'WebsiteHome'}),
    path('home/', WebsiteView.as_view(), name='WebsiteHome', kwargs={'template': 'WebsiteHome'}),
    path('jobs/applications/', WebsiteView.as_view(), name='jobs_applications', kwargs={'template': 'jobs_applications'}),
    path('student/application/', WebsiteView.as_view(), name='students_applications', kwargs={'template': 'students_applications'}),
    path('aboutus/', WebsiteView.as_view(), name='who-we-are', kwargs={'template': 'who-we-are'}),
    path('message/', WebsiteView.as_view(), name='website_message', kwargs={'template': 'website_message'}),
    path('visions/missions/objectives/', WebsiteView.as_view(), name='vision-mission-objectives', kwargs={'template': 'vision-mission-objectives'}),
    path('team/staff/', WebsiteView.as_view(), name='staff&members', kwargs={'template': 'staff&members'}),
    path('academics/resources/', WebsiteView.as_view(), name='resources&facilities', kwargs={'template': 'resources&facilities'}),
    path('history/', WebsiteView.as_view(), name='history', kwargs={'template': 'history'}),
    path('academics/information/', WebsiteView.as_view(), name='academic-information', kwargs={'template': 'academic-information'}),
    path('academics/grades/', WebsiteView.as_view(), name='academic_grades', kwargs={'template': 'academic_grades'}),
    path('admissions/notes/', WebsiteView.as_view(), name='admission-notices', kwargs={'template': 'admission-notices'}),
    path('news/', WebsiteView.as_view(), name='news', kwargs={'template': 'news'}),
    path('events/', WebsiteView.as_view(), name='event', kwargs={'template': 'event'}),
    path('events/details/', WebsiteView.as_view(), name='event-details', kwargs={'template': 'event-details'}),
    path('blog/', WebsiteView.as_view(), name='our-blog', kwargs={'template': 'our-blog'}),
    path('blog/details/', WebsiteView.as_view(), name='blog-details', kwargs={'template': 'blog-details'}),
    path('contact-details/', WebsiteView.as_view(), name='contact', kwargs={'template': 'contact'}),
    path('team/', WebsiteView.as_view(), name='our-team', kwargs={'template': 'our-team'}),
    path('objectives/details/', WebsiteView.as_view(), name='objectives-detail', kwargs={'template': 'objectives-detail'}),
    path('services/details/', WebsiteView.as_view(), name='service-details', kwargs={'template': 'service-details'}),
    path('gallery/', WebsiteView.as_view(), name='gallery', kwargs={'template': 'gallery'}),
    
    
    #Signup urls
    path('admin_token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('student_token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('parent_token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/staff/', RegisterStaffView.as_view(), name='auth_register_staff'),
    path('register/student/', RegisterStudentView.as_view(), name='auth_register_student'),
    path('parent/register/search/students/', RegisterParentSearchStudentView.as_view(), name='auth_register_parent_search_student'),
    path('register/parent/', RegisterParentView.as_view(), name='auth_register_parent'),
    
    
    #Main Admin
    path('adminstrator/dashboard/', StaffDetailView.as_view(), name='admin_dashboard'),
    path('adminstrator/staff/details/', StaffDetailView.as_view(), name='staff_details'),
    path('adminstrator/staff/', StaffView.as_view(), name='staff'),
    path('adminstrator/students/', StudentsView.as_view(), name='students'),
    path('adminstrator/parents/', ParentsView.as_view(), name='parents'),
    path('adminstrator/staff/job/applications/', JobApplicationsView.as_view(), name='staff_job_applications'),
    path('adminstrator/students/enrolments/', StudentsEnrolmentView.as_view(), name='students_enrolments'),
    path('adminstrator/staff/job/applications/accepted/', AcceptedJobApplicationsView.as_view(), name='staff_job_applications_accepted'),
    path('adminstrator/students/enrolments/accepted/', AcceptedStudentsEnrolmentView.as_view(), name='students_enrolments_accepted'),

    #Teachers
    
    
    #Students
    path('Student/dashboard/', StudentsDetailView.as_view(), name='Students_details'),
    path('Student/details/', StudentsDetailView.as_view(), name='Students_details'),
    path('Student/notices/', StudentsDetailView.as_view(), name='Students_details'),
    path('Student/classes/', StudentsDetailView.as_view(), name='Students_details'),
    path('Student/library/', StudentsDetailView.as_view(), name='Students_details'),
    path('Student/results/', StudentsDetailView.as_view(), name='Students_details'),
    path('Student/timetables/', StudentsDetailView.as_view(), name='Students_details'),
 
    
    #Parents
    path('parent/details/', ParentsDetailView.as_view(), name='Parents_details'),
    path('parent/child/details/', ParentsChildDetailsView.as_view(), name='Parents_child_details'),
    path('parent/notices/', ParentsNoticesView.as_view(), name='Parents_noticess'),
    path('parent/classes/', ParentsClassesView.as_view(), name='Parents_classes'),
    path('parent/fees/', ParentsFeesView.as_view(), name='Parents_fees'),
    path('parent/results/', ParentsResultsView.as_view(), name='Parents_results'),
    path('parent/timetables/', ParentsTimeTablessView.as_view(), name='Parents_timetables'),
    
]
