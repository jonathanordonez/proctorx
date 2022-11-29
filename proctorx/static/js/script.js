const URL = 'http://localhost:8000'


window.onload = addEventListeners

function addEventListeners() {
    // Drop-down menu listener
    let userSettings = document.querySelector('.user-settings')
    let dropDownMenu = document.querySelector('.user-settings-drop-down-menu')
    userSettings.onclick = function showHideDropDownMenu() {
        if (dropDownMenu.style.display == 'none' || dropDownMenu.style.display == '') {
            dropDownMenu.style.display = 'block';
        }
        else {
            dropDownMenu.style.display = 'none';
        }
    }
    window.addEventListener('click', function hideSettingsMenu(e) {
        if (dropDownMenu.style.display = 'block' && !userSettings.contains(e.target)) {
            dropDownMenu.style.display = 'none';
        }
    })


    // Highlight sub menu option: My sessions, My Orders, Reserve a Session
    let session = document.querySelector('.session');
    let myOrders = document.querySelector('.my-orders');
    let reserve = document.querySelector('.reserve');
    let cart = document.querySelector('.student-cart-balance');

    if (document.location.pathname == '/student/reservation') {
        reserve.classList.add("student-link-selected");
    }

    else if (document.location.pathname == '/student/session') {
        session.classList.add("student-link-selected");
    }

    else if (document.location.pathname == '/student/order') {
        myOrders.classList.add("student-link-selected");
    }

    else if (document.location.pathname == '/student/cart') {
        cart.classList.add("student-link-selected");
        cart.firstElementChild.style.color = 'white';
    }

    




}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function sendToCart() {
    let optionSelected = window.event.target.parentElement;
    let dateTime = optionSelected.querySelector('.reservation-option-datetime').textContent;
    let examCode = optionSelected.querySelector('.reservation-option-exam').textContent;
    let length = document.querySelector('select[name="exam-length"]').value
    let university = document.querySelector('select[name="university"]').value
    let csrfToken = getCookie('csrftoken')
    fetch('reservation', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
            }),
        // credentials: 'include',
        body: JSON.stringify({
            dateTime: dateTime,
            examCode: examCode,
            length: length,
            university: university,
            })
    })
    console.log('function sendToCart ran')
    // to-do: create a get request to obtain the available schedules form the server
}

