from django.db import models
from wagtail.models import Orderable
from wagtail.fields import RichTextField
from wagtail.admin.panels import (
    FieldPanel, FieldRowPanel, MultiFieldPanel, InlinePanel,
)
from wagtail.images.api.fields import ImageRenditionField
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel


# ── Choices ───────────────────────────────────────────────────────────────────

CATEGORY_CHOICES = [
    ("for-sale", "For Sale"),
    ("sold", "Sold"),
    ("for-rent", "For Rent"),
]

STATUS_CHOICES = [
    ("For Sale", "For Sale"),
    ("For Rent", "For Rent"),
    ("Sold", "Sold"),
    ("Pending", "Pending"),
]

FEATURE_ICON_CHOICES = [
    ("smart-home", "Smart Home"),
    ("kitchen", "Kitchen"),
    ("ocean", "Ocean"),
    ("wine", "Wine Cellar"),
    ("pool", "Pool"),
    ("dock", "Dock"),
    ("theater", "Theater"),
    ("gym", "Gym"),
    ("security", "Security"),
    ("garden", "Garden"),
    ("spa", "Spa"),
    ("garage", "Garage"),
]

NEARBY_TYPE_CHOICES = [
    ("shopping", "Shopping"),
    ("airport", "Airport"),
    ("dining", "Dining"),
    ("golf", "Golf"),
    ("beach", "Beach"),
    ("school", "School"),
    ("hospital", "Hospital"),
]

STAT_ICON_CHOICES = [
    ("bed", "Bed"),
    ("bath", "Bath"),
    ("area", "Area"),
    ("garage", "Garage"),
    ("year", "Year"),
    ("lot", "Lot"),
]


# ── Orderable children ────────────────────────────────────────────────────────

class ListingImage(Orderable):
    listing = ParentalKey("listings.Listing", related_name="gallery_images", on_delete=models.CASCADE)
    image = models.ForeignKey("wagtailimages.Image", on_delete=models.CASCADE, related_name="+")
    alt = models.CharField(max_length=255, blank=True)
    panels = [FieldPanel("image"), FieldPanel("alt")]


class ListingFeature(Orderable):
    listing = ParentalKey("listings.Listing", related_name="detail_features", on_delete=models.CASCADE)
    icon = models.CharField(max_length=20, choices=FEATURE_ICON_CHOICES, default="smart-home")
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    panels = [FieldRowPanel([FieldPanel("icon"), FieldPanel("title")]), FieldPanel("description")]


class ListingDetail(Orderable):
    listing = ParentalKey("listings.Listing", related_name="detail_rows", on_delete=models.CASCADE)
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=255)
    panels = [FieldRowPanel([FieldPanel("label"), FieldPanel("value")])]


class ListingStat(Orderable):
    listing = ParentalKey("listings.Listing", related_name="detail_stats", on_delete=models.CASCADE)
    icon = models.CharField(max_length=20, choices=STAT_ICON_CHOICES, default="bed")
    value = models.CharField(max_length=50)
    label = models.CharField(max_length=50)
    panels = [FieldRowPanel([FieldPanel("icon"), FieldPanel("value"), FieldPanel("label")])]


