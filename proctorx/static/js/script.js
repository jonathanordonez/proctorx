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
    window.addEventListener('click', function findClick(e) {
        console.log(e.target)
    })
}