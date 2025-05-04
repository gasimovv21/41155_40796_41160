"use server";
import {
  convertFormDataToJson,
  getYupErrors,
  response,
} from "@/helpers/formValidation";
import { register } from "@/services/sign-up-service";
import * as Yup from "yup";
import jwt from "jsonwebtoken";

const FormSchemaMain = Yup.object({
  email: Yup.string().email("It must be email address").required("Required"),
});

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
  const secretKey = "7HN5dknVIpsFAfdqgk5KnAX6Jq2ekB3g";

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

// Kullanıcı kaydı için action
export const signUpPageAction = async (prevState, formData) => {
  const fields = convertFormDataToJson(formData);

  try {
    FormSchemaPage.validateSync(fields, { abortEarly: false });

    // Backend'e gönderilmeyecek alanları ayıklıyoruz
    const { confirmPassword, privacyPolicy, ...payload } = fields;

    const res = await register(payload);
    const data = await res.json();

    if (res.ok) {
      return response(true, data, null, data);
    }
    return response(false, data?.message, data?.validations, data);
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      return getYupErrors(err.inner);
    }
    throw err;
  }
};
