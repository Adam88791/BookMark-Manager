const firstUse = document.querySelector('.first-use');
const firstuseItems = document.querySelectorAll('.book-item');
// get the content section (div)
const contentSection = document.querySelector(".content");
// get the input fields section (div)
const inputsSection = document.querySelector(".inputElementSection");
// get the add button
const addButton = document.querySelector(".addButton");
addButton.addEventListener("click" , () => {
    inputsSection.classList.add("active");
    inputsSection.querySelector(".save-button").innerHTML = "Save";
    titleInput.value = "";
    urlInput.value = "";
    contentInput.value = "";
})

// theme switch button 
let switching = document.querySelector(".switch");
let modes = document.querySelectorAll(".mode");
let nightIcon = document.querySelector(".fa-moon");
let ligthIcon = document.querySelector(".fa-sun");

switching.addEventListener("click" , () => {
    switching.classList.toggle("active");
    nightIcon.classList.toggle("hidden");
    ligthIcon.classList.toggle("hideafter");
    modes.forEach(mode => {
        mode.classList.toggle("light");
    })
})

// get save and cancel buttons
const cancelButton = document.querySelector(".cancel-button");
const saveButton = document.querySelector(".save-button");
// save and cancel buttons functionality
cancelButton.addEventListener("click" , () => {
    inputsSection.classList.remove("active");
})

saveButton.addEventListener("click" , () => {
    if (!inputsAreValid()) return;
    inputsSection.classList.remove("active");
    saveFunction();
})

// set first use functionaliyt
if(firstuseItems.length === 0) {
    firstUse.classList.remove('disable');
} else {
    firstUse.classList.add('disable');
};





// The main function to create the bookmark Element
function bookMarkCreator(bookmark) {


    // create the bookmark main element
    const bookItem = document.createElement("div");
    bookItem.classList.add("book-item");
    bookItem.classList.add("mode");
    bookItem.dataset.id = bookmark.id;
    if(switching.classList.contains("active")) {
        bookItem.classList.add("ligth");
    }


    // create the bookmark first chilled (book info , title & url)
    const bookInfo = document.createElement("div");
    bookInfo.classList.add("book-info");
    const bookInfoTitle = document.createElement("h3");
    bookInfoTitle.innerHTML = bookmark.title ;
    bookInfo.addEventListener("click" , () => {
        window.open(bookmark.url, "_blank");
    })

    bookInfo.append(bookInfoTitle);

    // append the bookinfo to the main element
    bookItem.append(bookInfo);

    // create the bookmark seconde chilled (icons and shortcuts)
    const bookActions = document.createElement("div");
    bookActions.classList.add("book-actions");
    const markButton = document.createElement("button");
    markButton.classList.add("mark-btn");
    markButton.innerHTML = '<i class="fa-solid fa-bookmark"></i>';

    const shortButton = document.createElement("button");
    shortButton.classList.add("short-btn");
    shortButton.innerHTML = '<i class="fa-solid fa-list"></i>';
    bookActions.append(markButton);
    bookActions.append(shortButton);
    // append the bookactions to the main element
    bookItem.append(bookActions);

    shortButton.addEventListener("click" , () => {
        document.querySelectorAll(".shortcut").forEach(shortcut => {
            shortcut.classList.remove("active");
        })
        createShortcut(bookmark.title , bookmark.url , bookmark.content , bookmark.id);
    })

    // append the element to the cpntent section
    contentSection.prepend(bookItem);
}





// ***** \\
// the function that get the value from the inputs and call the bookmarkCreate and savetolocalstorage functions
// get inputs (title , url , content)
let titleInput = document.querySelector("#title-input");
let urlInput = document.querySelector("#url-input");
let contentInput = document.querySelector("#content-input");


// helper: validate inputs are not empty
function inputsAreValid() {
    if (!titleInput.value.trim() || !urlInput.value.trim() || !contentInput.value.trim()) {
        alert("Please fill in all fields before saving.");
        return false;
    }
    return true;
}


// the function
function saveFunction(e){

    // if (urlInput.value == "" || titleInput.value == "" || contentInput.value == "") {
    //     e.preeve
    // }
    
    const id = Date.now();
    const titleValue = titleInput.value;
    const urlValue = urlInput.value;
    const contentValue = contentInput.value;

    let bookmark = {
        id,
        title:titleValue,
        url:urlValue,
        content:contentValue
    }

    bookMarkCreator(bookmark);
    savetolocalstorage(bookmark);
    checkFirstUse();
}





