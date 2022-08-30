from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from store.models import (Category, 
        Product, 
        ProductImage, 
        ProductSpecification, 
        ProductSpecificationValue, 
        ProductType)


admin.site.register(Category, MPTTModelAdmin)

class ProductSpecificicationInline(admin.TabularInline):
    model = ProductSpecification


@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    inlines = [
        ProductSpecificicationInline
    ]

class ProductImageInline(admin.TabularInline):
    model = ProductImage


class ProductSpecificationValueInline(admin.TabularInline):
    model = ProductSpecificationValue


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [
        ProductImageInline,
        ProductSpecificationValueInline
    ]