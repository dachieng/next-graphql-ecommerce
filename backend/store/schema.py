import graphene
from graphene_django import DjangoObjectType
from store.models import Product, Category, ProductImage

class ImageType(DjangoObjectType):
    class Meta:
        model = ProductImage
        fields = ["id", "image"]

    def resolve_image(self, info):
        if self.image:
            self.image = info.context.build_absolute_uri(self.image.url)
        return self.image


class ProductType(DjangoObjectType):
    class Meta:
        model = Product 
        fields = ["id", "category", "title", "description", "slug", "regular_price", "product_image"]

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "product_category"]


class Query(graphene.ObjectType):
    all_products = graphene.List(ProductType)

    product_detail = graphene.Field(ProductType, slug=graphene.String(required=True))

    all_categories_detail = graphene.Field(CategoryType, slug=graphene.String(required=True))

    all_categories = graphene.List(CategoryType)

    def resolve_all_products(root, info):
        return Product.objects.all()

    def resolve_product_detail(root, info, slug):
        try:
            return Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            return None

    def resolve_all_categories_detail(root, info, slug):
        return Category.objects.get(slug=slug)


    def resolve_all_categories(root, info):
        return Category.objects.filter(level=1)


schema = graphene.Schema(query=Query)