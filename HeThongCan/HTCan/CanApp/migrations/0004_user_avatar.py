# Generated by Django 5.0.4 on 2024-04-24 09:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CanApp', '0003_phieucan_tencan'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
