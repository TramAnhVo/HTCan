# Generated by Django 5.0.4 on 2024-06-06 07:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CanApp', '0017_rename_company_user_company'),
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Custcode', models.CharField(max_length=255)),
                ('Custname', models.CharField(max_length=255)),
                ('CreatDay', models.DateTimeField(auto_now_add=True, null=True)),
                ('State', models.BooleanField(default=True)),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ProdCode', models.CharField(max_length=255)),
                ('Prodname', models.CharField(max_length=255)),
                ('CreatDay', models.DateTimeField(auto_now_add=True, null=True)),
                ('State', models.BooleanField(default=True)),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='Weight',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Ticketnum', models.IntegerField()),
                ('Docnum', models.IntegerField()),
                ('Truckno', models.CharField(max_length=255)),
                ('Date_in', models.DateField(auto_now_add=True)),
                ('Date_out', models.DateField(auto_now_add=True)),
                ('Firstweight', models.IntegerField()),
                ('Secondweight', models.IntegerField()),
                ('Netweight', models.IntegerField()),
                ('Note', models.CharField(max_length=255)),
                ('Trantype', models.CharField(max_length=255)),
                ('time_in', models.TimeField(auto_now_add=True)),
                ('time_out', models.TimeField(auto_now_add=True)),
                ('date_time', models.DateTimeField(auto_now_add=True, null=True)),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
    ]
