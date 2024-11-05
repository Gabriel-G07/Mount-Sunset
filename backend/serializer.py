import uuid
from .models import *
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.response import Response




#Authentication
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'role', 'bio', 'image', 'verified')
        extra_kwargs = {
            'username': {'read_only': True},
            'image': {'read_only': True}
        }

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username'
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['role'] = user.role
        token['bio'] = user.bio
        token['verified'] = user.verified

        return token





#Settings
class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('password', 'password2')




#Admin-app
class JobApplicationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplications
        fields = '__all__'

class StudentsEnrolmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentsEnrolments
        fields = '__all__'

class AcceptStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students
        fields = ('Email',)

    def create(self, validated_data):
        email = validated_data['Email']
        
        if not email:
            raise serializers.ValidationError({"email": "Email cannot be empty"})

        try:
            student_enrolment = StudentsEnrolments.objects.get(Email=email)
            if Students.objects.filter(Email=email).exists():
                validated_data['enrolled'] = True
                
            year = timezone.now().year
            random_digits = random.randint(1000, 9999)
            random_letter = random.choice(string.ascii_uppercase)
            RegNumber = f"M{year % 100}{random_digits}{random_letter}"
            
            

            parent, created = Parents.objects.get_or_create(
                Email=email,
                defaults={
                    'Username': str(uuid.uuid4())[:30],
                    'Name': student_enrolment.Parent_Name,
                    'Surname': student_enrolment.Parent_Surname,
                    'Email': student_enrolment.Parent_Email,
                    'Relationship': student_enrolment.Relationship,
                    'Phone_Number': student_enrolment.Parent_Phone_Number,
                    
                    
                }
            )
            student, created = Students.objects.get_or_create(
                Email=email,
                defaults={
                    'Name': student_enrolment.Name,
                    'Surname': student_enrolment.Surname,
                    'Grade_Level': student_enrolment.Grade_Level,
                    'DOB': student_enrolment.DOB,
                    'Phone_Number': student_enrolment.Phone_Number,
                    'Address': student_enrolment.Address,
                    'Gender': student_enrolment.Gender,
                    'RegNumber': RegNumber,
                    'Parent': parent, 
                }
            )
            
            
            if not created:
                student.RegNumber = RegNumber
                student.Name = student_enrolment.Name
                student.Surname = student_enrolment.Surname
                student.Grade_Level = student_enrolment.Grade_Level
                student.DOB = student_enrolment.DOB
                student.Address = student_enrolment.Address
                student.Gender = student_enrolment.Gender
                parent.Name = student_enrolment.Parent_Name
                parent.Surname = student_enrolment.Parent_Surname
                parent.Email = student_enrolment.Email
                parent.Relationship = student_enrolment.Relationship
                parent.Phone_Number = student_enrolment.Phone_Number
                student.Phone_Number = student_enrolment.Phone_Number

            student.Parent = parent
            parent.Student = student
            parent.save()
            student.save()

        except StudentsEnrolments.DoesNotExist:
            raise serializers.ValidationError(
                {"email": "Student with this email does not exist."})

        return student
    

class AcceptStaffSerializer(serializers.ModelSerializer):

    class Meta:
        model = Staff
        fields = ('Email',)
        
    def create(self, validated_data):
        email = validated_data['Email']

        try:
            staff_emplyment = JobApplications.objects.get(Email=email)
            if Staff.objects.filter(Email=email).exists():
                validated_data['enrolled'] = True
            
            username = str(uuid.uuid4())[:30]
            staff, created = Staff.objects.get_or_create(
                Email=email,
                defaults={
                    'Username': username,
                    'Name': staff_emplyment.Name,
                    'Surname': staff_emplyment.Surname,
                    'Position': staff_emplyment.pPosition,
                    'DOB': staff_emplyment.DOB,
                    'Marital_Status': staff_emplyment.Marital_Status,
                    'Gender': staff_emplyment.Gender,
                    
                }
            )
            
            if staff.Position == 'Teacher':
                teacher, created = Teachers.objects.get_or_create(
                    Username=username,
                    defaults={
                        'Username': username,
                        'Name': staff.Name,
                        'Surname': staff.Surname,
                        'gender': staff.Gender,
                        'dob': staff.DOB,
                        'email': staff.Email,
                        'phone_number': staff.Phone_Number,
                    }
                )
                
            if not created:
                staff.Name = staff_emplyment.Name
                staff.Surname = staff_emplyment.Surname
                staff.Position = staff_emplyment.pPosition
                staff.DOB = staff_emplyment.DOB
                staff.Marital_Status = staff_emplyment.Marital_Status
                staff.Gender = staff_emplyment.Gender
                staff.save()

        except JobApplications.DoesNotExist:
            raise serializers.ValidationError(
                {"email": "Staff with this email does not exist."})

        return staff
    







#Staff
class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'

    
class RegisterStaffSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Passwords dodn't match!"})
            
        password = attrs['password']
        if len(password) < 8:
            raise serializers.ValidationError(
                {"password": "Password must be at least 8 characters long."})
        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError(
                {"password": "Password must contain at least one digit."})
        if not any(char.isalpha() for char in password):
            raise serializers.ValidationError(
                {"password": "Password must contain at least one letter."})

        return attrs

    def create(self, validated_data):
        email = validated_data['email']
        first_name = validated_data['first_name']
        last_name = validated_data['last_name']
        username = validated_data['username']
        
        try:
            staff = Staff.objects.get(Email=email, Name=first_name, Surname=last_name)
            Staff.objects.filter(Email=email).update(Username=username)
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'username' : username,
                    'first_name' : staff.Name,
                    'last_name' : staff.Surname,
                    'role' : staff.Position,
                }
            )
          
        except Staff.DoesNotExist:
            raise serializers.ValidationError(
                {"email": "Staff with this email, first name and last name does not exist."})

        user.set_password(validated_data['password'])
        user.save()

        return user
       






