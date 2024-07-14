from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('update_task/<str:pk>/', views.update_task, name='update_task'),
    path('delete_task/<int:pk>/', views.delete_task, name='delete_task'),
    path('toggle_task/<int:pk>/', views.toggle_task, name='toggle_task'),
    path('completed_tasks/', views.get_completed_tasks, name='completed_tasks'),
    path('close_task/', views.close_task, name='close_task'),
    path('delete_completed_tasks/', views.delete_completed_tasks, name='delete_completed_tasks'),
]
