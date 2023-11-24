import { useEffect } from "react";
import { useState, useMemo } from "react";
import { passwordSchemaRestrictions } from "../utils";

export default function usePasswordValidation(password1, password2) {
  const [password1Details, setPassword1Details] = useState({});
  const [password2Details, setPassword2Details] = useState({});

  const passwordSchema = useMemo(() => passwordSchemaRestrictions(), []);

  useEffect(() => {
    validatePasswords();
  }, [password1, password2]);

  function validatePasswords() {
    if (!password1 && !password2) {
      setPassword1Details({ isValid: false });
      setPassword2Details({ isValid: false });
      return { password1: { isValid: false }, password2: { isValid: false } };
    }
    if (!passwordSchema.validate(password1)) {
      setPassword1Details({
        isValid: false,
        description: "Password must contain at least 8 characters",
      });
    } else {
      setPassword1Details({
        isValid: true,
      });
    }
    if (!password2) {
      setPassword2Details({});
      return;
    }

    if (password2 !== password1) {
      setPassword2Details({
        isValid: false,
        description: "Passwords don't match",
      });
    } else {
      setPassword2Details({
        isValid: true,
      });
    }
  }
  return { password1: password1Details, password2: password2Details };
}
