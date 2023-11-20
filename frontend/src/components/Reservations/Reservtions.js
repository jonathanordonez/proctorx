import React from "react";
import { signOut } from "../../utils";

export default function Reservtions({
  setIsAuthenticated,
  setIsAuthenticatedInBackend,
}) {
  return (
    <>
      <div>Reservtions</div>;<button onClick={logOut}>Logout</button>
    </>
  );
  async function logOut() {
    const fetchStatus = await signOut();
    if (fetchStatus === "success") {
      setIsAuthenticated(false);
      setIsAuthenticatedInBackend(false);
    } else {
      // errro handling
      // Toast
    }
  }
}
