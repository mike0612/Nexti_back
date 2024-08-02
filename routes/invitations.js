const { Router } = require('express');
const { check } = require('express-validator');
const { getInvitations, createInvitation, getInvitation, deleteInvitation } = require('../controllers/invitationController');
const { validarJWT } = require('../middlewares/auth');
const { validarCampos } = require('../middlewares/validation');

const router = Router();

// Middleware para validar JWT en todas las rutas de este router
router.use(validarJWT);

// Ruta para obtener todas las invitaciones
router.get('/', getInvitations);

// Ruta para crear una nueva invitación con validaciones adicionales
router.post('/', [
    check('nombreInvitado', 'El nombre del invitado es obligatorio').not().isEmpty(),
    check('fechaHoraEntrada', 'La fecha y hora de entrada son obligatorias').isISO8601(),
    check('fechaCaducidad', 'La fecha de caducidad es obligatoria').isISO8601(),
    validarCampos
], createInvitation);

// Ruta para obtener una invitación específica por ID
router.get('/:id', getInvitation);

// Ruta para eliminar una invitación específica por ID
router.delete('/:id', deleteInvitation);

module.exports = router;
