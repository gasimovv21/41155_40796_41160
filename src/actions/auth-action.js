"use server";
import { signIn } from "@/auth";
import {
  convertFormDataToJson,
  getYupErrors,
  response,
} from "@/helpers/formValidation";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import * as Yup from "yup";

const FormSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export const loginAction = async (prevState, formData) => {
  const fields = convertFormDataToJson(formData);
  //console.log(fields);

  try {
    FormSchema.validateSync(fields, { abortEarly: false });

    await signIn("credentials", {
      redirect: false,
      ...fields,
    });

    redirect("/dashboard");
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      return getYupErrors(err.inner);
    } else if (err instanceof AuthError) {
      if (err.type === "CallbackRouteError") {
        return response(false, "Invalid credentials");
      }
      return response(false, "Something went wrong.");
    }
    throw err;
  }
};
