from django.db import models
from django.db.models import Model

# Create your models here.


class Gallery(models.Model):


    # gallery should have id (primary key)
    #       and a gallery_name (textfield)

    ALT= 'alt'
    NOTALT = 'notalt'
    BIG_CENTERED_STREAM = 'big-centered-stream'

    POSSIBLE_VIEW_CHOICES = [
        (ALT, 'alternating'),
        (NOTALT, 'not-alternating'),
        (BIG_CENTERED_STREAM, BIG_CENTERED_STREAM)
    ]

    layout = models.CharField(
        max_length=20,
        choices=POSSIBLE_VIEW_CHOICES,
        default = ALT
    )
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=100, blank=True)


class Image(models.Model):
    # image url
    img_url = models.URLField(max_length=200)
    # desc of img
    description = models.TextField(max_length=300, blank=True)
    # photo creds
    credits = models.TextField(max_length=50, blank=True)

    # NOTE: this index specifies ordering and is shared with GalleryTextField.index
    # For example, for the following gallery: [ Image1, Text1, Image2],
    # The respective index fields will be:
    #   Image1.index = 0, Text1.index = 1, Image2.index = 2
    index = models.IntegerField()

    # foreign key
    gallery = models.ForeignKey(Gallery, on_delete=models.CASCADE, related_name="images")

    # type of image (center, alternating)
    CENTER_PHOTO= 'center-photo'
    ALT_PHOTO = 'alt-photo'
    BIG_CENTER_PHOTO = 'big-center-photo'

    POSSIBLE_TYPE_CHOICES = [
        (CENTER_PHOTO, CENTER_PHOTO),
        (ALT_PHOTO, ALT_PHOTO),
        (BIG_CENTER_PHOTO, BIG_CENTER_PHOTO)
    ]
    type = models.CharField(
        max_length=16,
        choices=POSSIBLE_TYPE_CHOICES,
        default = ALT_PHOTO
    )

    class Meta:
        ordering = ['index']


class GalleryTextField(models.Model):
    # Actual content of text field
    content = models.TextField()

    # Foreign key
    gallery = models.ForeignKey(Gallery, on_delete=models.CASCADE, related_name="textfields")

    # NOTE: this index specifies ordering and is shared with Image.index
    # For example, for the following gallery: [ Image1, Text1, Image2],
    # The respective index fields will be:
    #   Image1.index = 0, Text1.index = 1, Image2.index = 2
    index = models.IntegerField()

    class Meta:
        ordering = ['index']