#Parents
class ParentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parents
        fields = '__all__'

class RegisterParentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'message': 'Passwords didn\'t match!', 'error': True})
                
        password = attrs['password']
        if len(password) < 8:
            raise serializers.ValidationError({'message': 'Password must be at least 8 characters long.', 'error': True})
        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError({'message': 'Password must contain at least one digit.', 'error': True})
        if not any(char.isalpha() for char in password):
            raise serializers.ValidationError({'message': 'Password must contain at least one letter.', 'error': True})

        return attrs

    def create(self, validated_data):
        email = validated_data['email']
        first_name = validated_data['first_name']
        last_name = validated_data['last_name']
        username = validated_data['username']
        phone_number = self.initial_data.get('phone_number')
        id_number = self.initial_data.get('id_number')
        address = self.initial_data.get('address')
        occupation = self.initial_data.get('occupation')
        regnumbers = [regnumber.upper() for regnumber in self.initial_data.get('regNumbers')]
        
        try:
            parent = Parents.objects.get(Email=email, Name=first_name, Surname=last_name)
            Students.objects.filter(Parent=parent).update(Parent=username)
            
            Parents.objects.filter(Email=email).update(
                Username=username, 
                Name=first_name, 
                Surname=last_name, 
                ID_Number=id_number, 
                Phone_Number=phone_number, 
                Occupation=occupation, 
                Address=address
            )  
            
            for regnumber in regnumbers:
                student = Students.objects.get(RegNumber=regnumber)
                if student.Parent == username:
                    continue
                else:
                    raise serializers.ValidationError(f'{student.Name} {student.Surname} with regNumber {regnumber} is not your child. For more information, visit admin.')
                
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'username' : username,
                    'first_name' : parent.Name,
                    'last_name' : parent.Surname,
                    'email' : parent.Email,
                    'role' : 'Parent/Guardean'
                }
            )

        except Exception as e:
            raise serializers.ValidationError(str(e))

        user.set_password(validated_data['password'])
        user.save()

        return user

class ParentChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students
        fields = ['RegNumber', 'Name', 'Surname', 'Grade_Level', 'Email', 'Phone_Number', 'Address']

class ParentFeesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students
        fields = ['RegNumber', 'Name', 'Surname', 'Grade_Level', 'Fees']
        
        
    def get_total_fees(self, obj):
        children = Students.objects.filter(Parent=obj)
        total_fees = sum(child.Fees for child in children)
        return total_fees

class ParentChildDetailsSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Parents
        fields = ['Username', 'Name', 'Surname', 'Email', 'children']

    def get_children(self, obj):
        parent_username = self.context['request'].user.username
        children = Students.objects.filter(Parent__Username=parent_username)
        return ParentChildSerializer(children, many=True).data





#Teachers
class TeachersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teachers
        fields = '__all__'
        
        


 
 
 
#Students
class StudentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students
        fields = '__all__'
        
class RegisterStudentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Passwords dodn't match!"})
            
        password = attrs['password']
        if len(password) < 8:
            raise serializers.ValidationError(
                {"password": "Password must be at least 8 characters long."})
        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError(
                {"password": "Password must contain at least one digit."})
        if not any(char.isalpha() for char in password):
            raise serializers.ValidationError(
                {"password": "Password must contain at least one letter."})

        return attrs

    def create(self, validated_data):
        email = validated_data['email']
        first_name = validated_data['first_name']
        last_name = validated_data['last_name']
        username = validated_data['username']
        
        try:
            student = Students.objects.get(RegNumber=username, Email=email, Name=first_name, Surname=last_name)
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'username' : student.RegNumber,
                    'first_name' : student.Name,
                    'last_name' : student.Surname,
                    'email' : student.Email,
                    'role' : 'Student'

                }
            )
        except Students.DoesNotExist:
            raise serializers.ValidationError(
                {"email": "Student Doesn't Exist Please Check your details"})

        user.set_password(validated_data['password'])
        user.save()

        return user
    




@receiver(post_save, sender=Staff)
def update_user(sender, instance, **kwargs):
    try:
        user = User.objects.get(username=instance.Username)
    except User.DoesNotExist:
        return

    user.first_name = instance.Name
    user.last_name = instance.Surname
    user.email = instance.Email
    user.role = instance.Position
    user.save()
    
@receiver(post_save, sender=Students)
def update_user(sender, instance, **kwargs):
    try:
        user = User.objects.get(username=instance.RegNumber)
    except User.DoesNotExist:
        return

    user.first_name = instance.Name
    user.last_name = instance.Surname
    user.email = instance.Email
    user.save()

@receiver(post_save, sender=Parents)
def update_user(sender, instance, **kwargs):
    try:
        user = User.objects.get(username=instance.Username)
    except User.DoesNotExist:
        return

    user.first_name = instance.Name
    user.last_name = instance.Surname
    user.email = instance.Email
    user.save()
 