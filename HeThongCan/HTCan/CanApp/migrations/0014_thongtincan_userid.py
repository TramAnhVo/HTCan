# Generated by Django 5.0.4 on 2024-05-24 02:19

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CanApp', '0013_alter_phieucan_tlhang'),
    ]

    operations = [
        migrations.AddField(
            model_name='thongtincan',
            name='UserId',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
