// window.onload = function linkReservationSelectOptions() {
//     if (document.location.pathname == '/student/reservation') {
//         reservationOptions = document.querySelectorAll(".reservation-option")
//         // option = 
//         // for in reservationOptions {
//         //     console.log(option)
//         // }
//         // console.log(reservationOptions)
//     }
// }


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
        console.log('cart!')
    }

    




}