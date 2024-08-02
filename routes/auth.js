const { Router } = require('express');
const { check } = require('express-validator');
const { login, signup, logout, recoverPassword } = require('../controllers/authController');
const { validarCampos } = require('../middlewares/validation');

const router = Router();

router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/signup', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('numeroDepartamento', 'El número de departamento es obligatorio').not().isEmpty(),
    validarCampos
], signup);

router.post('/logout', logout);

router.post('/recover', [
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], recoverPassword);

module.exports = router;
