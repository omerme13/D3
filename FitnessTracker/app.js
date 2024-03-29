const buttons = document.querySelectorAll('button');
const form = document.querySelector('form');
const formActivity = document.querySelector('form span');
const input = document.querySelector('input');
const error = document.querySelector('.error');

var curAct = 'cycling'; // i used var because of scope, i need to use it inside a function and in the other file 

// ----- HELPER FUNCTIONS ----- //
const putErrorMessage = msg => {
    error.textContent = msg;

    setTimeout(() => {
        error.textContent = "";
    }, 3000)
}

const activateButton = e => {
    for (let btn of buttons) {
        btn.classList.remove("active");
    }
    e.target.classList.add("active");
}

// ----- EVENT FUNCTIONS ----- //
const HandleButton = e => {
    curAct = e.target.dataset.activity; // we manage to get the data because of the html 'data-****'
    input.setAttribute('id', curAct);
    formActivity.textContent = curAct;
    activateButton(e);

    update(data);
}

const handelForm = e => {
    const distance = Number(input.value);
    const item = {
        activity: input.id,
        distance,
        date: new Date().toString()
    }

    if (distance && typeof distance === 'number') {
        db.collection('activities').add(item)
            .then(() => input.value = '')
            .catch(err => console.log(err))
    } else {
        putErrorMessage("Please enter a valid distance");
    }

    e.preventDefault();
}


// ----- EVENT LISTENERS ----- //
for (let btn of buttons) {
    btn.addEventListener('click', HandleButton);
}

form.addEventListener('submit', handelForm)


