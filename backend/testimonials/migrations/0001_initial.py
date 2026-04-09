import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("wagtailimages", "0026_delete_uploadedimage"),
    ]

    operations = [
        migrations.CreateModel(
            name="Testimonial",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("testimonial_type", models.CharField(
                    choices=[("video", "Video Testimonial"), ("featured", "Featured (Split Slider)"), ("text", "Text Testimonial")],
                    default="text", max_length=20,
                )),
                ("name",     models.CharField(max_length=255)),
                ("role",     models.CharField(blank=True, max_length=100)),
                ("location", models.CharField(blank=True, max_length=255)),
                ("company",  models.CharField(blank=True, max_length=100)),
                ("content",  models.TextField(blank=True)),
                ("rating",   models.PositiveSmallIntegerField(
                    choices=[(1, "1"), (2, "2"), (3, "3"), (4, "4"), (5, "5")],
                    default=5,
                )),
                ("theme", models.CharField(
                    blank=True, default="theme-1", max_length=20,
                    choices=[(f"theme-{i}", f"Theme {i}") for i in range(1, 11)],
                )),
                ("suburb",           models.CharField(blank=True, max_length=100)),
                ("transaction_type", models.CharField(
                    blank=True, max_length=20,
                    choices=[("SOLD", "Sold"), ("PURCHASED", "Purchased"), ("APPRAISAL", "Appraisal"), ("LEASED", "Leased")],
                )),
                ("video_url", models.CharField(blank=True, max_length=500)),
                ("tint_var",  models.CharField(
                    blank=True, default="gold", max_length=20,
                    choices=[("gold", "Gold"), ("amber", "Amber"), ("crimson", "Crimson")],
                )),
                ("avatar", models.ForeignKey(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name="+", to="wagtailimages.image",
                )),
                ("featured_image", models.ForeignKey(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name="+", to="wagtailimages.image",
                )),
                ("poster", models.ForeignKey(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name="+", to="wagtailimages.image",
                )),
            ],
            options={
                "verbose_name": "Testimonial",
                "verbose_name_plural": "Testimonials",
                "ordering": ["-id"],
            },
        ),
    ]
