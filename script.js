let taskIdCounter = 1;
let points = 0; // 新規追加部分：ポイントの初期化
let stars = 0;  // 新規追加部分：スターの初期化

// Load tasks from localStorage
window.onload = function() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.forEach(task => {
        addStoredTask(task);
    });

    // Add default tasks
    addDefaultTasks();
    updateProgress();
    updatePointsAndStars(); 
};

function addDefaultTasks() {
    const defaultTasks = [
        { id: 'task-default-1', text: 'Complete project report', dueDate: '2024-11-10T10:00', importance: 'urgent-important', completed: false },
        { id: 'task-default-2', text: 'Read a book on personal development', dueDate: '2024-11-15T10:00', importance: 'not-urgent-important', completed: false },
        { id: 'task-default-3', text: 'Submit application for internship', dueDate: '2024-11-20T10:00', importance: 'urgent-not-important', completed: false },
        { id: 'task-default-4', text: 'Plan a vacation', dueDate: '2024-12-01T10:00', importance: 'not-urgent-not-important', completed: false },
    ];

    defaultTasks.forEach(task => {
        addStoredTask(task);
    });
}

function addTasks() {
    const taskInput = document.getElementById("taskInput").value;
    const dueDate = document.getElementById("dueDate").value;
    const importance = document.getElementById("importance").value;

    if (!taskInput) {
        alert("Please enter a task.");
        return;
    }

    const quadrantMap = {
        "urgent-important": "tasks-urgent-important",
        "not-urgent-important": "tasks-not-urgent-important",
        "urgent-not-important": "tasks-urgent-not-important",
        "not-urgent-not-important": "tasks-not-urgent-not-important"
    };

    const newTaskId = "task-" + taskIdCounter++;
    const tasksContainer = document.getElementById(quadrantMap[importance]);

    const taskHTML = `
        <div class="task" id="${newTaskId}" draggable="true" ondragstart="event.dataTransfer.setData('text', this.id)">
            <input type="text" value="${taskInput}" onchange="updateTaskText('${newTaskId}', this.value)">
            <input type="datetime-local" value="${dueDate}" onchange="updateDueDate('due-${newTaskId}', this.value)">
            <input type="checkbox" onchange="markAsCompleted(this)">
            <button class="delete-button" onclick="deleteTask('${newTaskId}')">Delete</button>
        </div>
    `;
    tasksContainer.insertAdjacentHTML("beforeend", taskHTML);
    storeTaskInLocalStorage({ id: newTaskId, text: taskInput, dueDate: dueDate, importance: importance, completed: false });
    document.getElementById("taskInput").value = '';
    document.getElementById("dueDate").value = '';
    updateProgress();
}

function storeTaskInLocalStorage(task) {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(storedTasks));
}

function addStoredTask(task) {
    const quadrantMap = {
        "urgent-important": "tasks-urgent-important",
        "not-urgent-important": "tasks-not-urgent-important",
        "urgent-not-important": "tasks-urgent-not-important",
        "not-urgent-not-important": "tasks-not-urgent-not-important"
    };

    const tasksContainer = document.getElementById(quadrantMap[task.importance]);

    const taskHTML = `
        <div class="task" id="${task.id}" draggable="true" ondragstart="event.dataTransfer.setData('text', this.id)">
            <input type="text" value="${task.text}" onchange="updateTaskText('${task.id}', this.value)">
            <input type="datetime-local" value="${task.dueDate}" onchange="updateDueDate('due-${task.id}', this.value)">
            <input type="checkbox" onchange="markAsCompleted(this)">
            <button class="delete-button" onclick="deleteTask('${task.id}')">Delete</button>
        </div>
    `;
    tasksContainer.insertAdjacentHTML("beforeend", taskHTML);
    updateProgress();
}

// Update task text
function updateTaskText(taskId, newText) {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = storedTasks.find(task => task.id === taskId);
    if (task) {
        task.text = newText;
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }
}

// Update due date
function updateDueDate(taskId, newDueDate) {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = storedTasks.find(task => task.id === taskId);
    if (task) {
        task.dueDate = newDueDate;
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }
}

function deleteTask(taskId) {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = storedTasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    const taskElement = document.getElementById(taskId);
    taskElement.remove();

    updateProgress();
}

function markAsCompleted(checkbox) {
    const taskElement = checkbox.closest(".task");
    const taskId = taskElement.id;
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = storedTasks.find(task => task.id === taskId);
    if (task) {
        task.completed = checkbox.checked;
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }

    updateProgress();
    updatePointsAndStars();
}

// Update progress bar based on completed tasks
function updateProgress() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const totalTasks = storedTasks.length;
    const completedTasks = storedTasks.filter(task => task.completed).length;
    const progress = (completedTasks / totalTasks) * 100;

    const progressBar = document.getElementById("progressBar");
    progressBar.value = progress;
    document.getElementById("progressText").innerText = `${Math.round(progress)}%`;
}

// New Function to update Points and Stars based on completion
function updatePointsAndStars() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completedTasks = storedTasks.filter(task => task.completed).length;
    
    points = completedTasks * 10;  // Points = 10 per task completed
    stars = Math.floor(completedTasks / 5);  // 1 star per 5 tasks completed

    document.getElementById("points").innerText = points;
    document.getElementById("stars").innerText = stars;

    // Show celebration message when points reach 100
    if (points >= 100) {
        const celebrationMessage = document.createElement("div");
        celebrationMessage.classList.add("celebration-message");
        celebrationMessage.innerText = "Congratulations! You've earned 100 points!";
        document.querySelector(".task-area").prepend(celebrationMessage);
    }
}
