from django.db import models
from wagtail.admin.panels import FieldPanel, FieldRowPanel, MultiFieldPanel
from modelcluster.models import ClusterableModel


# ── Choices ───────────────────────────────────────────────────────────────────

TESTIMONIAL_TYPE_CHOICES = [
    ("video",    "Video Testimonial"),
    ("featured", "Featured (Split Slider)"),
    ("text",     "Text Testimonial"),
]

TINT_CHOICES = [
    ("gold",    "Gold"),
    ("amber",   "Amber"),
    ("crimson", "Crimson"),
]

THEME_CHOICES = [(f"theme-{i}", f"Theme {i}") for i in range(1, 11)]

TRANSACTION_TYPE_CHOICES = [
    ("SOLD",      "Sold"),
    ("PURCHASED", "Purchased"),
    ("APPRAISAL", "Appraisal"),
    ("LEASED",    "Leased"),
]

RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]


# ── Model ─────────────────────────────────────────────────────────────────────

class Testimonial(ClusterableModel):
    """
    A single testimonial — covers all three display types:
      video    → VideoTestimonial slider on home page
      featured → SplitSlider on testimonials page
      text     → VoiceMosaic / TickerWall on testimonials page
    """

    testimonial_type = models.CharField(
        max_length=20,
        choices=TESTIMONIAL_TYPE_CHOICES,
        default="text",
    )

    # ── Shared ────────────────────────────────────────────────────────────────
    name     = models.CharField(max_length=255, help_text="Client name or attribution")
    role     = models.CharField(max_length=100, blank=True, help_text="e.g. Homeowner")
    location = models.CharField(max_length=255, blank=True, help_text="e.g. Algester, QLD")
    company  = models.CharField(max_length=100, blank=True, help_text="Suburb or company shown on text cards")
    content  = models.TextField(blank=True)
    rating   = models.PositiveSmallIntegerField(default=5, choices=RATING_CHOICES)

    # ── Text / Featured ───────────────────────────────────────────────────────
    avatar = models.ForeignKey(
        "wagtailimages.Image",
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Profile photo (text & featured types)",
    )

    # ── Featured (SplitSlider) ────────────────────────────────────────────────
    featured_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Large hero image for the split slider",
    )
    theme = models.CharField(
        max_length=20, blank=True,
        choices=THEME_CHOICES, default="theme-1",
        help_text="Colour theme for the split slider slide",
    )

    # ── Video ─────────────────────────────────────────────────────────────────
    suburb = models.CharField(
        max_length=100, blank=True,
        help_text="Suburb shown in kicker, e.g. SUNNYBANK (uppercase)",
    )
    transaction_type = models.CharField(
        max_length=20, blank=True,
        choices=TRANSACTION_TYPE_CHOICES,
        help_text="Shown in kicker after suburb, e.g. SOLD",
    )
    video_url = models.CharField(
        max_length=500, blank=True,
        help_text="URL or local path to the video file",
    )
    poster = models.ForeignKey(
        "wagtailimages.Image",
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Poster/thumbnail for the video card",
    )
    tint_var = models.CharField(
        max_length=20, blank=True,
        choices=TINT_CHOICES, default="gold",
        help_text="Accent colour overlay on the video card",
    )

    # ── Admin panels ──────────────────────────────────────────────────────────
    panels = [
        MultiFieldPanel([
            FieldPanel("testimonial_type"),
        ], heading="Type"),
        MultiFieldPanel([
            FieldPanel("name"),
            FieldRowPanel([FieldPanel("role"), FieldPanel("rating")]),
            FieldRowPanel([FieldPanel("location"), FieldPanel("company")]),
            FieldPanel("content"),
        ], heading="Core"),
        MultiFieldPanel([
            FieldPanel("avatar"),
            FieldPanel("featured_image"),
            FieldPanel("theme"),
        ], heading="Featured / Text images"),
        MultiFieldPanel([
            FieldRowPanel([FieldPanel("suburb"), FieldPanel("transaction_type")]),
            FieldPanel("video_url"),
            FieldPanel("poster"),
            FieldPanel("tint_var"),
        ], heading="Video"),
    ]

    # ── API helpers ───────────────────────────────────────────────────────────

    def api_video_card(self):
        """Serialised shape expected by VideoTestimonial.tsx."""
        kicker = ""
        if self.suburb and self.transaction_type:
            kicker = f"{self.suburb} · {self.transaction_type}"
        return {
            "id": self.id,
            "kicker": kicker,
            "title": self.name,
            "video_url": self.video_url,
            "poster": {"url": self.poster.file.url} if self.poster else None,
            "tint_var": self.tint_var or "gold",
        }

    def api_featured_card(self):
        """Serialised shape expected by SplitSlider (SlideContent)."""
        return {
            "id": self.id,
            "kicker": "★★★★★",
            "title_lines": [self.name],
            "description": self.content,
            "link_text": f"— {self.name}",
            "image": self.featured_image.file.url if self.featured_image else None,
            "theme": self.theme or "theme-1",
        }

    def api_text_card(self):
        """Serialised shape expected by VoiceMosaic / TickerWall."""
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "company": self.company,
            "avatar": (
                self.avatar.file.url if self.avatar
                else f"https://i.pravatar.cc/150?img={self.id}"
            ),
            "content": self.content,
            "rating": self.rating,
            "location": self.location,
        }

    def __str__(self):
        return f"{self.name} ({self.get_testimonial_type_display()})"

    class Meta:
        ordering = ["-id"]
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"
