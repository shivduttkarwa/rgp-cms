from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet

from .models import Testimonial


class TestimonialViewSet(SnippetViewSet):
    model = Testimonial
    icon = "user"
    menu_label = "Testimonials"
    menu_name = "testimonials"
    menu_order = 210
    add_to_admin_menu = True
    list_display = ["name", "testimonial_type", "location", "rating"]
    list_filter = ["testimonial_type", "rating"]
    search_fields = ["name", "content", "location", "suburb"]


register_snippet(TestimonialViewSet)
