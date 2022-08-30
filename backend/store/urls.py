from django.urls import path
from store import views

app_name = "store"

urlpatterns = [
    path("", views.ProductListView.as_view(), name="products"),
    path("product/<slug>/", views.ProductDetailView.as_view(), name="product"),
    path("category/<slug>", views.CategoryItemView.as_view(), name="category"),
    path("categories", views.CategoryListView.as_view(), name="categories")
]