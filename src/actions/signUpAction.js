"use server";
import {
  convertFormDataToJson,
  getYupErrors,
  response,
} from "@/helpers/formValidation";
import { register } from "@/services/sign-up-service";
import * as Yup from "yup";
import jwt from "jsonwebtoken";

// Schema for the initial email + secret key step
const FormSchemaMain = Yup.object({
  email: Yup.string().email("It must be email address").required("Required"),
  secretKey: Yup.string()
    .min(12, "Secret key must be at least 12 characters.")
    .required("Secret key is required."),
});

// Schema for full sign-up
const FormSchemaPage = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters.")
    .required("Required"),
  first_name: Yup.string()
    .min(2, "At least 2 characters.")
    .required("Required"),
  last_name: Yup.string().min(2, "At least 2 characters.").required("Required"),
  phone_number: Yup.string().required("Required"),
  email: Yup.string().email("It must be email address").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long.")
    .matches(/[a-z]/, "It must contain at least one lowercase letter.")
    .matches(/[A-Z]/, "It must contain at least one uppercase letter.")
    .matches(
      /[.,?/\\\-]/,
      "It must contain at least one special character (., ?, -, /)."
    )
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password fields don't match")
    .required("Required"),
  privacyPolicy: Yup.string().required("You must agree before signing up."),
});

export const signUpMainAction = async (prevState, formData) => {
  const fields = convertFormDataToJson(formData);
  const secretKey = fields.secretKey;

  try {
    FormSchemaMain.validateSync(fields, { abortEarly: false });

    const emailToken = jwt.sign({ email: fields.email }, secretKey, {
      expiresIn: "1h",
      algorithm: "HS512",
    });

    if (emailToken) return response(true, "", null, emailToken);
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      return getYupErrors(err.inner);
    }
    throw err;
  }
};

export const signUpPageAction = async (prevState, formData) => {
  const fields = convertFormDataToJson(formData);

  try {
    FormSchemaPage.validateSync(fields, { abortEarly: false });

    const { confirmPassword, privacyPolicy, ...payload } = fields;

    const res = await register(payload);
    const data = await res.json();

    //console.log("🔍 Full backend response:", data);

    if (res.ok) {
      return response(true, { message: data?.message || "Success" }, null, data);
    }

    // If the response is a Django-style error dict
    const isValidationError =
      data && typeof data === "object" && !Array.isArray(data);

    if (isValidationError) {
      console.log("🔴 Django field errors:");
      Object.entries(data).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((msg) =>
            console.log(`- ${field}: ${msg}`)
          );
        } else {
          console.log(`- ${field}: ${messages}`);
        }
      });

      return response(false, "Validation error", data, data);
    }

    // Fallback
    console.log("🔴 Unknown error:", data);
    return response(false, "Unknown error", null, data);
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      return getYupErrors(err.inner);
    }
    throw err;
  }
};
