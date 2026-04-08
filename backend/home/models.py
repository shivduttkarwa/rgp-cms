from django.db import models

from wagtail.models import Page
from wagtail.api import APIField
from wagtail.admin.panels import FieldPanel, FieldRowPanel, MultiFieldPanel
from wagtail.images.api.fields import ImageRenditionField


class HomePage(Page):
    # ── Hero fields ──────────────────────────────────────────────
    hero_title_line1 = models.CharField(
        max_length=100,
        default="Your Dream Home",
    )
    hero_title_line1_highlight = models.CharField(
        max_length=50,
        blank=True,
        default="Dream",
        help_text="Word in line 1 to render in gold",
    )
    hero_title_line2 = models.CharField(
        max_length=100,
        default="Perfectly Delivered",
    )
    hero_title_line2_highlight = models.CharField(
        max_length=50,
        blank=True,
        default="Perfectly",
        help_text="Word in line 2 to render in amber",
    )
    hero_subtitle = models.TextField(
        blank=True,
        default=(
            "350+ premium properties delivered — luxury villas, penthouses "
            "& exclusive estates crafted for those who demand the extraordinary."
        ),
    )
    hero_bg_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Background image / video poster",
    )
    hero_bg_video_url = models.CharField(
        max_length=255,
        blank=True,
        default="vids/hero-rgp.mp4",
        help_text="Path relative to public/ folder, or a full https:// URL",
    )

    # ── Hero panel buttons (Buy / Rent / Sold / Agent) ───────────
    hero_btn1_label = models.CharField(max_length=30, default="Buy")
    hero_btn1_url   = models.CharField(max_length=255, default="/properties?cat=for-sale")
    hero_btn2_label = models.CharField(max_length=30, default="Rent")
    hero_btn2_url   = models.CharField(max_length=255, default="/properties?cat=for-rent")
    hero_btn3_label = models.CharField(max_length=30, default="Sold")
    hero_btn3_url   = models.CharField(max_length=255, default="/properties?cat=sold")
    hero_btn4_label = models.CharField(max_length=30, default="Agent")
    hero_btn4_url   = models.CharField(max_length=255, default="/team")

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldRowPanel([
                    FieldPanel("hero_title_line1"),
                    FieldPanel("hero_title_line1_highlight"),
                ]),
                FieldRowPanel([
                    FieldPanel("hero_title_line2"),
                    FieldPanel("hero_title_line2_highlight"),
                ]),
                FieldPanel("hero_subtitle"),
                FieldPanel("hero_bg_image"),
                FieldPanel("hero_bg_video_url"),
            ],
            heading="Hero Section",
        ),
        MultiFieldPanel(
            [
                FieldRowPanel([FieldPanel("hero_btn1_label"), FieldPanel("hero_btn1_url")]),
                FieldRowPanel([FieldPanel("hero_btn2_label"), FieldPanel("hero_btn2_url")]),
                FieldRowPanel([FieldPanel("hero_btn3_label"), FieldPanel("hero_btn3_url")]),
                FieldRowPanel([FieldPanel("hero_btn4_label"), FieldPanel("hero_btn4_url")]),
            ],
            heading="Hero Panel Buttons",
        ),
    ]

    api_fields = [
        APIField("hero_title_line1"),
        APIField("hero_title_line1_highlight"),
        APIField("hero_title_line2"),
        APIField("hero_title_line2_highlight"),
        APIField("hero_subtitle"),
        APIField("hero_bg_image", serializer=ImageRenditionField("original")),
        APIField("hero_bg_video_url"),
        APIField("hero_btn1_label"),
        APIField("hero_btn1_url"),
        APIField("hero_btn2_label"),
        APIField("hero_btn2_url"),
        APIField("hero_btn3_label"),
        APIField("hero_btn3_url"),
        APIField("hero_btn4_label"),
        APIField("hero_btn4_url"),
    ]
