# Generated by Django 5.1.3 on 2025-05-13 10:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_remove_building_address_remove_client_address_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='protocol',
            name='language',
            field=models.CharField(blank=True, choices=[('ru', 'Русский'), ('en', 'Английский')], default='ru', max_length=2),
        ),
    ]
