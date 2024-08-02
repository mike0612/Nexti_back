const { response } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { sendRecoveryEmail } = require('../helpers/email');
const { generarJWT } = require('../helpers/jwt');

/**
 * Login de usuario
 */
const login = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const usuarioBD = await User.findOne({ email });
        if (!usuarioBD) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        const token = await generarJWT(usuarioBD.id);

        res.json({
            ok: true,
            token
        });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

/**
 * Registro de usuario
 */
const signup = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        let usuario = await User.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        usuario = new User(req.body);

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

/**
 * Logout de usuario
 */
const logout = async (req, res = response) => {
    // Invalidar el token (la implementación puede variar según cómo manejes la invalidación del token)
    res.json({
        ok: true,
        msg: 'Logout exitoso'
    });
}

/**
 * Recuperación de contraseña
 */
const recoverPassword = async (req, res = response) => {
    const { email } = req.body;

    try {
        const usuarioBD = await User.findOne({ email });
        if (!usuarioBD) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        const token = crypto.randomBytes(20).toString('hex');
        usuarioBD.resetPasswordToken = token;
        usuarioBD.resetPasswordExpires = Date.now() + 3600000; // 1 hora

        await usuarioBD.save();

        const resetURL = `http://${req.headers.host}/reset/${token}`;

        const emailContent = `
            <h1>Recuperación de Contraseña</h1>
            <p>Para recuperar tu contraseña, haz clic en el siguiente enlace:</p>
            <a href="${resetURL}">${resetURL}</a>
            <p>Si no solicitaste esto, ignora este correo.</p>
        `;

        await sendRecoveryEmail(usuarioBD.email, 'Recuperación de Contraseña', emailContent);

        res.json({
            ok: true,
            msg: 'Correo de recuperación enviado'
        });
    } catch (error) {
        console.error('Error en la recuperación de contraseña:', error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    login,
    signup,
    logout,
    recoverPassword
}
