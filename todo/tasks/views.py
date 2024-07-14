from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Task
from .forms import TaskForm
import json

def index(request):
    tasks = Task.objects.filter(complete=False).order_by('id')
    completed_tasks = Task.objects.filter(complete=True).order_by('id')
    form = TaskForm()

    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/')

    context = {'tasks': tasks, 'completed_tasks': completed_tasks, 'form': form}
    return render(request, 'tasks/list.html', context)

@require_POST
def update_task(request, pk):
    task = get_object_or_404(Task, id=pk)

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        data = json.loads(request.body)
        task.due_date = data.get('due_date', task.due_date)
        task.due_time = data.get('due_time', task.due_time)
        task.save()
        return JsonResponse({'success': True, 'title': task.title, 'due_date': task.due_date, 'due_time': task.due_time})
    else:
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            return redirect('/')

    context = {'form': form}
    return render(request, 'tasks/list.html', context)

@require_POST
def delete_task(request, pk):
    task = get_object_or_404(Task, id=pk)

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        task.delete()
        return JsonResponse({'success': True})
    else:
        task.delete()
        return redirect('/')

@require_POST
def toggle_task(request, pk):
    task = get_object_or_404(Task, id=pk)
    data = json.loads(request.body)
    task.complete = data.get('complete', task.complete)
    task.save()
    return JsonResponse({'success': True, 'complete': task.complete})

def get_completed_tasks(request):
    completed_tasks = Task.objects.filter(complete=True)
    return render(request, 'tasks/completed_tasks_modal.html', {'completed_tasks': completed_tasks})

@require_POST
def delete_completed_tasks(request):
    Task.objects.filter(complete=True).delete()
    return redirect('/')

def close_task(request):
    return redirect('/')



