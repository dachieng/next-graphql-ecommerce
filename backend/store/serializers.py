from pyexpat import model
from rest_framework import serializers
from store.models import Category, Product, ProductImage

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image"]

class ProductSerializer(serializers.ModelSerializer):
    # inline serializer
    product_image = ImageSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = ["id", "category", "title", "description", "slug", "regular_price", "product_image"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]