export const validatePassword = (value: string) => value.length >= 8;
export const validateMatricule = (value: string) => /^[a-z]{2}\d{2}[a-z]\d{3}$/i.test(value);
export const validateEmail = (value: string) => /.+@.+\..+/.test(value);