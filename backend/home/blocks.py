from wagtail.blocks import (
    StructBlock, CharBlock, TextBlock, StreamBlock,
    ListBlock, ChoiceBlock,
)
from wagtail.images.blocks import ImageChooserBlock as BaseImageChooserBlock
from wagtail.snippets.blocks import SnippetChooserBlock


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


def serialize_listing_card(listing):
    if not listing:
        return None
    return {
        "id": listing.id,
        "title": listing.title,
        "slug": listing.slug,
        "meta": {"slug": listing.slug},
        "category": listing.category,
        "location": listing.location,
        "price": listing.price,
        "sold_price": listing.sold_price,
        "card_image": (
            {
                "url": listing.card_image.file.url,
            }
            if listing.card_image
            else None
        ),
        "beds": listing.beds,
        "baths": listing.baths,
        "sqft": listing.sqft,
        "garage": listing.garage,
        "badge": listing.badge,
        "is_new": listing.is_new,
        "views": listing.views,
        "sold_date": listing.sold_date,
        "days_on_market": listing.days_on_market,
        "deposit": listing.deposit,
        "min_lease": listing.min_lease,
        "card_features": listing.card_features,
        "has_detail_page": listing.has_detail_page,
    }


class ListingChooserBlock(SnippetChooserBlock):
    def __init__(self, **kwargs):
        super().__init__("listings.Listing", **kwargs)

    def get_api_representation(self, value, context=None):
        return serialize_listing_card(value)


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


class ServiceItemBlock(StructBlock):
    id = ChoiceBlock(
        choices=[
            ("buy", "Buy"),
            ("sell", "Sell"),
            ("rent", "Rent"),
        ],
        default="buy",
    )
    label = CharBlock(
        max_length=40,
        required=False,
        help_text="Large card title. Leave blank to use Buy / Sell / Rent automatically.",
    )
    description = TextBlock()
    cta_label = CharBlock(max_length=60)
    cta_url = CharBlock(max_length=255, default="/contact")

    class Meta:
        icon = "pick"
        label = "Service Card"


class ServiceHeaderBlock(StructBlock):
    eyebrow = CharBlock(max_length=80, default="How Can We Help You?")
    title_prefix = CharBlock(max_length=120, default="What Are You")
    title_highlight = CharBlock(max_length=120, default="Looking For?")
    subtitle = TextBlock(default="Whether you're buying, selling, or renting — we're here to make your real estate journey seamless and rewarding.")

    class Meta:
        icon = "title"
        label = "Section Header"


class ServiceTrustStatBlock(StructBlock):
    value = CharBlock(max_length=30)
    label = CharBlock(max_length=60)

    class Meta:
        icon = "snippet"
        label = "Trust Stat"


class ServiceCtaBlock(StructBlock):
    eyebrow = CharBlock(max_length=80, default="Need Guidance?")
    title_prefix = CharBlock(max_length=120, default="Not Sure Where to")
    title_highlight = CharBlock(max_length=120, default="Start?")
    text = TextBlock(default="Our experienced advisors are here to understand your needs and guide you through every step of your real estate journey.")
    primary_label = CharBlock(max_length=60, default="Talk to an Expert")
    primary_href = CharBlock(max_length=255, default="/contact")
    secondary_label = CharBlock(max_length=60, default="0450 009 291")
    secondary_href = CharBlock(max_length=255, default="tel:+61450009291")
    trust_stats = ListBlock(ServiceTrustStatBlock(), min_num=0, max_num=3, required=False)

    class Meta:
        icon = "link"
        label = "Bottom CTA"


class ServiceSectionBlock(StructBlock):
    header = ServiceHeaderBlock()
    services = ListBlock(ServiceItemBlock(), min_num=1, max_num=3)
    cta = ServiceCtaBlock()

    class Meta:
        icon = "list-ul"
        label = "Service Selection Section"
        template = None


class ListingSectionBlock(StructBlock):
    # ── Header ─────────────────────────────────────────
    badge_label  = CharBlock(max_length=60,  default="Prime Listings")
    headline     = CharBlock(max_length=120, default="Discover Your Dream Home")
    subtitle     = TextBlock(default="Explore our handpicked collection of premium properties designed for modern living")

    # ── Filters ────────────────────────────────────────
    all_tab_label = CharBlock(max_length=20, default="All")
    filter_tabs   = ListBlock(FilterTabBlock(), min_num=1, max_num=3)
    selected_listings = ListBlock(
        ListingChooserBlock(),
        required=False,
        help_text="Only the listings added here will appear in this section.",
    )

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
