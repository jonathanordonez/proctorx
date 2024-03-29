import passwordValidator from "password-validator";

export const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      // Handle non-successful responses (status codes other than 2xx)
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response JSON, assuming the server returns JSON
    const data = await response.json();

    return data;
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error("Fetch error:", error.message);
    throw error; // Re-throw the error to be caught by the calling code
  }
};

export const isUserAuthenticatedInBackend = async () => {
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/api/is_user_authenticated`;
  const requestOptions = {
    credentials: "include",
  };
  const response = await fetchData(apiUrl, requestOptions);
  return response;
};

export const signIn = async (email, password, csrfToken) => {
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/api/sign_in`;
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({ email: email, password: password }),
  };
  const response = await fetchData(apiUrl, requestOptions);
  return response;
};

export const signOut = async () => {
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/api/sign_out`;
  const requestOptions = {
    credentials: "include",
  };
  const response = await fetch(apiUrl, requestOptions);

  return response.ok ? "success" : "failure";
};

export const registerNewStudent = async (
  firstName,
  lastName,
  email,
  password,
  password2,
  csrfToken
) => {
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/api/register`;
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": csrfToken,
    },

    body: JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      password2: password2,
    }),
  };

  try {
    const response = await fetchData(apiUrl, requestOptions);
    return response;
  } catch (error) {
    throw error; // Re-throw the error to be caught by the calling code
  }
};

export const fetchCsrfToken = async () => {
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/api/get_csrf_token`;
  const requestOptions = {
    credentials: "include",
  };
  const data = await fetchData(apiUrl, requestOptions);
  return data.csrf_token;
};

export const getCookie = (cookieName) => {
  // Split cookies by semicolon to create an array of key-value pairs
  var cookies = document.cookie.split(";");

  // Iterate through the array to find the desired cookie
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();

    // Check if the cookie starts with the provided name
    if (cookie.indexOf(cookieName + "=") === 0) {
      // Return the value of the cookie
      return cookie.substring(cookieName.length + 1);
    }
  }

  // If the cookie is not found, return null or an appropriate value
  return null;
};

export const showToast = (status, message, seconds) => {
  const toastElement = document.getElementsByClassName("message-container")[0];
  toastElement.hidden = false;
  toastElement.classList.add(`message-${status}`);
  const toastText = document.getElementsByClassName("message-text")[0];
  if (!seconds) {
    toastText.textContent = message;
  } else if (seconds) {
    toastText.textContent = `${message} (${seconds}) `;
    if (toastElement.querySelectorAll("button").length === 0) {
      // Add the button element only if there is no other button like it already added as children
      const button = document.createElement("button");
      button.className = "message-close";
      button.textContent = "x";
      button.onclick = () => {
        toastElement.hidden = true;
      };
      toastElement.appendChild(button);
    }

    let secondsLeft = seconds;
    const interval = setInterval(() => {
      secondsLeft--;
      toastText.textContent = `${message} (${secondsLeft}) `;
      if (secondsLeft <= 0) {
        clearInterval(interval);
        toastElement.hidden = true;
      }
    }, 1000);
    return interval;
  }
};

export const changeUserDetails = async (userDetails) => {
  const csrfToken = getCookie("csrftoken");
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/api/set_user_details`;
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify(userDetails),
  };
  try {
    return await fetchData(apiUrl, requestOptions);
  } catch (error) {
    console.error(
      "The following error occurred in changing user details: ",
      error
    );
    return { status: "failure", description: error };
  }
};

export const passwordSchemaRestrictions = () => {
  const schema = new passwordValidator();
  // schema.is().min(8); // Minimum length 8
  //Other options available:
  //   .is().max(100)
  //   .has().uppercase()
  //   .has().lowercase()
  //   .has().digits()
  //   .has().symbols()
  //   .has().not().spaces();
  return schema;
};

export const changePassword = async (oldPassword, newPassword) => {
  const csrfToken = getCookie("csrftoken");
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/api/change_password`;
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
    }),
  };
  try {
    return await fetchData(apiUrl, requestOptions);
  } catch (error) {
    console.error(
      "The following error occurred in changing the user password: ",
      error
    );
    return { status: "failure", description: error };
  }
};

export const saveToCart = async (
  dateSelected,
  lengthSelected,
  university,
  exam,
  csrfToken
) => {
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/api/add_to_cart`;
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": csrfToken,
    },

    body: JSON.stringify({
      dateSelected: dateSelected,
      lengthSelected: lengthSelected,
      university: university,
      exam: exam,
    }),
  };

  try {
    const response = await fetchData(apiUrl, requestOptions);
    return response;
  } catch (error) {
    throw error; // Re-throw the error to be caught by the calling code
  }
};

export const fetchCartSessions = async () => {
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/api/sessions?cart=true`;
  try {
    const response = await fetch(apiUrl, {
      credentials: "include",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteCartSession = async (sessionId) => {
  const csrfToken = getCookie("csrftoken");
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/api/delete_cart_session`;
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({
      session_id: sessionId,
    }),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);
    return response;
  } catch (error) {
    throw error;
  }
};

export const payCartSession = async (sessionId) => {
  const csrfToken = getCookie("csrftoken");
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/api/pay_cart_session`;
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify(sessionId),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchOrders = async () => {
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/api/sessions`;
  try {
    const response = await fetch(apiUrl, {
      credentials: "include",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUpcomingSessions = async () => {
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/api/upcoming_sessions`;
  try {
    const response = await fetch(apiUrl, {
      credentials: "include",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export function formatDateTimeString(inputDateString) {
  const inputDate = new Date(inputDateString);

  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minutes: "numeric",
  };
  const formattedDate = inputDate.toLocaleDateString("en-US", options);

  return formattedDate;
}
