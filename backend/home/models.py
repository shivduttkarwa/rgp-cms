from django.db import models

from wagtail.models import Page
from wagtail.api import APIField
from wagtail.admin.panels import FieldPanel, FieldRowPanel, MultiFieldPanel
from wagtail.images.api.fields import ImageRenditionField


class HomePage(Page):
    # ── Hero fields ──────────────────────────────────────────────
    hero_title_line1 = models.CharField(max_length=100, default="Your Dream Home")
    hero_title_line1_highlight = models.CharField(
        max_length=50, blank=True, default="Dream",
        help_text="Word in line 1 to render in gold",
    )
    hero_title_line2 = models.CharField(max_length=100, default="Perfectly Delivered")
    hero_title_line2_highlight = models.CharField(
        max_length=50, blank=True, default="Perfectly",
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
        "wagtailimages.Image", null=True, blank=True,
        on_delete=models.SET_NULL, related_name="+",
        help_text="Background image / video poster",
    )
    hero_bg_video_url = models.CharField(
        max_length=255, blank=True, default="vids/hero-rgp.mp4",
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

    # ── Intro Section ────────────────────────────────────────────
    intro_label        = models.CharField(max_length=100, default="About the Founder")
    intro_headline1    = models.CharField(max_length=100, default="Building Wealth")
    intro_headline2    = models.CharField(max_length=100, default="Through Property,")
    intro_founder_name = models.CharField(max_length=100, default="— Rahul Singh")
    intro_text         = models.TextField(
        default=(
            "Real Gold Properties is a vision turned reality — a private equity "
            "approach to multi-family real estate. Founded by Rahul Singh, we focus "
            "on disciplined acquisitions that deliver consistent returns."
        )
    )
    intro_cta1_label = models.CharField(max_length=60, default="Book a Free Appraisal")
    intro_cta1_url   = models.CharField(max_length=255, default="/contact")
    intro_cta2_label = models.CharField(max_length=60, default="Meet Rahul")
    intro_cta2_url   = models.CharField(max_length=255, default="/about")
    intro_image      = models.ForeignKey(
        "wagtailimages.Image", null=True, blank=True,
        on_delete=models.SET_NULL, related_name="+",
        help_text="Founder / intro portrait",
    )

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
        MultiFieldPanel(
            [
                FieldPanel("intro_label"),
                FieldRowPanel([
                    FieldPanel("intro_headline1"),
                    FieldPanel("intro_headline2"),
                ]),
                FieldPanel("intro_founder_name"),
                FieldPanel("intro_text"),
                FieldRowPanel([FieldPanel("intro_cta1_label"), FieldPanel("intro_cta1_url")]),
                FieldRowPanel([FieldPanel("intro_cta2_label"), FieldPanel("intro_cta2_url")]),
                FieldPanel("intro_image"),
            ],
            heading="Intro Section",
        ),
    ]

    api_fields = [
        # Hero
        APIField("hero_title_line1"),
        APIField("hero_title_line1_highlight"),
        APIField("hero_title_line2"),
        APIField("hero_title_line2_highlight"),
        APIField("hero_subtitle"),
        APIField("hero_bg_image", serializer=ImageRenditionField("original")),
        APIField("hero_bg_video_url"),
        APIField("hero_btn1_label"), APIField("hero_btn1_url"),
        APIField("hero_btn2_label"), APIField("hero_btn2_url"),
        APIField("hero_btn3_label"), APIField("hero_btn3_url"),
        APIField("hero_btn4_label"), APIField("hero_btn4_url"),
        # Intro
        APIField("intro_label"),
        APIField("intro_headline1"),
        APIField("intro_headline2"),
        APIField("intro_founder_name"),
        APIField("intro_text"),
        APIField("intro_cta1_label"), APIField("intro_cta1_url"),
        APIField("intro_cta2_label"), APIField("intro_cta2_url"),
        APIField("intro_image", serializer=ImageRenditionField("original")),
    ]
