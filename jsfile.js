/* =========================================
   TASK DATA
========================================= */

let tasks = JSON.parse(
    localStorage.getItem("priorityTasks")
) || [];




const openTaskModal =
    document.getElementById("openTaskModal");

const closeTaskModal =
    document.getElementById("closeTaskModal");

const cancelTask =
    document.getElementById("cancelTask");

const modalOverlay =
    document.getElementById("modalOverlay");

const taskModal =
    document.getElementById("taskModal");

const taskForm =
    document.getElementById("taskForm");

const taskTitle =
    document.getElementById("taskTitle");

const taskDescription =
    document.getElementById("taskDescription");

const taskPriority =
    document.getElementById("taskPriority");

const taskDueDate =
    document.getElementById("taskDueDate");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const priorityFilter =
    document.getElementById("priorityFilter");

const todoTasks =
    document.getElementById("todoTasks");

const progressTasks =
    document.getElementById("progressTasks");

const doneTasks =
    document.getElementById("doneTasks");

const pendingCount =
    document.getElementById("pendingCount");

const todayCount =
    document.getElementById("todayCount");

const overdueCount =
    document.getElementById("overdueCount");

const todoCount =
    document.getElementById("todoCount");

const progressCount =
    document.getElementById("progressCount");

const doneCount =
    document.getElementById("doneCount");

const successMessage =
    document.getElementById("successMessage");

const errorMessage =
    document.getElementById("errorMessage");


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderTasks();

        updateStatistics();

    }
);


/* =========================================
   MODAL
========================================= */

openTaskModal.addEventListener(
    "click",
    () => {

        openModal();

    }
);


closeTaskModal.addEventListener(
    "click",
    () => {

        closeModal();

    }
);


cancelTask.addEventListener(
    "click",
    () => {

        closeModal();

    }
);


modalOverlay.addEventListener(
    "click",
    () => {

        closeModal();

    }
);


function openModal() {

    taskModal.classList.add("active");

    document.body.style.overflow = "hidden";

    taskTitle.focus();

}


function closeModal() {

    taskModal.classList.remove("active");

    document.body.style.overflow = "";

    resetForm();

}


/* =========================================
   FORM SUBMISSION
========================================= */

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const isValid = validateForm();

        if (!isValid) {

            return;

        }


        const newTask = {

            id: Date.now(),

            title: taskTitle.value.trim(),

            description:
                taskDescription.value.trim(),

            priority:
                taskPriority.value,

            dueDate:
                taskDueDate.value,

            status: "To Do"

        };


        tasks.push(newTask);

        saveTasks();

        renderTasks();

        updateStatistics();

        closeModal();

        showSuccess(
            "Task created successfully."
        );

    }
);


/* =========================================
   FORM VALIDATION
========================================= */

function validateForm() {

    clearErrors();

    let valid = true;


    // Title validation

    if (
        taskTitle.value.trim() === ""
    ) {

        showFieldError(
            "titleError",
            "Task title is required."
        );

        valid = false;

    } else if (
        taskTitle.value.trim().length < 3
    ) {

        showFieldError(
            "titleError",
            "Title must be at least 3 characters."
        );

        valid = false;

    }


    // Priority validation

    if (
        taskPriority.value === ""
    ) {

        showFieldError(
            "priorityError",
            "Please select a priority."
        );

        valid = false;

    }


    // Due date validation

    if (
        taskDueDate.value === ""
    ) {

        showFieldError(
            "dateError",
            "Please select a due date."
        );

        valid = false;

    }


    return valid;

}


function showFieldError(
    elementId,
    message
) {

    document.getElementById(
        elementId
    ).textContent = message;

}


function clearErrors() {

    document.getElementById(
        "titleError"
    ).textContent = "";

    document.getElementById(
        "priorityError"
    ).textContent = "";

    document.getElementById(
        "dateError"
    ).textContent = "";

}


/* =========================================
   RESET FORM
========================================= */

function resetForm() {

    taskForm.reset();

    clearErrors();

}


/* =========================================
   SAVE TASKS
========================================= */

function saveTasks() {

    localStorage.setItem(
        "priorityTasks",
        JSON.stringify(tasks)
    );

}


/* =========================================
   GET TODAY
========================================= */

function getToday() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* =========================================
   CHECK OVERDUE
========================================= */

function isOverdue(task) {

    return (
        task.dueDate < getToday() &&
        task.status !== "Done"
    );

}


/* =========================================
   CHECK DUE TODAY
========================================= */

