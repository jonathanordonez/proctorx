from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six

class StudentPasswordTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            six.text_type(user.pk) + six.text_type(timestamp) +
            six.text_type(user.password) + six.text_type(user.last_login)
        )


class StudentActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            six.text_type(user.pk) + six.text_type(timestamp) +
            six.text_type(user.is_active)
        )


password_reset_token = StudentPasswordTokenGenerator()
account_activation_token = StudentActivationTokenGenerator()
