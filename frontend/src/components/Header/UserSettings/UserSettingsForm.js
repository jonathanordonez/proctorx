import React from "react";
import { UserDetailsContext } from "../../Login/Login";
import { useContext, useState } from "react";
import { changeUserDetails } from "../../../utils";

export default function UserSettingsForm() {
  const userDetails = useContext(UserDetailsContext);
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

  console.log("this det: ", userDetails);
  return (
    <>
      <form className="settings-form" onSubmit={handleForm}>
        <label className="fs-5">First name</label>
        <input
          type="text"
          name="first_name"
          value={firstName}
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
          value={lastName}
          className="form-control"
          maxLength="30"
          required=""
          id="id_last_name"
          onChange={(event) => setLastName(event.target.value)}
        ></input>

        <label className="fs-5">Phone number</label>
        <input
          type="numeric"
          name="phone_number"
          value={phoneNumber}
          className="form-control"
          maxLength="20"
          required=""
          id="id_phone_number"
          onChange={(event) => setPhoneNumber(event.target.value)}
        ></input>

        <label className="fs-5">Street address</label>
        <input
          type="text"
          name="street_address"
          value={streetAddress}
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
          value={city}
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
          value={state}
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
          value={country}
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
          value={postalCode}
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
        />
      </form>
    </>
  );
  function handleForm() {
    changeUserDetails({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      streetAddress: streetAddress,
      city: city,
      state: state,
      country: country,
      postalCode: postalCode,
    });
  }
}
