from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.api import APIField
from wagtail.admin.panels import FieldPanel

from .blocks import HeroBlock, IntroBlock, ListingSectionBlock, EoiCtaBlock


class HomePage(Page):
    body = StreamField(
        [
            ("hero", HeroBlock()),
            ("intro", IntroBlock()),
            ("listing_section", ListingSectionBlock()),
            ("eoi_cta", EoiCtaBlock()),
        ],
        blank=True,
        use_json_field=True,
    )

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]

    api_fields = [
        APIField("body"),
    ]
