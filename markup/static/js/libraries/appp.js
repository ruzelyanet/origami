const optionsBox = document.querySelector('.options');

let boxOptionData = null;
const transfer = document.querySelector('.options-transfer');
transfer.hidden = true;

let currentDroppable = null;
let clonePath = null;
let cssClasses;

let targetMouseDownItem = null;

let shiftX;
let shiftY;

document.addEventListener('mousedown', function (event) {
    if (event.target.className.includes('option-box')) {
        cssClasses = event.target.classList;

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

function enterDroppable(elem) {
    elem.classList.add('matrix-path-marker');
}

function leaveDroppable(elem) {
    elem.classList.remove('matrix-path-marker');
}
