# Generated by Django 5.1.3 on 2025-05-23 15:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_alter_protocol_language'),
    ]

    operations = [
        migrations.AddField(
            model_name='protocol',
            name='building_protocol_number',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
