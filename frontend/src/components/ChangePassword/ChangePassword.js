import React from "react";
import Toast from "../Toast/Toast";
import proctorXlogo from "../../img/proctorX.svg";

export default function ChangePassword({ setComponentRendered }) {
  return (
    <div className="main-wrapper-landing">
      <main>
        <div className="logo-landing">
          <img alt="ProctorX Logo" src={proctorXlogo}></img>
        </div>

        <div class="form-container">
          <Toast />
          <form method="POST" action="">
            <label class="form-label fs-5" for="email">
              Email address
            </label>
            <input class="form-control" type="email" name="email" />
            <input
              class="form-control fs-5"
              type="submit"
              value="Reset Password"
            />
          </form>
          <hr />
          <div class="form-footer">
            <div>
              <a class="fs-5" onClick={handleComponentRendered}>
                Sign In
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
  function handleComponentRendered(e) {
    setComponentRendered(e.target.textContent);
  }
}
