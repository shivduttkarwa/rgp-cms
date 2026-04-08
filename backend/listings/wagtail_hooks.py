from wagtail_modeladmin.options import ModelAdmin, ModelAdminGroup, modeladmin_register
from .models import Listing


class ListingAdmin(ModelAdmin):
    model = Listing
    menu_label = "Listings"
    menu_icon = "home"
    menu_order = 200
    add_to_settings_menu = False
    list_display = ["title", "category", "location", "price", "is_new", "has_detail_page"]
    list_filter = ["category", "is_new", "featured"]
    search_fields = ["title", "location"]


modeladmin_register(ListingAdmin)
