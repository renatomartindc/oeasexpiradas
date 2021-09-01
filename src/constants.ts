// Cada aduana debe usar su cadena de conexión y código de país
export const url = `https://cadenaco-backend.kaytrust.id`;

// Credenciales para la solicitud del token
export const username = 'admin@gmail.com';
export const password = 'Peru123456789@';

// Esta configuración no se debería modificar
export const logFileName = 'logs.txt'; // Nombre del archivo TXT con los logs del proceso
export const maxRetry = 10; // Total de reintentos que se van a realizar cuando falla una transacción
export const dateFormat = 'DD/MM/YYYY'; // Usado para validar el formato de fecha en el excel
export const timeoutUpdateState = 15000; // Tiempo de espera al actualizar una OEA (milisegundos)
export const timeoutGeneral = 5000; // Tiempo de espera entre cada transacción (milisegundos)