export const validateParametersUser = (email, password) => {
  if (email == null || email == "") return "El correo electrónico es requerido";
  if (password == null || password == "") return "La contraseña es requerido";
};
export const validateParameter = (params, entityName = "Password") => {
  if (params == null || params == "") return `${entityName} es requerido`;
};

export const validatePassword = (password, confirmPassword) => {
  if (password !== confirmPassword)
    return "Por favor, vuelve a ingresar la contraseña para confirmar.";
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Ingrese un correo electrónico valido";
};

export const validatePasswordStrength = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password))
    return "Ingrese una contraseña con 8 caracteres y que contenga {Mayusculas, Minuscula, Numéros, Caracteres especiales}";
};

export const valiteId = (id) => {
  if (!id || isNaN(Number(id)))
    return "El parámetro 'id' es requerido y debe ser un número válido.";
};

export const validateRecordset = (result, entityName = "Usuario") => {
  if (!result || result.recordset.length === 0)
    return `${entityName} no encontrado.`;
};
