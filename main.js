const $cardHeaders = document.querySelectorAll(".card-header");
const $cards = document.querySelectorAll(".card");

let layout = [true, true, true, true];
let convertedPageWidth = [4];
let clickHistory = [0, 1, 2, 3];

// Card renderig proxy
const renderCards = {
    set: (target, property, value) => {
        target[property] = value;
        layout.forEach((item, index) => {
            if (item) {
                $cards[index].classList.remove("closed");
                $cards[index].classList.add("open");
            } else {
                $cards[index].classList.add("closed");
                $cards[index].classList.remove("open");
            }
        });
    },
};

let layoutProxy = new Proxy(layout, renderCards);

const widthChangeHendler = {
    set: (target, property, value) => {
        target[property] = value;
        openCloseCards();
    },
};

let widthProxy = new Proxy(convertedPageWidth, widthChangeHendler);

// Close with click
const clickHandler = (index) => {
    layoutProxy[index] = !layoutProxy[index];
    if (layoutProxy[index]) {
        let idx = clickHistory.indexOf(index);
        clickHistory.splice(idx, 1);
        clickHistory.unshift(index);
    }
    openCloseCards();
};

$cardHeaders.forEach((item, index) =>
    item.addEventListener("click", function () {
        clickHandler(index);
    })
);

// close with pade width
const getConvertedPageWidth = () => {
    let w = window.innerWidth;
    if (w < 700) {
        widthProxy[0] = 1;
    } else if (w < 950) {
        widthProxy[0] = 2;
    } else if (w < 1200) {
        widthProxy[0] = 3;
    } else {
        widthProxy[0] = 4;
    }
};

window.addEventListener("resize", getConvertedPageWidth);
window.addEventListener("load", getConvertedPageWidth);

const openCloseCards = () => {
    Object.keys(layoutProxy).forEach((item) => (layoutProxy[item] = false));
    clickHistory
        .slice(0, convertedPageWidth)
        .forEach((item) => (layoutProxy[item] = true));
};

