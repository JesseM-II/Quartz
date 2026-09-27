let toDoLists = localStorage.getItem("toDoLists")
  ? JSON.parse(localStorage.getItem("toDoLists"))
  : [];

function save() {
  localStorage.setItem("toDoLists", JSON.stringify(toDoLists));
}

function addClass(el, cl) {
  el.classList.add(cl);
}

function removeClass(el, cl) {
  el.classList.remove(cl);
}
function switchClass(el, cl1, cl2) {
  addClass(el, cl1);
  removeClass(el, cl2);
}

let toDoListNameInput = document.querySelector(".to-do-list-name-input");
let toDoListContainer = document.querySelector(".to-do-lists");
let indexOfListBeingDsiplayed = document.querySelector(
  ".index-of-list-being-displayed",
);
let toDoListSection = document.querySelector(".to-do-list-section");
let toDoListNameInSection = document.querySelector(
  ".to-do-list-name-in-section",
);

let taskNameInput = document.querySelector(".task-name-input");

function createToDoList() {
  if (toDoListNameInput.value == "") {
    alert("Please Enter a list name");
  } else {
    toDoLists.push({
      name: toDoListNameInput.value,
      tasks: [],
    });

    save();
    displayToDos();

    toDoListNameInput.value = "";
  }
}

document.querySelector(".add-to-do-list-btn").addEventListener("click", () => {
  createToDoList();
});

toDoListNameInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    createToDoList();
  } else {
  }
});

let GTCA = "grid-template-columns_auto";

function displayToDos() {
  let toDoListsHtml = "";

  if (toDoLists.length == 1) {
    removeClass(toDoListContainer, GTCA + "-auto");
    removeClass(toDoListContainer, GTCA + "-auto-auto");

    addClass(toDoListContainer, GTCA);
  } else if (toDoLists.length == 2) {
    removeClass(toDoListContainer, GTCA);
    removeClass(toDoListContainer, GTCA + "-auto-auto");

    addClass(toDoListContainer, GTCA + "-auto");
  } else if (toDoLists.length >= 3) {
    removeClass(toDoListContainer, GTCA);
    removeClass(toDoListContainer, GTCA + "-auto");

    addClass(toDoListContainer, GTCA + "-auto-auto");
  } else if (toDoLists.length == 0) {
  } else {
    console.error("Error displaying grid template columns");
  }

  for (let i = 0; i < toDoLists.length; i++) {
    let amountOfCompleteItems = 0;

    for (let j = 0; j < toDoLists[i].tasks.length; j++) {
      if (toDoLists[i].tasks[j].isComplete == true) {
        amountOfCompleteItems += 1;
      } else {
      }
    }

    function listCompletionStatus(firstReturn, secondReturn, thirdReturn) {
      if (toDoLists[i].tasks.length == 0) {
        return firstReturn;
      } else if (amountOfCompleteItems == toDoLists[i].tasks.length) {
        return secondReturn;
      } else {
        return thirdReturn;
      }
    }

    toDoListsHtml += `
     <div title="Open To Do List ${listCompletionStatus("(There are no tasks)", "", "(Some tasks require your attention)")}" class="to-do-list ${listCompletionStatus("empty-list", "complete-list", "incomplete-list")}">
      <p class="to-do-list-name">${toDoLists[i].name}</p>
    <i class="fa fa-exclamation warning-icon" title="There are incomplete tasks" aria-hidden="true"></i>
    </div>`;
  }
  toDoListContainer.innerHTML = toDoListsHtml;

  document.querySelectorAll(".to-do-list").forEach((toDoListItem, i) => {
    toDoListItem.addEventListener("click", () => {
      displayTasks(i);
      indexOfListBeingDsiplayed.textContent = i;
      toDoListNameInSection.value =
        document.querySelectorAll(".to-do-list-name")[i].textContent;

      switchClass(toDoListSection, "display-block", "display-none");

      setTimeout(() => {
        switchClass(toDoListSection, "opacity-1", "opacity-0");
      }, 300);

      document.querySelector(".to-do-list-name-input").blur();
    });
  });
}

function closeToDoListSection() {
  switchClass(toDoListSection, "opacity-0", "opacity-1");

  setTimeout(() => {
    switchClass(toDoListSection, "display-none", "display-block");
  }, 500);

  document.querySelector(".tasks").innerHTML = "";
  taskNameInput.value = "";
  taskNameInput.blur();
}

document
  .querySelector(".close-to-do-list-section")
  .addEventListener("click", () => {
    closeToDoListSection();
    displayToDos();
  });

function createTask() {
  if (taskNameInput.value == "") {
    alert("Please Enter a task name");
  } else {
    toDoLists[parseInt(indexOfListBeingDsiplayed.textContent)].tasks.push({
      taskName: taskNameInput.value,
      isComplete: false,
    });

    save();

    taskNameInput.value = "";

    displayTasks(parseInt(indexOfListBeingDsiplayed.textContent));
  }
}

document.querySelector(".add-task-btn").addEventListener("click", () => {
  createTask();
});

taskNameInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    createTask();
  } else {
  }
});

