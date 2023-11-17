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

export const signIn = async (email, password) => {
  const apiUrl = `${process.env.REACT_APP_PYTHONHOST}/sign_in`;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Specify the content type if needed
      // Additional headers can be added as needed
      // 'Authorization': 'Bearer <token>',
    },
    body: JSON.stringify({ email: email, password: password }),
  };
  fetchData(apiUrl, requestOptions);
};
