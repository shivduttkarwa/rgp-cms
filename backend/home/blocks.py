from wagtail.blocks import (
    StructBlock, CharBlock, TextBlock, StreamBlock,
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
