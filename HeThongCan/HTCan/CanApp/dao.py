from django.db.models import Count
from .models import PhieuCan, ThongTinCan, User


def count_PhieuCan_by_Can():
    counts = ThongTinCan.objects.annotate(phieucan_count=Count('phieucan'))
    return counts


def activate_or_lock_user(user_id, action):
    try:
        user = User.objects.get(id=user_id)

        user.state = action
        user.save()

        return True
    except user.DoesNotExist:
        return False