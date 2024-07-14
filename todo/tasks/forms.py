from django import forms
from django.forms import ModelForm
from .models import Task

class TaskForm(forms.ModelForm):
    due_date = forms.DateField(widget=forms.DateInput(attrs={'class': 'form-control'}), required=False)
    due_time = forms.TimeField(widget=forms.TimeInput(attrs={'class': 'form-control'}), required=False)


    class Meta:
        model = Task
        fields = ['title', 'due_date', 'due_time']
        widgets = {
            'title': forms.TextInput(attrs={
                'placeholder': 'Add new task...',
                'class': 'form-control',  # Add a CSS class for styling
                'style': 'width: 98%; padding: 12px; margin-bottom: 20px; margin-top: 20px; border: 1px solid #ddd; border-radius: 5px; font-size: 1em; transition: border-color 0.3s ease;'
            }),
        }
        labels = {
            'title': 'Enter Your Task',
        }
