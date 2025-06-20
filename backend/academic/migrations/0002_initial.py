# Generated by Django 5.2.1 on 2025-05-30 16:42

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('academic', '0001_initial'),
        ('core', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='classsubject',
            name='class_assigned',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.class'),
        ),
        migrations.AddField(
            model_name='classsubject',
            name='section',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.section'),
        ),
        migrations.AddField(
            model_name='classsubject',
            name='subject',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.subject'),
        ),
        migrations.AddField(
            model_name='classsubject',
            name='teacher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.teacherprofile'),
        ),
        migrations.AddField(
            model_name='exam',
            name='class_assigned',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.class'),
        ),
        migrations.AddField(
            model_name='exam',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='exam',
            name='section',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.section'),
        ),
        migrations.AddField(
            model_name='exam',
            name='subject',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.subject'),
        ),
        migrations.AddField(
            model_name='exam',
            name='exam_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='academic.examtype'),
        ),
        migrations.AddField(
            model_name='mark',
            name='exam',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='academic.exam'),
        ),
        migrations.AddField(
            model_name='mark',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.studentprofile'),
        ),
        migrations.AddField(
            model_name='mark',
            name='teacher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.teacherprofile'),
        ),
        migrations.AlterUniqueTogether(
            name='classsubject',
            unique_together={('class_assigned', 'section', 'subject', 'academic_year')},
        ),
        migrations.AlterUniqueTogether(
            name='mark',
            unique_together={('student', 'exam')},
        ),
    ]
