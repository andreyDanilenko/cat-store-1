const container = document.getElementById("products-row");
let items = Array.from(container.children);
const sortControls = document.querySelectorAll(".sort-control");

let sortKey = null;
let sortDirection = "down";

logCurrentState();

sortControls.forEach(control => {
  const key = control.dataset.sortKey;

  control.addEventListener('click', () => sort(key));
})

function sort(key) {

  if (sortKey && sortKey === key) reverseSortDirection();
  sortKey = key;

  items = items.sort((a, b) => {
    if (sortDirection === "up") {
      const c = a;
      a = b;
      b = c;
    }
    return getKeyValue(a, sortKey) - getKeyValue(b, sortKey);
  });

  items.forEach(item => container.appendChild(item));

  sortControls.forEach(applyCurrentStateToControl);

  logCurrentState();
}

function applyCurrentStateToControl(control) {
  const sortedClass = "sort-control--sorted";

  control.setAttribute("class", "sort-control");

  if (sortKey === control.dataset.sortKey) {
    control.classList.add(sortedClass);
  }

  control.classList.add(`sort-control--${sortDirection}`);
}

function reverseSortDirection() {
  sortDirection = "down" === sortDirection ? "up" : "down";
}

function logCurrentState() {
  console.log(`Key: ${sortKey}; Direction: ${sortDirection};`);
}

function getKeyValue(element, key) {
  return +element.firstElementChild.getAttribute(`data-${key}`);
}






