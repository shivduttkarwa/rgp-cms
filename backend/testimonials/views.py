from wagtail.api.v2.views import BaseAPIViewSet
from wagtail.api.v2.filters import FieldsFilter, OrderingFilter, SearchFilter

from .models import Testimonial


class TestimonialsAPIViewSet(BaseAPIViewSet):
    model = Testimonial

    body_fields = BaseAPIViewSet.body_fields + [
        "testimonial_type",
        "name", "role", "location", "company", "content", "rating",
        # image FKs — serialised as dicts by the model's api_* methods
        "api_video_card",
        "api_featured_card",
        "api_text_card",
    ]
    meta_fields = []

    filter_backends = [FieldsFilter, OrderingFilter, SearchFilter]
    ordering = ["-id"]

    def get_queryset(self):
        return Testimonial.objects.all().select_related(
            "avatar", "featured_image", "poster"
        )
