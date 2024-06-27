from django.db.models import Count
from .models import User


def activate_or_lock_user(user_id, action):
    try:
        user = User.objects.get(id=user_id)

        user.state = action
        user.save()

        return True
    except user.DoesNotExist:
        return False