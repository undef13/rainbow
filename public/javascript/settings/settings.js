const inputs = document.querySelectorAll(".modal-body input");
const buttons = document.querySelectorAll(".modal-footer .btn-primary");

const initialGivenName = inputs[0].value;
const initialFamilyName = inputs[1].value;

const check = () => {    
    if(inputs[0].value.trim() == initialGivenName && inputs[1].value.trim() == initialFamilyName) {
        buttons[0].disabled = true;
    } else {
        buttons[0].disabled = false;
    }
}

inputs[0].addEventListener('input', check);
inputs[1].addEventListener('input', check);
