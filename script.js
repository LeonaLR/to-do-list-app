// Select the elements
const clear = document.querySelector(".clear");
const dateElement = document.querySelector("#date");
const list = document.querySelector("#list");
const input = document.querySelector("#input");
const header = document.querySelector(".header"); // for pictures change

// Variables
let LIST = []; // Data stored
let id;
const images = [
    'img/bg1.jpg',
    'img/bg2.jpg',
    'img/bg3.jpg',
    'img/bg4.jpg'
];

// Class names
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

// Change background images automatically
let currentIndex = 0;
function changeBackground() {
    header.style.backgroundImage = `url(${images[currentIndex]})`;
    currentIndex = (currentIndex + 1) % images.length; // Loop back to the first image
}

// Change background every 5 seconds (5000 milliseconds)
setInterval(changeBackground, 5000);
// Initial call to set the first background
changeBackground();

// Show today's date
const options = { weekday: "long", month: "short", day: "numeric" };
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

// Data Storage
let data = localStorage.getItem("TODO");
if (data) {
    // Load data that already have
    LIST = JSON.parse(data);
    id = LIST.length > 0 ? LIST.length : 0; // Set the id to the next new to-do item's id
    loadList(LIST); // Load list to UI
} else {
    // Empty: create data array:
    LIST = [];
    id = 0;
}

function loadList(dataArray) {
    dataArray.forEach((eachObject) => {
        addToDo(eachObject.name, eachObject.id, eachObject.done, eachObject.trash);
    });
}

// Clear local storage
clear.addEventListener("click", function () {
    localStorage.clear();
    location.reload();
});

function addToDo(toDo, id, done, trash) {
    if (trash) return;

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const position = "beforeend";

    const item = `<li class="item">
                        <i class="fa ${DONE} co" data-job="complete" id="${id}"></i>
                        <p class="text ${LINE}" id="text-${id}">${toDo}</p>
                        <i class="fa fa-edit edit" data-job="edit" id="${id}"></i>
                        <i class="fa fa-trash-o de" data-job="delete" id="${id}"></i>
                    </li>`;

    list.insertAdjacentHTML(position, item);

    // Add click event listener for the text area to toggle line-through effect
    const textElement = document.querySelector(`#text-${id}`);

    textElement.addEventListener("click", function () {
        completeToDo(this.previousElementSibling); // Toggle using the corresponding icon <i>
    });
}

function editToDo(id) {
    const textElement = document.querySelector(`#text-${id}`);
    const currentText = textElement.textContent; // Get current text

    // Prompt user for new text
    const newText = prompt("Edit your task", currentText);

    // If user enters new text, update it
    if (newText !== null && newText.trim() !== "") {
        textElement.textContent = newText; // Update displayed text

        // Update LIST array with new value
        LIST[id].name = newText;
        // Update local storage
        localStorage.setItem("TODO", JSON.stringify(LIST));
    }
}

// Event delegation for dynamic elements: because <li></li> are dynamic:
list.addEventListener("click", function (e) {
    if (!e.target.dataset.job) return; // Check if job attribute exists

    const elementJob = e.target.dataset.job;

    if (elementJob === "complete") {
        completeToDo(e.target);
    } else if (elementJob === "delete") {
        removeToDo(e.target);
    } else if (elementJob === "edit") {
        editToDo(e.target.id); // Pass the ID of the item being edited
    }

    localStorage.setItem("TODO", JSON.stringify(LIST)); // Update local storage after any change
});

document.addEventListener("keyup", function (e) {
    if (e.key === "Enter") { // Check if the Enter key was pressed
        const toDo = input.value.trim();
        if (toDo === "") return; // Prevent adding empty tasks

        addToDo(toDo, id, false, false);
        LIST.push({
            name: toDo,
            id: id,
            done: false,
            trash: false
        });
        localStorage.setItem("TODO", JSON.stringify(LIST)); // Update data storage every time an item is added/removed
        id++;

        input.value = ""; // Clear input field after adding task
    }
});

function completeToDo(element) {
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);

    const textElement = element.parentNode.querySelector(".text");
    textElement.classList.toggle(LINE_THROUGH);

    LIST[element.id].done = !LIST[element.id].done; // Toggle done status in LIST array
}

function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true; // Mark as trash instead of removing from array
}













