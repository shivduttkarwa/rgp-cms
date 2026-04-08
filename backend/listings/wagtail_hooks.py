from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet
from .models import Listing


class ListingViewSet(SnippetViewSet):
    model = Listing
    menu_label = "Listings"
    menu_icon = "home"
    menu_order = 200
    add_to_admin_menu = True
    list_display = ["title", "category", "location", "price", "is_new", "has_detail_page"]
    list_filter = ["category", "is_new", "featured"]
    search_fields = ["title", "location"]


register_snippet(ListingViewSet)
