(function () {
    window.onload = function loadEventListeners() {
        if (document.location.pathname == '/student/reservation') {
            reservationListeners();
        }
        else if (document.location.pathname == '/student/cart') {
            cartListeners();
        }
        else if (document.location.pathname == '/student/settings') {
            settingsListeners();
        }
        globalEventListeners()
    }

    function globalEventListeners() {
        // User settings drop-down menu listener
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

        // Close message listener 
        closeMessage();

        // Add collapse/uncollapse functionality for user links in smaller screens
        uncollapseUserLinks();

        function uncollapseUserLinks() {
            let userLinksButton = document.querySelector('.button-student-links');
            let collapsedLinks = document.querySelector('.student-collapsed-links');
            userLinksButton.addEventListener('click', function showHideCollapsedLinks() {
                let linksStatus = collapsedLinks.getAttribute('hidden');
                if (linksStatus == '') { // it is hidden
                    collapsedLinks.removeAttribute('hidden');
                }
                else if (linksStatus == null) { // not hidden
                    collapsedLinks.setAttribute('hidden', '');
                }
            });

        }



        // Reservation listeners
        if (document.location.pathname == '/student/reservation') {
            reserve.classList.add("student-link-selected");
        }

        // Session listeners
        else if (document.location.pathname == '/student/session') {
            session.classList.add("student-link-selected");
        }

        // Order listeners
        else if (document.location.pathname == '/student/order') {
            myOrders.classList.add("student-link-selected");
        }

        // Cart listeners
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

            let sumbitButton = document.querySelector('.registration-form-submit');

            function handleSubmit(event) {
                event.preventDefault();

                // Ensures a time is entered between 7 AM and 7 PM
                let reservationTime = document.querySelector('.reservation-form .form-option-time').value;
                if (reservationTime == '') {
                    displayMessage('failure', 'Please select a reservation time', null, sumbitButton);
                    return;
                }
                let hour = reservationTime.split(':')[0]
                if (hour > 19 || hour < 7) {
                    displayMessage('failure', 'Please select an hour between 7AM and 7PM', null, sumbitButton);
                    return;
                }

                // Ensures a date in the future is entered
                let reservationDate = document.querySelector('.reservation-form .form-option-date').value;
                let userTimezone = (new Date().getTimezoneOffset()) / 60 * -1
                if (userTimezone >= 0) {
                    userTimezone = `+{userTimezone}`
                }
                if (new Date() > new Date(`${reservationDate} GMT${userTimezone}`) || reservationDate == '') {
                    displayMessage('failure', 'Please select a date in the future', null, sumbitButton);
                    return;
                }

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
        cartCountColor();

        function handleDeleteFromCart() {
            let deleteButtons = document.querySelectorAll('.delete-from-cart');
            if (deleteButtons.length > 0) {
                deleteButtons.forEach(function addDeleteFunc(button) {
                    button.addEventListener('click', deleteFromCart);
                })
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
        }

        function handlePaymentForm() {
            let cartForm = document.querySelector('.cart-form');

            if (cartForm) {
                cartForm.addEventListener('submit', handleSubmit);
            }

            function handleSubmit(event) {
                event.preventDefault();
                const data = new FormData(event.target);
                const sessionPaymentJson = Object.fromEntries(data.entries());
                sessionPaymentJson.postOption = 'cc-payment';

                // Obtain sessions currently in cart and add them to the payload
                let sessions = [];
                document.querySelectorAll('.cart-container-left-sessions .cart-session').forEach(function obtainSessionId(element) {
                    sessions.push(element.getAttribute('sessionid'));
                })
                sessionPaymentJson.sessions = sessions;

                let submitPayment = postData('cart', sessionPaymentJson);
                submitPayment.then(function toJson(response) {
                    let result = response.json(response);
                    result.then(function readJsonResponse(result) {
                        if (result.status == 'success') {
                            displayMessage(result.status, result.message, 'session');

                            // Disables input elements
                            document.querySelectorAll('.cart-form input').forEach(function disableInput(e) {
                                e.setAttribute('disabled', '');
                            })

                        }
                        else {
                            displayMessage(result.status, result.message);
                        }
                    }, function unableToReadJsonResponse() {
                        // show error message (unable to read json response)
                    })
                }, function postDataFailed() {
                    // show error message (unable to proceed with payment)
                })




            }
        }

        function cartCountColor() {
            document.querySelector('.student-cart-count').style.color = "black";
        }
    }

    function settingsListeners() {
        handleSettingsForm();
        handleChangePasswordForm();

        function handleSettingsForm() {
            let settingsForm = document.querySelector('.settings-form');
            settingsForm.addEventListener('submit', handleSubmit);

            function handleSubmit(event) {
                event.preventDefault();

                const data = new FormData(event.target);
                const jsonValues = Object.fromEntries(data.entries());
                jsonValues.postOption = 'update user settings'
                console.log(jsonValues);
                let userSettings = postData('settings', jsonValues);
                userSettings.then(function displayPromiseStatus(response) {
                    console.log(response.status);
                    response.json()
                        .then(function createMessage(res) {
                            displayMessage(res.status, res.message);
                        });
                })
            }
        }

        function handleChangePasswordForm() {
            let passwordForm = document.querySelector('.change-password-form');
            passwordForm.addEventListener('submit', handleSubmit);

            function handleSubmit(event) {
                event.preventDefault();
                const data = new FormData(event.target);
                const jsonValues = Object.fromEntries(data.entries());
                jsonValues.postOption = 'change password'
                console.log(jsonValues);
                let userSettings = postData('settings', jsonValues);
                userSettings.then(function displayPromiseStatus(response) {
                    console.log(response.status);
                    response.json()
                        .then(function createMessage(res) {
                            displayMessage(res.status, res.message);
                        });
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

    function displayMessage(status, message, redirect, disableElement) {
        if (disableElement) {
            disableElement.setAttribute('disabled', '');
        }
        let messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');
        messageContainer.classList.add(`message-${status}`);
        let messageText = document.createElement('div');
        messageText.classList.add('message-text');
        messageText.classList.add('fs-5');
        messageText.textContent = `${message} (4)`;
        let messageButton = document.createElement('button');
        messageButton.classList.add('message-close');
        messageButton.textContent = 'x';

        messageContainer.appendChild(messageText);
        messageContainer.appendChild(messageButton);

        let headerWrapper = document.querySelector('.header-wrapper');
        headerWrapper.insertBefore(messageContainer, headerWrapper.children[1]);
        closeMessage();
        window.scrollTo(0, 0);
        let timerCount = 3;
        intervalID = setInterval(function decreaseTimer() {
            if (timerCount == 0) {
                messageContainer.remove();
                clearInterval(intervalID);
                if (disableElement) {
                    disableElement.removeAttribute('disabled');
                }
                if (redirect) {
                    window.location.href = 'session';
                }
            }
            messageText.textContent = `${message} (${timerCount})`;
            timerCount -= 1;
        }, 1000);
        console.log('message finished');

    }

    function closeMessage() {
        let closeMessage = document.querySelector('.message-close');
        if (closeMessage) {
            closeMessage.addEventListener('click', function closeMessageContainer() {
                closeMessage.parentNode.remove();

                // Re-enables submitButton if found in the page
                let sumbitButton = document.querySelector('.registration-form-submit');
                if (sumbitButton) {
                    sumbitButton.removeAttribute('disabled');
                }
            })
        }




    }

})();


