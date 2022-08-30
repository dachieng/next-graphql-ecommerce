from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.generics import ListAPIView, RetrieveAPIView
from store.models import Product, Category
from store.serializers import CategorySerializer, ProductSerializer

class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CategoryListView(ListAPIView):
    queryset = Category.objects.filter(level=1)
    serializer_class = CategorySerializer



class ProductDetailView(RetrieveAPIView):
    lookup_field = "slug"
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CategoryItemView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(
        category__in  = Category.objects.filter(slug=self.kwargs["slug"]).get_descendants(include_self=True)
        )