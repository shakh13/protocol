# Generated by Django 5.1.3 on 2025-04-19 11:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_protocol_building_protocol_client_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='building',
            name='name',
            field=models.CharField(max_length=500),
        ),
    ]
