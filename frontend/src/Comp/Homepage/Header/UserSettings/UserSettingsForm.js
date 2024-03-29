import React from "react";
import { UserDetailsContext } from "../../../Login/Login";
import { useContext, useState, useEffect } from "react";
import { changeUserDetails, showToast } from "../../../../utils";

export default function UserSettingsForm() {
  const { userDetails } = useContext(UserDetailsContext);
  const [firstName, setFirstName] = useState(userDetails.first_name);
  const [lastName, setLastName] = useState(userDetails.last_name);
  const [phoneNumber, setPhoneNumber] = useState(userDetails.phone_number);
  const [streetAddress, setStreetAddress] = useState(
    userDetails.street_address
  );
  const [city, setCity] = useState(userDetails.city);
  const [state, setState] = useState(userDetails.state);
  const [country, setCountry] = useState(userDetails.country);
  const [postalCode, setPostalCode] = useState(userDetails.postal_code);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const { setUserDetails } = useContext(UserDetailsContext);
  useEffect(() => {
    console.log("this userDetails", userDetails);
    if (!isSubmitDisabled) {
      return;
    }
    window.scrollTo(0, 0);
  }, [isSubmitDisabled]);

  return (
    <>
      <form className="settings-form" onSubmit={handleForm}>
        <label className="fs-5">First name</label>
        <input
          type="text"
          name="first_name"
          value={firstName ? firstName : ""}
          className="form-control"
          maxLength="30"
          required=""
          id="id_first_name"
          onChange={(event) => setFirstName(event.target.value)}
        ></input>

        <label className="fs-5">Last name</label>
        <input
          type="text"
          name="last_name"
          value={lastName ? lastName : ""}
          className="form-control"
          maxLength="30"
          required=""
          id="id_last_name"
          onChange={(event) => setLastName(event.target.value)}
        ></input>

        <label className="fs-5">Phone number</label>
        <input
          type="number"
          name="phone_number"
          value={phoneNumber ? phoneNumber : ""}
          className="form-control"
          maxLength="20"
          required=""
          id="id_phone_number"
          onChange={handlePhoneNumber}
        ></input>

        <label className="fs-5">Street address</label>
        <input
          type="text"
          name="street_address"
          value={streetAddress ? streetAddress : ""}
          className="form-control"
          maxLength="50"
          required=""
          id="id_street_address"
          onChange={(event) => setStreetAddress(event.target.value)}
        ></input>

        <label className="fs-5">City</label>
        <input
          type="text"
          name="city"
          value={city ? city : ""}
          className="form-control"
          maxLength="30"
          required=""
          id="id_city"
          onChange={(event) => setCity(event.target.value)}
        ></input>

        <label className="fs-5">Province / State</label>
        <input
          type="text"
          name="state"
          value={state ? state : ""}
          className="form-control"
          maxLength="30"
          required=""
          id="id_state"
          onChange={(event) => setState(event.target.value)}
        ></input>

        <label className="fs-5">Country</label>
        <input
          type="text"
          name="country"
          value={country ? country : ""}
          className="form-control"
          maxLength="30"
          required=""
          id="id_country"
          onChange={(event) => setCountry(event.target.value)}
        ></input>

        <label className="fs-5">Postal code</label>
        <input
          type="text"
          name="postal_code"
          value={postalCode ? postalCode : ""}
          className="form-control"
          maxLength="10"
          required=""
          id="id_postal_code"
          onChange={(event) => setPostalCode(event.target.value)}
        ></input>

        <input
          type="submit"
          value="Submit"
          name="Settings"
          className="form-control fs-5"
          disabled={isSubmitDisabled}
        />
      </form>
    </>
  );
  async function handleForm(e) {
    e.preventDefault();
    const response = await changeUserDetails({
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      street_address: streetAddress,
      city: city,
      state: state,
      country: country,
      postal_code: postalCode,
    });
    if (response.status === "success") {
      showToast("success", "User settings updated", 5);

      // Disable submit button for 5 seconds while Toast disappears
      setIsSubmitDisabled(true);
      setTimeout(() => {
        setIsSubmitDisabled(false);
      }, 5000);
      const newUserDetails = {
        ...userDetails,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        street_address: streetAddress,
        city: city,
        state: state,
        country: country,
        postal_code: postalCode,
      };
      setUserDetails(newUserDetails);
    } else {
      showToast("failure", "Unable to update user settings", 5);
    }
  }
  function handlePhoneNumber(event) {
    const validNumericInput = /^-?\d*\.?\d*$/.test(event.target.value);

    if (!validNumericInput) {
      return;
    }
    setPhoneNumber(event.target.value);
  }
}