// ***** \\
// function that responsable to save in local storage
function savetolocalstorage(bookmark) {
    const bookMarksArray = JSON.parse(localStorage.getItem("bookmarks")) || [];

    bookMarksArray.push(bookmark);
    localStorage.setItem("bookmarks" , JSON.stringify(bookMarksArray));
} 






// ***** \\
// function that responsable to load from local storage

window.addEventListener("load" , () => {
    loadFromLocalstorage();
    checkFirstUse();
});

function loadFromLocalstorage() {

    let getedArray = JSON.parse(localStorage.getItem("bookmarks"));
    getedArray.forEach(bookmark => {
        bookMarkCreator(bookmark);
    })
}






// ******* \\
// Function to create a shortcut/bookmark dynamically
function createShortcut(titleText, linkUrl, contentText , id){
    // Create the main div
    const shortcutDiv = document.createElement("div");
    shortcutDiv.classList.add("shortcut" , "active" , "mode");

    // Close button
    const closeBtn = document.createElement("i");
    closeBtn.classList.add("fa-solid", "fa-xmark", "close-btn");
    closeBtn.addEventListener("click", () => {
        shortcutDiv.remove();
    });
    shortcutDiv.appendChild(closeBtn);

    // Title
    const title = document.createElement("h1");
    title.textContent = titleText;
    shortcutDiv.appendChild(title);

    // Link
    const link = document.createElement("a");
    link.classList.add("mode")
    link.href = linkUrl;
    link.textContent = linkUrl;
    link.target = "_blank";
    shortcutDiv.appendChild(link);

    // Description
    const paragraph = document.createElement("p");
    paragraph.classList.add("mode")
    paragraph.textContent = contentText;
    shortcutDiv.appendChild(paragraph);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delet-btn");
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash");
    deleteBtn.appendChild(deleteIcon);

    // Delet item from localstorage and page when delet button is clicked

    deleteBtn.addEventListener("click", () => {
        let deleFromLSArray = JSON.parse(localStorage.getItem("bookmarks") || [])
        deleFromLSArray = deleFromLSArray.filter((ele) => ele.id !== id );
        localStorage.setItem("bookmarks" , JSON.stringify(deleFromLSArray));
        const deletParentDiv = document.querySelectorAll(".book-item");
        deletParentDiv.forEach( parent => {
            if(parent.dataset.id == id) {
                parent.remove();
            }
        })
        shortcutDiv.classList.remove("active");
        checkFirstUse();
    });

    shortcutDiv.appendChild(deleteBtn);

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid", "fa-pen-to-square");
    editBtn.appendChild(editIcon);

    // Edit item in localstorage and page when the edit button is clicked

    editBtn.addEventListener("click", () => {
        inputsSection.classList.add("active");
        const editFormButton = inputsSection.querySelector(".edit-button");
        inputsSection.querySelector(".save-button").style.display = "none";
        editFormButton.style.display = "block";

        titleInput.value = titleText;
        urlInput.value = linkUrl;
        contentInput.value = contentText;

        // replace handler to avoid duplicate listeners
        editFormButton.onclick = () => {
            if (!inputsAreValid()) return;
            editElemnt(titleInput.value , urlInput.value , contentInput.value , id);
            inputsSection.classList.remove("active");
        }

    });

    shortcutDiv.appendChild(editBtn);

    // Append the shortcut to the content container
    contentSection.appendChild(shortcutDiv);

}






// ******
// function that will handel the edit future 

function editElemnt(title , url , content , id) {
    let editFromLSAraay = JSON.parse(localStorage.getItem("bookmarks"));

    editFromLSAraay = editFromLSAraay.map( (ele) => {
        if (ele.id == id) {
            ele.title = title;
            ele.content = content;
            ele.url = url;
        }

        return ele;
    });

    localStorage.setItem("bookmarks" , JSON.stringify(editFromLSAraay));

    location.reload();
}





// ******
// function that will check the first use

function checkFirstUse() {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (bookmarks.length === 0) {
        firstUse.classList.remove("disable");
    } else {
        firstUse.classList.add("disable");
    }
}


