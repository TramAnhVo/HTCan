# Generated by Django 5.0.4 on 2024-05-14 09:05

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CanApp', '0010_rename_tencan_phieucan_canid'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='phieucan',
            options={'ordering': ['-id']},
        ),
        migrations.AlterField(
            model_name='phieucan',
            name='NgayTao',
            field=models.DateTimeField(default=django.utils.timezone.now, null=True),
        ),
    ]
