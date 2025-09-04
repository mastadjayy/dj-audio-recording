from django.urls import path
from . import views

#app_name = 'recording'

urlpatterns = [
    path('', views.index, name='index'),
    path('upload/', views.upload_recoridng, name='upload_audio'),
]