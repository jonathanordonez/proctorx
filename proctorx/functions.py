from models import Student, Session

def create_user(first_name, last_name, email_address, country, city, state, time_zone, postal_code, phone_number, street_address):
    Student.objects.create(
        first_name = first_name, last_name = last_name, email_address = email_address, country = country, city = city, state = state,
        time_zone = time_zone, postal_code = postal_code, phone_number = phone_number, street_address = street_address,
    )

def create_session(student, date_purchased, exam_date, university, exam_name, session_status, cost, payment_status):
    # Find student 
    student_key = Student.objects.filter()

    # Create student record
    Session.objects.create(
        student = student_key, date_purchased = date_purchased, exam_date = exam_date, university = university, exam_name = exam_name,
        session_status = session_status, cost = cost, payment_status = payment_status,
    )
