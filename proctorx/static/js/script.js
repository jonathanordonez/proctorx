(function () {
    window.onload = function loadEventListeners() {
        if (document.location.pathname == '/student/reservation') {
            reservationListeners();
        }
        else if (document.location.pathname == '/student/cart') {
            cartListeners();
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
            let reservationForm = document.querySelector('.reservation-form');
            reservationForm.addEventListener('submit', handleSubmit);

            function handleSubmit(event) {
                event.preventDefault();

                // Replaces the current submit form button for an Edit button
                document.querySelector('.registration-form-submit').remove();
                let button = document.createElement('button');
                button.setAttribute('onclick', 'window.location=window.location.href');
                button.classList.add('registration-form-edit');
                button.classList.add('fs-5');
                button.textContent = 'Edit Reservation Details';
                document.querySelector('.registration-form-submit-container-2').appendChild(button);
                //

                const data = new FormData(event.target);
                const jsonValues = Object.fromEntries(data.entries());
                jsonValues.postOption = 'search schedules'
                event.target.querySelectorAll('select, input').forEach(e => e.setAttribute('disabled', '')) // disables the form elements
                console.log(jsonValues)
                let availableSchedules = postData('reservation', jsonValues);
                availableSchedules.then(function displayPromiseStatus(response) {
                    console.log(response.status);
                    response.json()
                        .then(function addElements(res) {
                            console.log(res.available_schedules)
                            res.available_schedules.forEach(schedule => createSchedule(schedule, jsonValues))
                        });
                })
            }
        }
    }

    function cartListeners() {
        handleDeleteFromCart();
        handlePaymentForm();

        function handleDeleteFromCart() {
            let deleteButtons = document.querySelectorAll('.delete-from-cart');
            if (deleteButtons.length > 0) {
                deleteButtons.forEach(function addDeleteFunc(button) {
                    button.addEventListener('click', deleteFromCart);
                })
            }
        }

        function deleteFromCart() {
            let session = window.event.target.parentElement;
            let sessionId = session.getAttribute('sessionid');
            let sessionObj = { 'sessionId': sessionId, 'postOption': 'deleteFromCart' };
            let deleteSession = postData('cart', sessionObj);
            deleteSession.then(function deleteSessionElement() {
                session.remove();
                document.querySelector('.student-cart-count').textContent = document.querySelectorAll('.cart-session').length; // update cart quantity 
                updateCart();
            },
                function handleError() {
                    displayMessage('error', 'Unable to delete session from cart. Please try again later or contact Support.')
                }
            )
        }

        function handlePaymentForm() {
            let cartForm = document.querySelector('.cart-form');
            cartForm.addEventListener('submit', handleSubmit)

            function handleSubmit(event) {
                event.preventDefault();
                const data = new FormData(event.target);
                const sessionPaymentJson = Object.fromEntries(data.entries());
                sessionPaymentJson.postOption = 'cc-payment';

                // Obtain sessions currently in cart and add them to the payload
                let sessions = [];
                document.querySelectorAll('.cart-container-left-sessions .cart-session').forEach(function obtainSessionId(element){
                    sessions.push(element.getAttribute('sessionid'));
                })
                sessionPaymentJson.sessions = sessions;

                let submitPayment = postData('cart', sessionPaymentJson);
                submitPayment.then(function toJson(response){
                    let result = response.json(response);
                    result.then(function readJsonResponse(result) {
                        if (result.status == 'success') {
                            // to-do show successful message
                            window.location.href = 'session';
                        }
                        else {
                            // show unsuccessful message (payment failed)
                        }
                    }, function unableToReadJsonResponse() {
                        // show error message (unable to read json response)
                    })
                }, function postDataFailed(){
                    // show error message (unable to proceed with payment)
                })
                
                
                

            }
        }
    }


    function updateCart() {
        let sessionNo = document.querySelectorAll('.cart-session-cost');
        let updatedAmount = 0;
        if (sessionNo.length > 0) {
            sessionNo.forEach(function getTotalCartAmount(session) {
                updatedAmount += parseFloat(session.textContent.replace('$', ''))
            })
            document.querySelector('.cart-session-amount').textContent = `$${updatedAmount.toFixed(2)}`;
        }
        else {
            // remove session total element,
            let sessionTotal = document.querySelector('.cart-session-total-container');
            if (sessionTotal) {
                sessionTotal.remove();
            }

            // update heading
            document.querySelector('.cart-container-session-heading').textContent = 'Your cart is empty';

            // show empty cart svg
            let emptyCartImg = document.createElement('img');
            emptyCartImg.setAttribute('src', '/proctorx/static/img/cart-empty.svg');
            emptyCartImg.classList.add('cart-empty');
            document.querySelector('.cart-container-left-sessions').appendChild(emptyCartImg);

            // remove cc form and heading, and add link to make a new reservation
            document.querySelector('.cc-title').remove();
            document.querySelector('.cart-form').remove();
            let makeNewReservationContainer = document.createElement('div');
            makeNewReservationContainer.classList.add('cart-empy-make-reservation');
            let makeNewReservation = document.createElement('a');
            makeNewReservation.setAttribute('href', 'reservation');
            makeNewReservation.classList.add('fs-4');
            makeNewReservation.textContent = 'Make a new reservation';
            document.querySelector('.cart-container-right').appendChild(makeNewReservation);
            makeNewReservationContainer.appendChild(makeNewReservation);
            document.querySelector('.cart-container-right').appendChild(makeNewReservationContainer);
        }
    }

    function createSchedule(schedule, jsonValues) {
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
        sendToCartButton.addEventListener('click', function () { sendToCart(jsonValues) });

        let reservationGrid = document.querySelector('.reservation-results');
        reservationOption.appendChild(reservationDateTime);
        reservationOption.appendChild(reservationLength);
        reservationOption.appendChild(sendToCartButton);

        reservationGrid.appendChild(reservationOption);

    }

    function postData(url, values) {
        console.log(`these are the values`);
        console.log(values);
        csrfToken = getCookie('csrftoken');
        postRequest = fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }),
            body: JSON.stringify(values)
        })
        console.log(`the values sent are`);
        console.log(values);
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
        console.log('new jsonvalues are');
        console.log(jsonValues);
        let writeReservation = postData('reservation', jsonValues);
        writeReservation.then(
            function printSuccess() {
                // displayMessage('success', 'Reservation added to cart');
                console.log('function sendToCart ran');
                window.location.href = 'cart';
            },
            function printFailure() {
                // displayMessage('success', 'Unable to add reservation to cart. Please try later or contact Support');
            })
    }

    function displayMessage(type, message) {
        console.log(`This is a ${type} message: ${message}`);
    }

    function disableForm(form) {
        arrayForm = Array.from(form)
        if (arrayForm.length > 0) {
            for (e in arrayForm) {
                if (e.hasChildNodes()) {
                    for (child in e) {

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
