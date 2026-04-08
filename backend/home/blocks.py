from wagtail.blocks import (
    StructBlock, CharBlock, TextBlock, StreamBlock,
    ListBlock, ChoiceBlock,
)
from wagtail.images.blocks import ImageChooserBlock as BaseImageChooserBlock


# ── Helpers ──────────────────────────────────────────────────────────────────

class ImageChooserBlock(BaseImageChooserBlock):
    """Returns a plain dict with url/width/height/alt for the API."""

    def get_api_representation(self, value, context=None):
        if not value:
            return None
        return {
            "url": value.file.url,
            "width": value.width,
            "height": value.height,
            "alt": value.title,
        }


# ── CTA variants ─────────────────────────────────────────────────────────────

class SingleCTABlock(StructBlock):
    label = CharBlock(max_length=60)
    url = CharBlock(max_length=255)

    class Meta:
        icon = "link"
        label = "Single CTA Button"


class PanelButtonBlock(StructBlock):
    label = CharBlock(max_length=30)
    url = CharBlock(max_length=255)


class PanelButtonsBlock(StructBlock):
    btn1 = PanelButtonBlock(label="Button 1")
    btn2 = PanelButtonBlock(label="Button 2")
    btn3 = PanelButtonBlock(label="Button 3")
    btn4 = PanelButtonBlock(label="Button 4")

    class Meta:
        icon = "list-ul"
        label = "4-Button Panel"


class HeroCTABlock(StreamBlock):
    """Editor picks ONE of: a single CTA button or a 4-button panel."""
    single_cta = SingleCTABlock()
    panel_buttons = PanelButtonsBlock()

    class Meta:
        max_num = 1
        min_num = 0
        required = False
        label = "CTA (choose one)"


# ── Section blocks ────────────────────────────────────────────────────────────

class HeroBlock(StructBlock):
    title_line1 = CharBlock(max_length=100)
    title_line1_highlight = CharBlock(
        max_length=50, required=False,
        help_text="Word in line 1 to render in gold",
    )
    title_line2 = CharBlock(max_length=100, required=False)
    title_line2_highlight = CharBlock(
        max_length=50, required=False,
        help_text="Word in line 2 to render in amber",
    )
    subtitle = TextBlock(required=False)
    bg_image = ImageChooserBlock(required=False, label="Background image / poster")
    bg_video_url = CharBlock(
        max_length=255, required=False,
        help_text="Local path (vids/hero.mp4) or Vimeo URL",
    )
    cta = HeroCTABlock()

    class Meta:
        icon = "image"
        label = "Hero Section"
        template = None  # headless — no Django template needed


class FilterTabBlock(StructBlock):
    category = ChoiceBlock(choices=[
        ("for-sale", "For Sale"),
        ("sold", "Sold"),
        ("for-rent", "For Rent"),
    ])
    label = CharBlock(max_length=30)

    class Meta:
        icon = "tag"
        label = "Filter Tab"


class ListingSectionBlock(StructBlock):
    # ── Header ─────────────────────────────────────────
    badge_label  = CharBlock(max_length=60,  default="Prime Listings")
    headline     = CharBlock(max_length=120, default="Discover Your Dream Home")
    subtitle     = TextBlock(default="Explore our handpicked collection of premium properties designed for modern living")

    # ── Filters ────────────────────────────────────────
    all_tab_label = CharBlock(max_length=20, default="All")
    filter_tabs   = ListBlock(FilterTabBlock(), min_num=1, max_num=3)

    # ── View-all link ──────────────────────────────────
    view_all_label = CharBlock(max_length=60,  default="View All Properties")
    view_all_url   = CharBlock(max_length=255, default="/properties")

    class Meta:
        icon = "list-ul"
        label = "Property Listing Section"
        template = None


class EoiCtaBlock(StructBlock):
    badge        = CharBlock(max_length=80,  default="Expression of Interest")
    title        = CharBlock(max_length=160, default="Ready to make an offer on a property you love?")
    text         = TextBlock(default="Complete our full Expression of Interest form with the exact buyer, offer, condition, and solicitor details needed for a clean review.")
    button_label = CharBlock(max_length=60,  default="Open the Form")
    button_url   = CharBlock(max_length=255, default="/expressions-of-interest")

    class Meta:
        icon = "pick"
        label = "EOI CTA Bar"
        template = None


class IntroBlock(StructBlock):
    label = CharBlock(max_length=100, default="About the Founder")
    headline1 = CharBlock(max_length=100)
    headline2 = CharBlock(max_length=100, required=False)
    founder_name = CharBlock(max_length=100, required=False)
    text = TextBlock()
    cta1_label = CharBlock(max_length=60)
    cta1_url = CharBlock(max_length=255)
    cta2_label = CharBlock(max_length=60, required=False)
    cta2_url = CharBlock(max_length=255, required=False)
    image = ImageChooserBlock(required=False)

    class Meta:
        icon = "user"
        label = "Intro / Founder Section"
        template = None
