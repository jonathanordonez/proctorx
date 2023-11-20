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

export const signIn = async (email, password, csrfToken) => {
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/sign_in`;
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

export const registerNewStudent = async (
  firstName,
  lastName,
  email,
  password,
  password2,
  csrfToken
) => {
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/register`;
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
    const response = fetchData(apiUrl, requestOptions);
    return response;
  } catch (error) {
    throw error; // Re-throw the error to be caught by the calling code
  }
};

export const fetchCsrfToken = async () => {
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/get_csrf_token`;
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

export const showToast = (status, message) => {
  const toastElement = document.getElementsByClassName("message-container")[0];
  toastElement.hidden = false;
  toastElement.className = `message-container message-${status}`;
  const toastText = document.getElementsByClassName("message-text")[0];
  toastText.textContent = message;
  if (status === "success") {
    const signInLink = document.createElement("a");
    signInLink.textContent = "Sign in";
    signInLink.href = "/";
    toastText.appendChild(signInLink);
  }
};
