const form =  document.querySelector('form');
const name =  document.querySelector('#name');
const cost =  document.querySelector('#cost');
const error =  document.querySelector('#error');


// ----- HELPER FUNCTIONS ----- //
const isInputValid = () => {
    if (!name.value || !cost.value) {
        return false;
    }

    return true;
}

const putErrorMessage = (msg) => {
    error.textContent = msg;

    setTimeout(() => {
        error.textContent = '';
    }, 3000)
}

const clearFields = () => {
    name.value = '';
    cost.value = '';
}


// ----- EVENT FUNCTIONS ----- //
const addItem = e => {
    e.preventDefault();

    if (isInputValid()) {
        const item = {
            name: name.value,
            cost: Number(cost.value)
        };

        db.collection('expenses').add(item)
            .then(res => clearFields())
            .catch(err => console.log(err))




    } else {
        putErrorMessage('Please fill all fields');
    }

}

form.addEventListener('submit', addItem);
