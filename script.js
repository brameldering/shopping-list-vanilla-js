const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const addItemButton = itemForm.querySelector(".btn");
const itemList = document.querySelector("#item-list");
const itemFilter = document.querySelector("#filter");
const clearBtn = document.querySelector("#clear");

let inEditMode = false;
let selectedItemForEdit = "";

// Returns array with list of items in localStorage
function getItemsFromStorage() {
  const itemsInStorage = localStorage.getItem("items");
  if (itemsInStorage) {
    return JSON.parse(itemsInStorage);
  } else {
    return [];
  }
}

function displayItems() {
  clearItemsFromDOM();
  const items = getItemsFromStorage();
  items.forEach((item) => addItemToDOM(item));
  resetUI();
}

// ======== Add Item ========

function onAddItem(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  if (newItem === "") {
    alert("Please enter an item");
    return;
  }

  if (inEditMode) {
    const itemToEdit = itemList.querySelector(".edit");
    removeItemFromStorage(itemToEdit.textContent);
    removeItemFromDOM(itemToEdit);
    inEditMode = false;
  }

  if (itemAlreadyExists(newItem)) {
    alert("Item already exists");
    return;
  }
  addItemToDOM(newItem);
  addItemToStorage(newItem);

  resetUI();
}

function itemAlreadyExists(item) {
  const allDOMItems = document.querySelector("#item-list").children;
  const matchingItem = Array.from(allDOMItems).filter((i) => i.textContent === item);
  return matchingItem.length > 0;
}

function addItemToDOM(itemName) {
  const li = document.createElement("li");
  li.className = "shopping-list-item";
  li.appendChild(document.createTextNode(itemName));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  itemList.appendChild(li);
}

function addItemToStorage(itemName) {
  const items = getItemsFromStorage();
  const lowerCaseItems = items.map((item) => item.toLowerCase());

  if (lowerCaseItems.includes(itemName.toLowerCase())) return;
  items.push(itemName);
  localStorage.removeItem("items");
  localStorage.setItem("items", JSON.stringify(items));
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

// ======== Remove Item ========

function onClickItem(e) {
  if (e.target.className === "fa-solid fa-xmark") {
    const item = e.target.parentElement.parentElement;
    removeItemFromDOM(item);
    // console.log(item.textContent);
    removeItemFromStorage(item.textContent);
    resetUI();
  } else {
    if (e.target.className === "shopping-list-item") {
      inEditMode = true;
      // Remove all existing edit modes if any
      itemList.querySelectorAll("li").forEach((i) => i.classList.remove("edit"));
      // Set selected item to edit mode
      e.target.classList.add("edit");
      itemInput.classList.add("edit");
      addItemButton.classList.add("edit");
      addItemButton.innerHTML = `<i class = "fa-solid fa-edit"></i> Replace Item`;
      selectedItemForEdit = e.target.textContent;
      itemInput.value = selectedItemForEdit;
    }
  }
}

function removeItemFromDOM(itemName) {
  itemName.remove();
}

function removeItemFromStorage(itemName) {
  let items = getItemsFromStorage();
  items = items.filter((item) => item != itemName);
  localStorage.setItem("items", JSON.stringify(items));
}

// ======== Clear Items ========

function onClearItems() {
  clearItemsFromDOM();
  clearItemsFromStorage();
  resetUI();
}

function clearItemsFromDOM() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
}

function clearItemsFromStorage() {
  localStorage.removeItem("items");
}

// ======== Other functions ========

function applyFilter(e) {
  const filterText = e.target.value.toLowerCase();
  const itemListChildren = itemList.querySelectorAll("li");
  itemListChildren.forEach((item, index) => {
    if (!item.innerText.toLowerCase().includes(filterText)) {
      item.style.display = "none";
    } else {
      item.style.display = "flex";
    }
  });
}

function resetUI() {
  itemInput.value = "";
  const numberOfItems = document.querySelectorAll("li").length;
  if (numberOfItems === 0) {
    itemFilter.style.display = "none";
    clearBtn.style.display = "none";
  } else {
    itemFilter.style.display = "block";
    clearBtn.style.display = "block";
  }
  // remove all edit modes
  itemInput.classList.remove("edit");
  addItemButton.classList.remove("edit");
  inEditMode = false;
  addItemButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
}

function init() {
  // Event Listeners
  itemForm.addEventListener("submit", onAddItem);
  clearBtn.addEventListener("click", onClearItems);
  itemList.addEventListener("click", onClickItem);
  itemFilter.addEventListener("input", applyFilter);
  document.addEventListener("DOMContentLoaded", displayItems);

  resetUI();
}

init();
