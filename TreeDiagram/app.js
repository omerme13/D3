const modal = document.querySelector('#modal');
M.Modal.init(modal);

const error = document.querySelector('.error');
const form = document.querySelector('form');
const name = document.querySelector('#name');
const parent = document.querySelector('#parent');
const department = document.querySelector('#department');

// ----- HELPER FUNCTIONS ----- //
const putErrorMessage = msg => {
    error.textContent = msg;

    setTimeout(() => {
        error.textContent = '';
    }, 3000)
}

// ----- EVENT FUNCTIONS ----- //
const handleSubmit = e => {
    e.preventDefault();
    
    const item = {
        name: name.value,
        parent: parent.value,
        department: department.value,
    }
    
    if (item.name && item.department && item.parent) {
        db.collection('employees').add(item);
        var instance = M.Modal.getInstance(modal);
        instance.close();
        form.reset();
    } else {
        putErrorMessage('please fill all fields');
    }
}

// ----- EVENT LISTENERS ----- //
form.addEventListener('submit', handleSubmit);