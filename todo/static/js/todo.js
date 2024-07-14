// todo.js

document.addEventListener('DOMContentLoaded', function() {
    const updateModal = document.getElementById('updateModal');
    const deleteModal = document.getElementById('deleteModal');
    const completedTasksModal = document.getElementById('completedTasksModal');
    let currentTaskId = null;

    // Show update modal
    document.querySelectorAll('.update-task').forEach(button => {
        button.addEventListener('click', function() {
            const taskRow = button.closest('.item-row');
            const taskId = taskRow.getAttribute('data-task-id');
            const taskTitle = taskRow.querySelector('.task-title').textContent;

            currentTaskId = taskId;
            document.getElementById('updateTaskInput').value = taskTitle;
            updateModal.style.display = 'block';
        });
    });

    // Show delete modal
    document.querySelectorAll('.delete-task').forEach(button => {
        button.addEventListener('click', function() {
            const taskRow = button.closest('.item-row');
            const taskId = taskRow.getAttribute('data-task-id');

            currentTaskId = taskId;
            deleteModal.style.display = 'block';
        });
    });

    // Show completed tasks modal
    document.getElementById('viewCompletedTasks').addEventListener('click', function() {
        fetch('/completed_tasks/')
            .then(response => response.text())
            .then(data => {
                document.getElementById('completedTasksContent').innerHTML = data;
                completedTasksModal.style.display = 'block';
            });
        });    

    // Close modals
    document.querySelectorAll('.close-modal').forEach(button => {
        console.log('Attaching close event to button:', button);
        button.addEventListener('click', function() {
            console.log('Close button clicked');
            updateModal.style.display = 'none';
            deleteModal.style.display = 'none';
            completedTasksModal.style.display = 'none';

            // Redirect to home page after closing the modal
            window.location.href = '/'; 
        });
    });

    // Confirm update
    document.getElementById('confirmUpdate').addEventListener('click', function() {
        const newTitle = document.getElementById('updateTaskInput').value;
        fetch(`/update_task/${currentTaskId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ title: newTitle })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelector(`.item-row[data-task-id="${currentTaskId}"] .task-title`).textContent = newTitle;
                updateModal.style.display = 'none';
            }
        });
    });

    // Confirm delete
    document.getElementById('confirmDelete').addEventListener('click', function() {
        fetch(`/delete_task/${currentTaskId}/`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                'X-Requested-With': 'XMLHttpRequest'
        }})
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.querySelector(`.item-row[data-task-id="${currentTaskId}"]`).remove();
                deleteModal.style.display = 'none';
            }
        });
    });

    // Handle checkbox click to mark task as complete or incomplete
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskId = checkbox.getAttribute('data-task-id');
            const isComplete = checkbox.checked;

            fetch(`/toggle_task/${taskId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ complete: isComplete })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const taskRow = document.querySelector(`.item-row[data-task-id="${taskId}"]`);
                    if (isComplete) {
                        taskRow.remove();
                    }
                }
            });
        });
    });

    // View completed tasks
    document.getElementById('viewCompletedTasks').addEventListener('click', function() {
        window.location.href = '/completed_tasks/';
    });
});
