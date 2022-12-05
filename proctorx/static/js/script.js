(function () {
    window.onload = function loadEventListeners() {
        if (document.location.pathname == '/student/reservation') {
            reservationListeners();

        }
        globalEventListeners()
    }

    function globalEventListeners() {
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

    function reservationListeners() {
        handleReservationForm();

        function handleReservationForm() {
            reservationForm = document.querySelector('.reservation-form');
            reservationForm.addEventListener('submit', handleSubmit);

            function handleSubmit(event) {
                ev = event;
                event.preventDefault();
                            
                // Replaces the current submit form button for an Edit button
                document.querySelector('.registration-form-submit').remove();
                let button = document.createElement('button');
                button.setAttribute('onclick','window.location=window.location.href');
                button.classList.add('registration-form-edit');
                button.classList.add('fs-5');
                button.textContent = 'Edit Reservation Details';
                document.querySelector('.registration-form-submit-container-2').appendChild(button); 
                //

                const data = new FormData(event.target);
                const jsonValues = Object.fromEntries(data.entries());
                jsonValues.postOption = 'search schedules'
                event.target.querySelectorAll('select, input').forEach(e=>e.setAttribute('disabled', '')) // disables the form elements
                console.log(jsonValues)
                let availableSchedules = postData('reservation', jsonValues);
                availableSchedules.then(function displayPromiseStatus(response){
                    console.log(response.status);
                    response.json()
                        .then(function addElements(res){
                            console.log(res.available_schedules)
                            res.available_schedules.forEach(schedule=>createSchedule(schedule, jsonValues))
                        });
                })
            }
        }
    }

    function createSchedule(schedule, jsonValues){
        let reservationOption = document.createElement('div');
        reservationOption.classList.add('reservation-option');
        reservationOption.classList.add('fs-5');
        let reservationDateTime = document.createElement('p');
        reservationDateTime.classList.add('reservation-option-datetime');
        reservationDateTime.textContent = schedule;
        let reservationLength = document.createElement('p');
        reservationLength.textContent = document.querySelector('.form-option-length').value;
        reservationLength.classList.add('reservation-option-length');
        let sendToCartButton = document.createElement('button');
        sendToCartButton.textContent = 'Select';
        sendToCartButton.addEventListener('click', function(){sendToCart(jsonValues)});
        
        let reservationGrid = document.querySelector('.reservation-results');    
        reservationOption.appendChild(reservationDateTime);
        reservationOption.appendChild(reservationLength);
        reservationOption.appendChild(sendToCartButton);

        reservationGrid.appendChild(reservationOption);
        

        // <div class="reservation-option fs-5">
        //     <p class="reservation-option-datetime">{{schedule}}</p>
        //     <p class="reservation-option-length">{{length}}</p>

        //     <button name="sendToCart" value="Select" onclick="sendToCart()">Select</button>
        // </div>
    }

    function postData(url, values) {
        console.log(`these are the values`);
        console.log(values);
        values2 = {a:5};
        csrfToken = getCookie('csrftoken');
        postRequest = fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }),
            body: JSON.stringify(values2)
        })
        console.log('fetch ran');
        return postRequest;
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

    function sendToCart(jsonValues) {
        let optionSelected = window.event.target.parentElement;
        let dateTime = optionSelected.querySelector('.reservation-option-datetime').textContent;
        jsonValues.postOption = 'add to cart'
        jsonValues.dateSelected = dateTime;
        console.log(jsonValues);
        postData('reservation',jsonValues);
        console.log('function sendToCart ran')
    }

    function disableForm(form) {
        arrayForm = Array.from(form)
        if (arrayForm.length > 0) {
            for(e in arrayForm) {
                if(e.hasChildNodes()) {
                    for(child in e) {

                    }
                }
            }
        }

        }

    function displaySchedules() {

    }
    // to-do: create a get request to obtain the available schedules form the server
    // function availableSchedules() {
    //     let optionSelected = window.event.target.parentElement;
    //     let form = optionSelected.parentElement.parentElement.parentElement;
    //     let university = form.querySelector('.from-option-university');
    //     let date = form.querySelector('.from-option-date');
    //     let time = form.querySelector('.from-option-time');
    //     let program = form.querySelector('.from-option-program');
    //     let length = form.querySelector('.from-option-length');

    //     // let body = {
    //     //     postType : 'searchSchedules',
    //     //     university: university,
    //     //     date: date,
    //     //     time: time,
    //     //     program: program,
    //     //     length: length,
    //     // }

    //     let csrfToken = getCookie('csrftoken')

    //     // fetch('reservation', {
    //     //     method: 'POST',
    //     //     headers: new Headers({
    //     //         'Content-Type': 'application/json',
    //     //         'X-CSRFToken': csrfToken
    //     //     }),
    //     //     body: JSON.stringify(body),
    //     // })

    //     console.log('function schedules ran')
    // }
})();