class ListingNearby(Orderable):
    listing = ParentalKey("listings.Listing", related_name="nearby_locations", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    distance = models.CharField(max_length=50)
    type = models.CharField(max_length=20, choices=NEARBY_TYPE_CHOICES, default="shopping")
    panels = [FieldRowPanel([FieldPanel("name"), FieldPanel("distance"), FieldPanel("type")])]


# ── Main snippet ──────────────────────────────────────────────────────────────

class Listing(ClusterableModel):
    """A property listing — managed as a Snippet (no page hierarchy needed)."""

    # ── Card fields ───────────────────────────────────────────────
    title          = models.CharField(max_length=255)
    slug           = models.SlugField(max_length=255, unique=True)
    category       = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="for-sale")
    location       = models.CharField(max_length=255)
    price          = models.PositiveIntegerField(default=0, help_text="0 = Contact Agent")
    sold_price     = models.PositiveIntegerField(null=True, blank=True)
    card_image     = models.ForeignKey(
        "wagtailimages.Image", null=True, blank=True,
        on_delete=models.SET_NULL, related_name="+",
    )
    beds           = models.PositiveSmallIntegerField(default=0)
    baths          = models.PositiveSmallIntegerField(default=0)
    sqft           = models.PositiveIntegerField(default=0)
    garage         = models.PositiveSmallIntegerField(default=0)
    badge          = models.CharField(max_length=60, blank=True)
    is_new         = models.BooleanField(default=False)
    views          = models.PositiveIntegerField(default=0)
    sold_date      = models.CharField(max_length=60, blank=True)
    days_on_market = models.PositiveSmallIntegerField(null=True, blank=True)
    deposit        = models.PositiveIntegerField(null=True, blank=True)
    min_lease      = models.CharField(max_length=60, blank=True)
    card_features  = models.CharField(
        max_length=500, blank=True,
        help_text="Comma-separated e.g. Pool, Solar Panels, Double Garage",
    )

    # ── Detail fields (optional) ──────────────────────────────────
    has_detail_page = models.BooleanField(default=False, help_text="Enable the full detail view")
    address         = models.CharField(max_length=255, blank=True)
    city            = models.CharField(max_length=100, blank=True)
    state           = models.CharField(max_length=100, blank=True)
    zip_code        = models.CharField(max_length=20, blank=True)
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, blank=True)
    price_label     = models.CharField(max_length=60, blank=True)
    featured        = models.BooleanField(default=False)
    overview        = RichTextField(blank=True)
    map_embed_url   = models.URLField(blank=True)
    video_tour_url  = models.URLField(blank=True)
    video_thumbnail = models.ForeignKey(
        "wagtailimages.Image", null=True, blank=True,
        on_delete=models.SET_NULL, related_name="+",
    )
    agent_name         = models.CharField(max_length=100, blank=True)
    agent_title        = models.CharField(max_length=100, blank=True)
    agent_image        = models.ForeignKey(
        "wagtailimages.Image", null=True, blank=True,
        on_delete=models.SET_NULL, related_name="+",
    )
    agent_phone        = models.CharField(max_length=30, blank=True)
    agent_email        = models.EmailField(blank=True)
    agent_rating       = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    agent_review_count = models.PositiveSmallIntegerField(default=0)

    panels = [
        MultiFieldPanel([
            FieldRowPanel([FieldPanel("title"), FieldPanel("slug")]),
            FieldRowPanel([FieldPanel("category"), FieldPanel("badge")]),
            FieldPanel("location"),
            FieldRowPanel([FieldPanel("price"), FieldPanel("sold_price")]),
            FieldPanel("card_image"),
            FieldRowPanel([FieldPanel("beds"), FieldPanel("baths"), FieldPanel("sqft"), FieldPanel("garage")]),
            FieldPanel("card_features"),
            FieldRowPanel([FieldPanel("is_new"), FieldPanel("views")]),
            FieldRowPanel([FieldPanel("sold_date"), FieldPanel("days_on_market")]),
            FieldRowPanel([FieldPanel("deposit"), FieldPanel("min_lease")]),
        ], heading="Property Card"),

        MultiFieldPanel([
            FieldPanel("has_detail_page"),
            FieldRowPanel([FieldPanel("address"), FieldPanel("city")]),
            FieldRowPanel([FieldPanel("state"), FieldPanel("zip_code")]),
            FieldRowPanel([FieldPanel("status"), FieldPanel("price_label")]),
            FieldPanel("featured"),
            FieldPanel("overview"),
            FieldPanel("map_embed_url"),
            FieldRowPanel([FieldPanel("video_tour_url"), FieldPanel("video_thumbnail")]),
        ], heading="Detail Page — General"),

        MultiFieldPanel([
            FieldPanel("agent_name"),
            FieldPanel("agent_title"),
            FieldPanel("agent_image"),
            FieldRowPanel([FieldPanel("agent_phone"), FieldPanel("agent_email")]),
            FieldRowPanel([FieldPanel("agent_rating"), FieldPanel("agent_review_count")]),
        ], heading="Detail Page — Agent"),

        InlinePanel("gallery_images",   label="Gallery Images"),
        InlinePanel("detail_stats",     label="Detail Stats"),
        InlinePanel("detail_features",  label="Detail Features"),
        InlinePanel("detail_rows",      label="Detail Key-Value Rows"),
        InlinePanel("nearby_locations", label="Nearby Locations"),
    ]

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Listing"
        verbose_name_plural = "Listings"
        ordering = ["-id"]
