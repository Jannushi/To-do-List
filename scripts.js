
const form = document.getElementById('todo-form');
const taskList = document.getElementById('task-list');
const alarmSound = new Audio('C:\\Users\\Shivanand Chauhan\\OneDrive\\Desktop\\TODOLIST APP\\ringtones\\Smoke Alarm Chirp.mp3');

document.addEventListener('DOMContentLoaded', function () {
    loadTasks();
});

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const task = event.target.elements['task'].value;
    const description = event.target.elements['description'].value;
    const alarm = event.target.elements['alarm'].value;

    if (task.trim() === '' || description.trim() === '') {
        alert('Task and description cannot be empty');
        return;
    }

    addTaskToList(task, description, alarm);
    saveTaskToLocalStorage(task, description, alarm);

    if (alarm) {
        scheduleAlarm(task, alarm);
    }

    event.target.reset();
});

function scheduleAlarm(task, alarmTime) {
    const alarmDateTime = new Date(alarmTime);
    const timeDifference = alarmDateTime - Date.now();

    if (timeDifference > 0) {
        setTimeout(() => {
            alarmSound.play();
            alert(`It's time to complete the task: ${task}`);
        }, timeDifference);
    }
}

function addTaskToList(task, description, alarm, completed) {
    const listItem = document.createElement('div');
    listItem.classList.add('task-item');

    const taskParagraph = document.createElement('p');
    taskParagraph.textContent = task;

    const descriptionParagraph = document.createElement('d');
    descriptionParagraph.textContent = description;

    const alarmParagraph = document.createElement('t');
    alarmParagraph.textContent = `Alarm: ${formatAlarmDatetime(alarm)}`;

    const iconsContainer = document.createElement('div');
    iconsContainer.classList.add('icons');

    const editIcon = createIcon('fas', 'fa-edit', 'icon', () => {
        editTask(listItem, taskParagraph.textContent, descriptionParagraph.textContent);
    });

    const deleteIcon = createIcon('fas', 'fa-trash-alt', 'icon', () => {
        taskList.removeChild(listItem);
        removeFromLocalStorage(taskParagraph.textContent);
    });

    const completeIcon = createIcon('fas', 'fa-check', 'icon', () => {
        completeTask(listItem);
    });

    iconsContainer.appendChild(editIcon);
    iconsContainer.appendChild(deleteIcon);
    iconsContainer.appendChild(completeIcon);

    listItem.appendChild(taskParagraph);
    listItem.appendChild(descriptionParagraph);
    listItem.appendChild(alarmParagraph);
    listItem.appendChild(iconsContainer);

    if (completed) {
        completeTask(listItem);
    }

    taskList.appendChild(listItem);

    const hr = document.createElement('hr');
    taskList.appendChild(hr);
}

function formatAlarmDatetime(alarm) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(alarm).toLocaleString('en-US', options);
}

function editTask(listItem, task, description) {
    if (!isTaskCompleted(listItem)) {
        const newTask = prompt('Enter the new task:', task);
        const newDescription = prompt('Enter the new description:', description);

        if (newTask !== null && newDescription !== null) {
            listItem.childNodes[0].textContent = newTask;
            listItem.childNodes[1].textContent = newDescription;
            updateTaskInLocalStorage(task, newTask, newDescription);
        }
    } else {
        alert('Cannot edit completed task.');
    }
}

function isTaskCompleted(listItem) {
    return listItem.childNodes[0].style.textDecoration === 'line-through';
}

function completeTask(listItem) {
    listItem.childNodes[0].style.textDecoration = 'line-through';
    listItem.childNodes[0].style.color = 'green';
    listItem.childNodes[1].style.textDecoration = 'line-through';
    listItem.childNodes[1].style.color = 'green';
    updateTaskStatusInLocalStorage(listItem.childNodes[0].textContent, true);
}

function saveTaskToLocalStorage(task, description, alarm) {
    let tasks = getTasksFromLocalStorage();
    tasks.push({ task, description, alarm, completed: false });
    updateLocalStorage(tasks);
}

function updateTaskInLocalStorage(oldTask, newTask, newDescription) {
    let tasks = getTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(t => t.task === oldTask);
    if (taskIndex !== -1) {
        tasks[taskIndex].task = newTask;
        tasks[taskIndex].description = newDescription;
        updateLocalStorage(tasks);
    }
}

function updateTaskStatusInLocalStorage(task, completed) {
    let tasks = getTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(t => t.task === task);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = completed;
        updateLocalStorage(tasks);
    }
}

function removeFromLocalStorage(task) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(t => t.task !== task);
    updateLocalStorage(tasks);

    // Check if there are no tasks left, remove the hr element
    if (tasks.length === 0) {
        taskList.innerHTML = ''; // Remove all child elements
    } else if (taskList.lastChild.tagName === 'HR') {
        taskList.removeChild(taskList.lastChild);
    }
}
function updateLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        addTaskToList(task.task, task.description, task.alarm, task.completed);
    });

    // Check if there are no tasks, remove the hr element
    if (tasks.length === 0 && taskList.lastChild.tagName === 'HR') {
        taskList.removeChild(taskList.lastChild);
    }
}
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function createIcon(iconClass, faClass, additionalClass, clickHandler) {
    const icon = document.createElement('i');
    icon.classList.add(iconClass, faClass, additionalClass);
    icon.addEventListener('click', clickHandler);
    return icon;
}