function isDueToday(task) {

    return (
        task.dueDate === getToday()
    );

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    todoTasks.innerHTML = "";

    progressTasks.innerHTML = "";

    doneTasks.innerHTML = "";


    const filteredTasks =
        getFilteredTasks();


    const todo =
        filteredTasks.filter(
            task => task.status === "To Do"
        );


    const progress =
        filteredTasks.filter(
            task => task.status === "In Progress"
        );


    const done =
        filteredTasks.filter(
            task => task.status === "Done"
        );


    todoCount.textContent =
        todo.length;

    progressCount.textContent =
        progress.length;

    doneCount.textContent =
        done.length;


    if (todo.length === 0) {

        showEmptyState(
            todoTasks,
            "No tasks in To Do"
        );

    } else {

        todo.forEach(
            task => {

                todoTasks.appendChild(
                    createTaskCard(task)
                );

            }
        );

    }


    if (progress.length === 0) {

        showEmptyState(
            progressTasks,
            "No tasks in progress"
        );

    } else {

        progress.forEach(
            task => {

                progressTasks.appendChild(
                    createTaskCard(task)
                );

            }
        );

    }


    if (done.length === 0) {

        showEmptyState(
            doneTasks,
            "No completed tasks"
        );

    } else {

        done.forEach(
            task => {

                doneTasks.appendChild(
                    createTaskCard(task)
                );

            }
        );

    }

}


/* =========================================
   FILTER TASKS
========================================= */

function getFilteredTasks() {

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedStatus =
        statusFilter.value;


    const selectedPriority =
        priorityFilter.value;


    return tasks.filter(
        task => {

            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(searchText);


            const matchesStatus =
                selectedStatus === "All" ||
                task.status === selectedStatus;


            const matchesPriority =
                selectedPriority === "All" ||
                task.priority === selectedPriority;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );

        }
    );

}


/* =========================================
   CREATE TASK CARD
========================================= */

function createTaskCard(task) {

    const card =
        document.createElement("article");


    card.className = "task-card";


    const overdue =
        isOverdue(task);


    if (overdue) {

        card.classList.add("overdue");

    }


    const priorityClass =
        task.priority.toLowerCase();


    card.innerHTML = `

        <h3 class="task-title">
            ${escapeHTML(task.title)}
        </h3>


        ${
            task.description
                ? `
                    <p class="task-description">
                        ${escapeHTML(task.description)}
                    </p>
                  `
                : ""
        }


        ${
            overdue
                ? `
                    <div class="overdue-label">
                        🔴 OVERDUE
                    </div>
                  `
                : ""
        }


        <div class="task-meta">

            <span
                class="
                    priority-badge
                    priority-${priorityClass}
                "
            >
                ${task.priority}
            </span>


            <span class="task-date">

                Due:
                ${formatDate(task.dueDate)}

            </span>

        </div>


        <select
            class="status-select"
            data-task-id="${task.id}"
        >

            <option
                value="To Do"
                ${
                    task.status === "To Do"
                        ? "selected"
                        : ""
                }
            >
                To Do
            </option>


            <option
                value="In Progress"
                ${
                    task.status === "In Progress"
                        ? "selected"
                        : ""
                }
            >
                In Progress
            </option>


            <option
                value="Done"
                ${
                    task.status === "Done"
                        ? "selected"
                        : ""
                }
            >
                Done
            </option>

        </select>

    `;


    const statusSelect =
        card.querySelector(
            ".status-select"
        );


    statusSelect.addEventListener(
        "change",
        function () {

            changeTaskStatus(
                task.id,
                this.value
            );

        }
    );


    return card;

}


/* =========================================
   CHANGE TASK STATUS
========================================= */

function changeTaskStatus(
    taskId,
    newStatus
) {

    const task =
        tasks.find(
            task => task.id === taskId
        );


    if (!task) {

        return;

    }


    task.status = newStatus;


    saveTasks();

    renderTasks();

    updateStatistics();

    showSuccess(
        "Task status updated."
    );

}


/* =========================================
   STATISTICS
========================================= */

function updateStatistics() {

    const pending =
        tasks.filter(
            task => task.status !== "Done"
        ).length;


    const dueToday =
        tasks.filter(
            task => isDueToday(task)
        ).length;


    const overdue =
        tasks.filter(
            task => isOverdue(task)
        ).length;


    pendingCount.textContent =
        pending;

    todayCount.textContent =
        dueToday;

    overdueCount.textContent =
        overdue;

}


/* =========================================
   EMPTY STATE
========================================= */

function showEmptyState(
    container,
    message
) {

    container.innerHTML = `

        <div class="empty-state">
            ${message}
        </div>

    `;

}


/* =========================================
   SUCCESS MESSAGE
========================================= */

function showSuccess(message) {

    successMessage.textContent =
        message;

    successMessage.style.display =
        "block";


    errorMessage.style.display =
        "none";


    setTimeout(
        () => {

            successMessage.style.display =
                "none";

        },
        2500
    );

}


/* =========================================
   ERROR MESSAGE
========================================= */

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";


    successMessage.style.display =
        "none";

}


/* =========================================
   SEARCH / FILTER EVENTS
========================================= */

searchInput.addEventListener(
    "input",
    () => {

        renderTasks();

    }
);


statusFilter.addEventListener(
    "change",
    () => {

        renderTasks();

    }
);


priorityFilter.addEventListener(
    "change",
    () => {

        renderTasks();

    }
);


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}