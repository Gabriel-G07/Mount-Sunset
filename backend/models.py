import datetime, random, string
from datetime import datetime, timezone
from django.utils import timezone
from django.db import connection, models
from django.contrib.auth.models import AbstractUser, UserManager
from django.db.models.signals import pre_save, post_save


class JobApplications(models.Model):
    class Meta:
        db_table = 'staff_job_application'

    Name = models.CharField(max_length=50)
    Surname = models.CharField(max_length=50)
    Gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    PhoneNumber = models.CharField(max_length=20)
    pPosition = models.CharField(max_length=50)
    DOB = models.DateField(verbose_name="Date of Birth")
    Marital_Status = models.CharField(max_length=20, choices=[('Single', 'Single'), ('Married', 'Married'), ('Divoced', 'Divoced')])
    Email = models.EmailField()
    Address = models.CharField(max_length=200)

class StudentsEnrolments(models.Model):
    class Meta:
        db_table = 'students_enrolments'
        
    Name = models.CharField(max_length=50)
    Surname = models.CharField(max_length=50)
    Gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    DOB = models.DateField()
    Email = models.EmailField(unique=True)
    Phone_Number = models.CharField(max_length=20)
    Grade_Level = models.CharField(max_length=20, choices=[
        ('ECD A', 'ECD A'),
        ('ECD B', 'ECD B'),
        ('Grade 1', 'Grade 1'),
        ('Grade 2', 'Grade 2'),
        ('Grade 3', 'Grade 3'),
        ('Grade 4', 'Grade 4'),
        ('Grade 5', 'Grade 5'),
        ('Grade 6', 'Grade 6'),
        ('Grade 7', 'Grade 7'),
    ])
    Address = models.CharField(max_length=100)
    
    # Parent information
    Parent_Name = models.CharField(max_length=100)
    Parent_Surname = models.CharField(max_length=100)
    Parent_Email = models.EmailField()
    Relationship = models.CharField(max_length=20)
    Parent_Phone_Number = models.CharField(max_length=20)



class CustomUserManager(UserManager):
    def create_user(self, username, first_name, last_name, email, password, role):
        email = self.normalize_email(email)
        user = self.model(
            username=username,
            first_name=first_name, 
            last_name=last_name,
            email=email,
            role=role
        )
        user.set_password(password)
        user.last_login = timezone.now()
        user.save(using=self._db)
        return user

class User(AbstractUser):
    class Meta:
        db_table = 'auth_user'
        auto_created = False
    
    username = models.CharField(max_length=150, primary_key=True, unique=True, null=False, blank=False)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    role = models.CharField(max_length=50)
    is_online = models.BooleanField(default=False)
    last_logout = models.DateTimeField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    settings = models.TextField(null=True, blank=True)
    verified = models.BooleanField(default=False)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'role', 'email']
    
    def __str__(self):
        return self.username
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if self.role in ['Teacher', 'Head Master', 'Vice Head Master', 'Director', 'Developer']:
            self.is_staff = True
        else:
            self.is_staff = False

        self.last_login = datetime.now()

        super().save(*args, **kwargs)



class Staff(models.Model):
    class Meta:
        db_table = 'Staff'

    Username = models.CharField(max_length=50, unique=True, null=False)
    Name = models.CharField(max_length=50)
    Surname = models.CharField(max_length=50)
    Gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    Position = models.CharField(max_length=50)
    DOB = models.DateField(verbose_name="Date of Birth")
    Marital_Status = models.CharField(max_length=20, choices=[('Single', 'Single'), ('Married', 'Married'), ('Divoced', 'Divoced')])
    Email = models.EmailField(unique=True, null=False, primary_key=True)
    PhoneNumber = models.CharField(max_length=20)
    Address = models.CharField(max_length=200)


