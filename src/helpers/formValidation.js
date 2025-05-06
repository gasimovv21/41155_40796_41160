export const initialResponse = { success: null, message:"", errors: {} };

export const isInvalid = (err) => {
	return err ? "is-invalid" : ""
}

export const response = (success, message, errors, data) => {
	return {
		success,
		message,
		errors,
		data
	};
};

export const getYupErrors = (errors) => {
	const errObj = {};
	errors.forEach((error) => (errObj[error.path] = error.message));

	return response(false, "", errObj);
};

export const convertFormDataToJson = (formData) =>
	Object.fromEntries(formData.entries());