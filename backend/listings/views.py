from wagtail.api.v2.views import BaseAPIViewSet
from wagtail.api.v2.filters import FieldsFilter, OrderingFilter, SearchFilter
from .models import Listing


class ListingsAPIViewSet(BaseAPIViewSet):
    model = Listing

    body_fields = BaseAPIViewSet.body_fields + [
        "title", "slug", "category", "location", "price", "sold_price",
        "card_image", "beds", "baths", "sqft", "garage", "badge",
        "is_new", "views", "sold_date", "days_on_market", "deposit",
        "min_lease", "card_features", "has_detail_page",
        "address", "city", "state", "zip_code", "status", "price_label",
        "featured", "overview", "map_embed_url", "video_tour_url",
        "agent_name", "agent_title", "agent_phone", "agent_email",
        "agent_rating", "agent_review_count", "api_gallery_images",
        "api_detail_stats", "api_detail_features", "api_detail_rows",
        "api_nearby_locations", "api_video_thumbnail", "api_agent_image",
    ]
    meta_fields = []
    listing_default_fields = [
        "id", "title", "slug", "category", "location", "price",
        "card_image", "beds", "baths", "sqft", "garage", "badge",
        "is_new", "card_features",
    ]
    filter_backends = [FieldsFilter, OrderingFilter, SearchFilter]
    ordering = ["-id"]

    def get_queryset(self):
        return Listing.objects.all().prefetch_related(
            "gallery_images", "detail_features", "detail_rows",
            "detail_stats", "nearby_locations",
        ).select_related("card_image", "agent_image", "video_thumbnail")
