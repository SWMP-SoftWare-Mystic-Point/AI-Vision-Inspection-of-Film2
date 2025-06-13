# Generated by Django 5.2 on 2025-04-28 08:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('order', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Production',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('manufacture_date', models.DateTimeField(auto_now_add=True)),
                ('manufacturer', models.CharField(default=None, max_length=100)),
                ('factory', models.CharField(default=None, max_length=100)),
                ('film', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='productions', to='order.film')),
            ],
        ),
    ]