class Parents(models.Model):
    class Meta:
        db_table = 'Parents'
    Username = models.CharField(primary_key=True, max_length=50, unique=True, null=False, blank=False)
    Name = models.CharField(max_length=100)
    Surname = models.CharField(max_length=100)
    ID_Number = models.CharField(max_length=20, unique=True)
    Email = models.EmailField(unique=True, null=False, blank=False)
    Relationship = models.CharField(max_length=20)
    Phone_Number = models.CharField(max_length=20, unique=True)
    Address = models.CharField(max_length=100, null=True, blank=True)
    Occupation = models.CharField(max_length=50, null=True, blank=True)
    Student = models.ForeignKey('Students', on_delete=models.CASCADE, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if self.pk is None:
            super().save(*args, **kwargs)
        else: 
            orig_obj = Parents.objects.get(pk=self.pk)
            if orig_obj.Username != self.Username:
                Students.objects.filter(Parent=orig_obj).update(Parent=self.Username)
            super().save(*args, **kwargs)
        
    def __str__(self):
        return self.Username

class Students(models.Model):
    class Meta:
        db_table = 'Students'
        
    RegNumber = models.CharField(max_length=8, primary_key=True, editable=False, unique=True, null=False, blank=False)
    Name = models.CharField(max_length=50)
    Surname = models.CharField(max_length=50)
    Gender = models.CharField(max_length=6)
    DOB = models.DateField()
    Email = models.EmailField(unique=True)
    Phone_Number = models.CharField(max_length=20)
    Grade_Level = models.CharField(max_length=20)
    Address = models.CharField(max_length=100)
    Parent = models.ForeignKey('Parents', on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to="user_images", default="default.jpg", null=True, blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.pk:
            Parents.objects.filter(Student=self).update(Student=self.RegNumber)
            
    def __str__(self):
        return self.RegNumber
    
class Fees(models.Model):
    class Meta:
        db_table = 'Fees'
        
    student = models.ForeignKey('Students', on_delete=models.CASCADE)
    term = models.CharField(max_length=20)
    year = models.IntegerField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    payment_method = models.CharField(max_length=20)
    payment_status = models.CharField(max_length=20, default='Pending')

    def __str__(self):
        return f"{self.student.RegNumber} - {self.term} {self.year}"

class Payments(models.Model):
    class Meta:
        db_table = 'Payments'
        
    fee = models.ForeignKey('Fees', on_delete=models.CASCADE)
    payment_date = models.DateField()
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20)
    payment_reason = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.fee.student.RegNumber} - {self.payment_date}"
    
class Teachers(models.Model):
    class Meta:
        db_table = 'Teachers'
        
    Username = models.CharField(max_length=8, primary_key=True, editable=False, unique=True, null=False, blank=False)
    Name = models.CharField(max_length=50)
    Surname = models.CharField(max_length=50)
    gender = models.CharField(max_length=6)
    dob = models.DateField()
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.teacher_id} - {self.name} {self.surname}"
    
class Classes(models.Model):
    class Meta:
        db_table = 'Classes'
        
    student = models.ForeignKey('Students', on_delete=models.CASCADE)
    grade_level = models.CharField(max_length=20)  # e.g. Grade 1, Grade 2, etc.
    class_name = models.CharField(max_length=20)  # e.g. 1A, 2B, etc.
    teacher = models.ForeignKey('Teachers', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.student.RegNumber} - {self.class_name}"
    
class ClassAllocation(models.Model):
    class Meta:
        db_table = 'ClassAllocation'
        
    year = models.IntegerField()
    term = models.CharField(max_length=20)
    class_name = models.CharField(max_length=20)
    teacher = models.ForeignKey('Teachers', on_delete=models.CASCADE)
    students = models.ManyToManyField('Students')
    room_number = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.year} - {self.term} - {self.class_name} - {self.teacher.name}"
    
class Results(models.Model):
    class Meta:
        db_table = 'Results'
        
    student = models.ForeignKey('Students', on_delete=models.CASCADE)
    subject = models.CharField(max_length=20) 
    grade = models.CharField(max_length=2)
    term = models.CharField(max_length=20) 
    year = models.IntegerField() 

    def __str__(self):
        return f"{self.student.RegNumber} - {self.subject}"
    
class Attendance(models.Model):
    class Meta:
        db_table = 'Attendance'
        
    student = models.ForeignKey('Students', on_delete=models.CASCADE)
    date = models.DateField()
    present = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.RegNumber} - {self.date}"


class Classrooms(models.Model):
    class Meta:
        db_table = 'Classrooms'

    room_number = models.CharField(max_length=10, primary_key=True)
    capacity = models.IntegerField()
    teacher = models.ForeignKey('Teachers', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.room_number


class StudentAttendances(models.Model):
    class Meta:
        db_table = 'StudentAttendances'

    student = models.ForeignKey('Students', on_delete=models.CASCADE)
    date = models.DateField()
    present = models.BooleanField(default=False)
    notes = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return f"{self.student.RegNumber} - {self.date}"


class StaffAttendances(models.Model):
    class Meta:
        db_table = 'StaffAttendances'

    staff = models.ForeignKey('Staff', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    present = models.BooleanField(default=False)
    notes = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return f"{self.staff.Username} - {self.timestamp}"


class Results(models.Model):
    class Meta:
        db_table = 'Results'

    student = models.ForeignKey('Students', on_delete=models.CASCADE)
    subject = models.CharField(max_length=20)
    grade = models.CharField(max_length=2)
    term = models.CharField(max_length=20)
    year = models.IntegerField()
    notes = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return f"{self.student.RegNumber} - {self.subject}"


class Messages(models.Model):
    class Meta:
        db_table = 'Messages'

    sender = models.CharField(max_length=50)  # 'Parent', 'Teacher', 'Admin'
    receiver = models.CharField(max_length=50)  # 'Parent', 'Teacher', 'Admin'
    message = models.TextField()
    date_sent = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender} - {self.receiver}"


class Notices(models.Model):
    class Meta:
        db_table = 'Notices'

    title = models.CharField(max_length=200)
    content = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)
    Username = models.CharField(max_length=50)

    def __str__(self):
        return self.title