function displayTasks(index) {
  let tasksHtml = "";
  for (let k = 0; k < toDoLists[index].tasks.length; k++) {
    const tasks = toDoLists[index].tasks;

    function taskCompletionStatus(fr, sr) {
      if (tasks[k].isComplete == true) {
        return fr;
      } else {
        return sr;
      }
    }

    tasksHtml += ` 
 <div class="task ${taskCompletionStatus("complete-task", "incomplete-task")}">
    <textarea spellcheck="false" title="Edit Task Name" class="task-name">${tasks[k].taskName}</textarea>
    <div class="complete-and-delete-container">
        <input title="${taskCompletionStatus("Change to Incomplete", "Complete Task")}" class="task-isComplete" type="checkbox" ${taskCompletionStatus("checked", "")} />
        <button title="Delete Task" title="Delete Task" class="delete-task">
            <i class="fa fa-square-minus" aria-hidden="true"></i>
        </button>
    </div>
    <p class="display-none task-id">${k}</p>
</div>`;
  }

  document.querySelector(".tasks").innerHTML = tasksHtml;

  activateEditListNameListeners();
  activateEditTaskListeners();
  activateCompleteListeners();
  activateDeleteListeners();
}

function activateEditListNameListeners() {
  toDoListNameInSection.addEventListener("input", (e) => {
    toDoLists[parseInt(indexOfListBeingDsiplayed.textContent)].name =
      toDoListNameInSection.value;
    save();
  });
}

function activateEditTaskListeners() {
  document.querySelectorAll(".task-name").forEach((taskName, i) => {
    taskName.addEventListener("input", (e) => {
      toDoLists[parseInt(indexOfListBeingDsiplayed.textContent)].tasks[
        i
      ].taskName = e.currentTarget.value;
      save();
    });
  });
}

function activateCompleteListeners() {
  document
    .querySelectorAll(".task-isComplete")
    .forEach((completeCheckbox, i) => {
      completeCheckbox.addEventListener("change", () => {
        if (completeCheckbox.checked) {
          toDoLists[parseInt(indexOfListBeingDsiplayed.textContent)].tasks[
            i
          ].isComplete = true;
        } else {
          toDoLists[parseInt(indexOfListBeingDsiplayed.textContent)].tasks[
            i
          ].isComplete = false;
        }

        save();
        displayToDos();
        displayTasks(parseInt(indexOfListBeingDsiplayed.textContent));
      });
    });
}

function activateDeleteListeners() {
  document.querySelectorAll(".delete-task").forEach((deleteTask, i) => {
    deleteTask.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this task?") == true) {
        toDoLists[parseInt(indexOfListBeingDsiplayed.textContent)].tasks.splice(
          i,
          1,
        );
        save();
        displayTasks(parseInt(indexOfListBeingDsiplayed.textContent));
      } else {
      }
    });
  });
}

document
  .querySelector(".delete-to-do-list-btn")
  .addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this list?") == true) {
      toDoLists.splice(parseInt(indexOfListBeingDsiplayed.textContent), 1);
      save();
      displayToDos();
      closeToDoListSection();
    } else {
    }
  });

displayToDos();

document.querySelector("h1").addEventListener("click", () => {
  location.reload();
});

let lightOrDarkModeSelector = document.querySelector(
  ".light-or-dark-mode-selector",
);
let lightOrDarkModeButtonContainer = document.querySelector(
  ".light-or-dark-mode-button-container",
);

lightOrDarkModeSelector.addEventListener("click", () => {
  if (lightOrDarkModeButtonContainer.classList.contains("display-none")) {
    switchClass(
      lightOrDarkModeButtonContainer,
      "display-light-or-dark-mode-buttons",
      "display-none",
    );
  } else {
    switchClass(
      lightOrDarkModeButtonContainer,
      "display-none",
      "display-light-or-dark-mode-buttons",
    );
  }
});

function systemDefalutHtml() {
  lightOrDarkModeSelector.innerHTML = `
      <i class="fa-solid fa-circle-half-stroke" aria-hidden="true"></i>
      <span class="mode-label">System Default</span>`;
}

function lightHtml() {
  lightOrDarkModeSelector.innerHTML = `
      <i class="fa-regular fa-sun" aria-hidden="true"></i>
      <span class="mode-label">Light Mode</span>`;
}

function darkHtml() {
  lightOrDarkModeSelector.innerHTML = `
      <i class="fa-regular fa-moon" aria-hidden="true"></i>
      <span class="mode-label">Dark Mode</span>`;
}

function lightMode() {
  document.body.style.colorScheme = "light";
  switchClass(document.body, "light-mode", "dark-mode");
}

function darkMode() {
  document.body.style.colorScheme = "dark";
  switchClass(document.body, "dark-mode", "light-mode");
}

function pageMode() {
  const pageTheme = localStorage.getItem("Theme");
  if (pageTheme == "light") {
    lightHtml();
    lightMode();
  } else if (pageTheme == "dark") {
    darkHtml();
    darkMode();
  } else {
    systemDefalutHtml();
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      darkMode();
    } else {
      lightMode();
    }
  }
}

document.querySelector(".system-default").addEventListener("click", () => {
  localStorage.removeItem("Theme");
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    darkMode();
  } else {
    lightMode();
  }
  systemDefalutHtml();
});

document.querySelector(".light-mode").addEventListener("click", () => {
  localStorage.setItem("Theme", "light");
  lightMode();
  lightHtml();
});

document.querySelector(".dark-mode").addEventListener("click", () => {
  localStorage.setItem("Theme", "dark");
  darkMode();
  darkHtml();
});

pageMode();
