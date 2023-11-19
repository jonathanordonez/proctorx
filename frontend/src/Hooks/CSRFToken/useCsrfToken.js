import { useEffect, useState } from "react";
import { fetchCsrfToken } from "../../utils";
import { getCookie } from "../../utils";

const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState(getCookie("csrftoken"));

  useEffect(() => {
    (async () => {
      if (!csrfToken) {
        await fetchCsrfToken(); // Makes Django backend add csrftoken to the cookies
        const token = getCookie("csrftoken");
        setCsrfToken(token);
      }
    })();
  }, []);

  return csrfToken;
};

export default useCsrfToken;
