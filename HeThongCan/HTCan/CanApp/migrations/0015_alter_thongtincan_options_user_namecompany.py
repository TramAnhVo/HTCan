# Generated by Django 5.0.4 on 2024-05-25 02:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CanApp', '0014_thongtincan_userid'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='thongtincan',
            options={'ordering': ['-id']},
        ),
        migrations.AddField(
            model_name='user',
            name='NameCompany',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
