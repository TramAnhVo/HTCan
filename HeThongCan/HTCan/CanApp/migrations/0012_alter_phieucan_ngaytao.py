# Generated by Django 5.0.4 on 2024-05-15 03:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CanApp', '0011_alter_phieucan_options_alter_phieucan_ngaytao'),
    ]

    operations = [
        migrations.AlterField(
            model_name='phieucan',
            name='NgayTao',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
