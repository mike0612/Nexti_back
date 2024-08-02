const jwt = require('jsonwebtoken');

/**
 * Genera un JWT para el usuario especificado.
 *
 * @param {string} uid - El identificador único del usuario.
 * @returns {Promise<string>} - Una promesa que resuelve con el token JWT.
 */
const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if (err) {
                console.error('Error al generar el JWT:', err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    generarJWT
}
