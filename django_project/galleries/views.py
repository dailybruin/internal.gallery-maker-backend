from .serializers import (
    GallerySerializer,
    ImageSerializer,
    MainSiteGallerySerializer,
    GalleryTextFieldSerializer
)
from .models import Gallery, Image
from .pagination import GalleryPagination
from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.db import transaction
from django.contrib.auth.decorators import login_required






from rest_framework_swagger.views import get_swagger_view
from rest_framework.decorators import api_view, permission_classes, schema

import coreapi, coreschema

from rest_framework.schemas import AutoSchema, ManualSchema

custom_schema = AutoSchema(manual_fields=[
    coreapi.Field("username", required=True, location="form", type="string", description="username here"),
    coreapi.Field("password", required=True, location="form", type="string", description="password field")
])

schema_view = get_swagger_view(title='Pastebin API')


class GalleryViewSet(viewsets.ModelViewSet):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer
    pagination_class = GalleryPagination
    permission_classes = [IsAuthenticated]

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated]

class GalleryRetrieve(generics.RetrieveAPIView):
    queryset = Gallery.objects.all()
    serializer_class = MainSiteGallerySerializer

@api_view(["POST"])
@login_required
@transaction.atomic
@schema(custom_schema)
def create_or_update_gallery(request):
    data = request.data.copy()
    id_exists = data.get("id", None)

    # Error checking
    if "name" not in data or "description" not in data or "layout" not in data:
        return JsonResponse({"response": "Name, description, or layout does not exist."}, status=400)
    if "data" not in data:
        return JsonResponse({"response": "Data does not exist."}, status=400)
    for index, item in enumerate(data["data"]):
        if "metatype" not in item:
            return JsonResponse({
                "response": f"Data object at index {index} has no 'metatype' field"
                }, status=400)
        if item["metatype"] == "image":
            required_fields = ["caption", "url", "credits", "type"]
        elif item["metatype"] == "text":
            required_fields = ["content"]
        for field in required_fields:
            if field not in item:
                return JsonResponse({
                    "response": f"Required field '{field}' does not exist in data object at index {index}"
                }, status=400)

    gallery_serializer = None
    if id_exists is None:
        gallery_serializer = GallerySerializer(data={"name": data["name"], "description": data["description"], "layout": data["layout"]})
    else:
        # check if gallery actually exists
        id = id_exists
        referenced_gallery = Gallery.objects.filter(id=id)
        if len(referenced_gallery) == 0:
            return JsonResponse({"response": "Gallery does not exist."}, status=400)

        # delete old images and text fields
        actual_gallery_obj = Gallery.objects.get(id=id)
        actual_gallery_obj.images.all().delete()
        actual_gallery_obj.textfields.all().delete()

        # make serializer for updating existing gallery
        gallery_serializer = GallerySerializer(actual_gallery_obj, data={"name": data["name"], "description": data["description"], "layout": data["layout"]})
    
    # save gallery (or update gallery if it already exists)
    if gallery_serializer.is_valid():
        gallery = gallery_serializer.save()
    else:
        return JsonResponse(gallery_serializer.errors, status=400)
    id = gallery.id

    # Create images and textfields.
    # If gallery already existed, then images and text deleted earlier
    for index, item in enumerate(data["data"]):
        item.update({"gallery": id, "index": index})
        if item["metatype"] == "image":
            item["img_url"] = item.pop("url")
            item["description"] = item.pop("caption")
            serializer_class = ImageSerializer(data=item)
        else:
            serializer_class = GalleryTextFieldSerializer(data=item)

        if serializer_class.is_valid():
            serializer_class.save()
        else:
            return JsonResponse(serializer_class.errors, status=400)


    return JsonResponse(data)
        # {
        #     name:
        #     description:
        #     alt..
        #     data: []
        # }
        # create gallery first, get id, then create many image objects with that gallery object id
        # 
