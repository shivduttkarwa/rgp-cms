from django.db import models

from wagtail.models import Page
from wagtail.fields import RichTextField
from wagtail.api import APIField
from wagtail.admin.panels import FieldPanel


class HomePage(Page):
    intro = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("intro"),
    ]

    api_fields = [
        APIField("intro"),
    ]