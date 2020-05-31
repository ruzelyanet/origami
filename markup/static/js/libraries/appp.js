// data
const data = {
  rotate: false,
  grid: {
    x: 2,
    y: 2,
  },
  data: [
    {
      color: ['blue', 'yellow'],
      rotate: 0,
    },
    {
      color: ['blue', 'yellow'],
      rotate: 45,
    },
    {
      color: ['blue'],
      rotate: null,
    },
    {
      color: ['yellow'],
      rotate: null,
    },
    {
      color: ['blue', 'yellow'],
      rotate: 90,
    },
    {
      color: ['blue', 'yellow'],
      rotate: 135,
    },
  ],
};

// main variables
const optionsBox = document.querySelector('.options');
const matrix = document.getElementById('matrix');

// build data boxes
function prepareVueOptions(data) {
  // -- create options-array
  const optionsArray = [];

  // -- loop add options in options-array
  for (var i = 0; i < data.data.length; i++) {
    const even = (el) => JSON.stringify(el.color) === JSON.stringify(data.data[i].color);

    if (!optionsArray.some(even)) {
      optionsArray.push(data.data[i]);
    }
  }

  // -- loop vue options path
  for (var i = 0; i <= optionsArray.length - 1; i++) {
    const data = JSON.stringify(optionsArray[i]);

    const itemOptionsPath = document.createElement('div');
    itemOptionsPath.classList.add('options-item');

    const optionsPath = document.createElement('div');

    optionsPath.setAttribute('data-data', data);
    optionsPath.classList.add('option-box', 'option-data');

    let colorClass =
      `-${optionsArray[i].color[0]}` + (optionsArray[i].color[1] ? `-${optionsArray[i].color[1]}` : '');

    optionsPath.classList.add(`option-box${colorClass}`);

    itemOptionsPath.appendChild(optionsPath);

    optionsBox.appendChild(itemOptionsPath);
  }
}
prepareVueOptions(data);

// build matrix
function buildMatrix(data) {
  const size = data.grid.x * data.grid.y;

  matrix.classList.add(`matrix-${data.grid.x}`);

  for (var i = 0; i < size; i++) {
    const matrixPath = document.createElement('div');
    matrixPath.classList.add('matrix-path');

    matrix.appendChild(matrixPath);
  }
}
buildMatrix(data);

// drag and drop boxes
let boxOptionData = null;

const transfer = document.querySelector('.options-transfer');
transfer.hidden = true;

let currentDroppable = null;
let clonePath = null;

let targetMouseDownItem = null;

let shiftX;
let shiftY;

document.addEventListener('mousedown', function (event) {
  if (event.target.className.includes('option-box')) {
    let cssClasses = event.target.classList;

    boxOptionData = JSON.parse(event.target.getAttribute('data-data'));
    transfer.hidden = false;

    targetMouseDownItem = event.target;

    clonePath = targetMouseDownItem.cloneNode();

    clonePath.classList.add('option-stuck');
    clonePath.classList.remove('option-data');

    transfer.classList = cssClasses;
    transfer.classList.remove('option-data');
    transfer.classList.add('options-transfer');

    transfer.setAttribute('data-data', JSON.stringify(boxOptionData));

    shiftX = event.clientX - event.target.getBoundingClientRect().left;
    shiftY = event.clientY - event.target.getBoundingClientRect().top;

    moveAt(event.pageX, event.pageY);

    document.addEventListener('mousemove', onMouseMove);
  }
});

document.addEventListener('mouseup', function (event) {
  if (!clonePath) return;
  document.removeEventListener('mousemove', onMouseMove, false);

  if (!currentDroppable) {
    const marker = document.querySelector('matrix-path-marker');
    if (marker) {
      marker.classList.remove('matrix-path-marker');
    }
  }

  transfer.removeAttribute('style');
  transfer.classList = 'options-transfer';

  const matrixPath = event.target.closest('.matrix-path');

  if (matrixPath) {
    matrixPath.innerHTML = '';
    matrixPath.append(clonePath);
  }

  boxOptionData = null;
  optionsBox.onmouseup = null;

  clonePath = null;
  targetMouseDownItem = null;

  currentDroppable = null;
});

function moveAt(pageX, pageY) {
  transfer.style.left = pageX - shiftX + 'px';
  transfer.style.top = pageY - shiftY + 'px';
}

function onMouseMove(event) {
  moveAt(event.pageX, event.pageY);

  transfer.hidden = true;
  let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
  transfer.hidden = false;

  if (!elemBelow) return;

  if (targetMouseDownItem.classList.contains('option-stuck')) {
    targetMouseDownItem.remove();
  }

  let droppableBelow = elemBelow.closest('.matrix-path');

  if (currentDroppable != droppableBelow) {
    if (currentDroppable) {
      // null when we were not over a droppable before this event
      leaveDroppable(currentDroppable);
    }

    currentDroppable = droppableBelow;

    if (currentDroppable) {
      // null if we're not coming over a droppable now
      // (maybe just left the droppable)
      enterDroppable(currentDroppable);
    }
  }
}

function enterDroppable(elem) {
  elem.classList.add('matrix-path-marker');
}

function leaveDroppable(elem) {
  elem.classList.remove('matrix-path-marker');
}
