
//select the elements
const clear = document.querySelector(".clear")
const dateElement = document.querySelector("#date")
const list = document.querySelector("#list")
const input = document.querySelector("#input")
const header = document.querySelector(".header")//for pictures change



//Variables:
let LIST = [] //data stored
let id
const images =[
    'img/bg1.jpg',
    'img/bg2.jpg',
    'img/bg3.jpg',
    'img/bg4.jpg'
]

//Classes names
const CHECK = "fa-check-circle"
const UNCHECK = "fa-circle-thin"
const LINE_THROUGH = "lineThrough"


//change background images automatically:
let currentIndex = 0
function changeBackground(){
    header.style.backgroundImage = `url(${images[currentIndex]})`
    currentIndex = (currentIndex + 1) % images.length// Loop back to the first image
}

// Change background every 5 seconds (5000 milliseconds)
setInterval(changeBackground, 5000)
// Initial call to set the first background
changeBackground()


    
//show today's date:
const options = {weekday:"long", month:"short", day:"numeric"}
const today = new Date()
dateElement.innerHTML = today.toLocaleDateString("en-US", options)


//Data Storage:
let data = localStorage.getItem("TODO");
if (data){
    //load data that already have
    LIST = JSON.parse(data)
    id = LIST.length > 0 ? LIST.length : 0 // set the id to the next new to-do item's id
    loadList(LIST)//load list to UI
}else{
    //empty: create data array:
    LIST = []
    id = 0
}

function loadList(dataArray){
    dataArray.forEach((eachObject)=>{
        addToDo(eachObject.name, eachObject.id, eachObject.done, eachObject.trash)
    })
}

//clear local storage
clear.addEventListener("click", function (){
    localStorage.clear()
    location.reload()
})


function addToDo(toDo, id, done, trash) {
    
    if (trash) return
    
    const DONE = done ? CHECK : UNCHECK
    const LINE = done ? LINE_THROUGH : ""

    const position = "beforeend"

    const item = `<li class="item">
                        <i class="fa ${DONE} co" data-job="complete" id="${id}"></i>
                        <p class="text ${LINE}" id="text-${id}" >${toDo}</p>
                        <i class="fa fa-trash-o de" data-job="delete" id="${id}"></i>
                    </li>`

    list.insertAdjacentHTML(position, item)
    
    //add click event listener to the text area, to toggle the lineThrough effect:
    const textElement = document.querySelector(`#text-${id}`);
    
    textElement.addEventListener("click", function (){
        completeToDo(this.previousElementSibling)// Toggle using the corresponding icon <i>
    })
}





document.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {// Check if the Enter key was pressed
        const toDo = input.value.trim()
        if (toDo === "") return // Prevent adding empty tasks

            addToDo(toDo, id, false, false)
            LIST.push({
                name: toDo,
                id: id,
                done: false,
                trash: false
            })
            localStorage.setItem("TODO", JSON.stringify(LIST)) //update data storage everytime add/delete an item
            id++

        input.value = "" // Clear input field after adding task
    }
})


function completeToDo(element) {
    element.classList.toggle(CHECK)
    element.classList.toggle(UNCHECK)
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH)

    LIST[element.id].done = LIST[element.id].done ? false : true
}

function removeToDo(element) {
        element.parentNode.parentNode.removeChild(element.parentNode)
        LIST[element.id].trash = true // Mark as trash instead of removing from array
}




// Event delegation for dynamic elements : because <li></li> are dynamic:
list.addEventListener("click", function (e) {
    if (!e.target.dataset.job) return // Check if job attribute exists

    const elementJob = e.target.dataset.job
    if (elementJob === "complete") {
        completeToDo(e.target)
    } else if (elementJob === "delete") {
        removeToDo(e.target)
    }

    localStorage.setItem("TODO", JSON.stringify(LIST)) // Update local storage after any change
})












