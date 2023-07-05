const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const itemList = document.querySelector("#item-list");
const filterItems = document.querySelector("#filter");
const clearBtn = document.querySelector("#clear");

function addItem(e) {
  e.preventDefault();
  console.log("submit");

  const newItem = itemInput.value;
  // console.log(newItem);

  if (newItem === "") {
    alert("Please enter an item");
    return;
  }

  const li = document.createElement("li");
  li.appendChild(document.createTextNode(newItem));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  itemList.appendChild(li);
  itemInput.value = "";
  checkUI();
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

function removeItem(e) {
  // if (e.target.parentElement.classList.contains("remove-item")) {
  if (e.target.className === "fa-solid fa-xmark") {
    e.target.parentElement.parentElement.remove();
    checkUI();
  }
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  checkUI();
}

function checkUI() {
  const numberOfItems = itemList.childElementCount;
  // const numberOfItems = document.querySelectorAll("li").length;
  if (numberOfItems === 0) {
    filterItems.style.display = "none";
    clearBtn.style.display = "none";
  } else {
    filterItems.style.display = "block";
    clearBtn.style.display = "block";
  }
}

// Event Listeners
itemForm.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
itemList.addEventListener("click", removeItem);

checkUI();
