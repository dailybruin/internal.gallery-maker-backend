from rest_framework import serializers
from .models import Gallery, Image, GalleryTextField
from .constants import galleryOptions

class ImageSerializer(serializers.ModelSerializer):
     # This type is used for gallery maker frontend
    metatype = serializers.SerializerMethodField()

    def get_metatype(self, obj):
        return 'image'

    class Meta:
        model = Image
        fields = ['img_url', 'description', 'credits', 'index', 'gallery', 'id', 'type', 'metatype']

    def validate(self, data):
        if data['type'] not in galleryOptions[data['gallery'].layout]:
            raise serializers.ValidationError('A gallery of layout type {} cannot contain an image of type {}'.format(data['gallery'].layout, data['type']))
        return data

class GalleryTextFieldSerializer(serializers.ModelSerializer):
    # This type is used for main site
    type = serializers.SerializerMethodField()

    # This type is used for gallery maker frontend
    metatype = serializers.SerializerMethodField()

    def get_type(self, obj):
        return 'article-text'
    def get_metatype(self, obj):
        return 'text'

    class Meta:
        model = GalleryTextField
        fields = ['content', 'gallery', 'index', 'id', 'type', 'metatype']


def get_images_and_text(
        obj,
        img_serializer=ImageSerializer,
        text_serializer=GalleryTextFieldSerializer
    ):
    '''
    Combine ForeignKey related Image and GalleryTextField models into a shared
    array using the 'index' field in both models to order them.
    NOTE: This method is reliant on both models being ordered by 'index'
    '''
    image_data = img_serializer(obj.images.all(), many=True).data
    textfield_data = text_serializer(obj.textfields.all(), many=True).data
    data = []
    # index for data, image_data, and textfield_data respectively
    i, image_idx, text_idx = 0, 0, 0
    while i < len(image_data) + len(textfield_data):
        # add the next object whose index == i
        if image_idx < len(image_data) and image_data[image_idx]["index"] == i:
            data.append(image_data[image_idx])
            image_idx += 1
        else:
            data.append(textfield_data[text_idx])
            text_idx += 1
        i += 1
    return data

class GallerySerializer(serializers.ModelSerializer):
    data = serializers.SerializerMethodField()

    def get_data(self, obj):
        return get_images_and_text(obj)

    class Meta:
        model = Gallery
        fields = ['layout', 'data', 'id', 'name', 'description']


class MainSiteImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['img_url', 'description', 'credits', 'type', 'index']

class MainSiteTextSerializer(GalleryTextFieldSerializer):
    description = serializers.SerializerMethodField()

    def get_description(self, obj):
        return obj.content

    class Meta:
        model = GalleryTextField
        fields = ['description', 'type', 'index']

class MainSiteGallerySerializer(serializers.ModelSerializer):
    data = serializers.SerializerMethodField()
    layout = serializers.SerializerMethodField()

    def get_data(self, obj):
        return get_images_and_text(obj, MainSiteImageSerializer, MainSiteTextSerializer)

    def get_layout(self,obj):
        return obj.get_layout_display()

    class Meta:
        model = Gallery
        fields = ['data', 'layout']
