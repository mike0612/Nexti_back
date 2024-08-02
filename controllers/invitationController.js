const { response } = require('express');
const Invitation = require('../models/Invitation');
const { generateQRCode } = require('../helpers/qrCode');

const getInvitations = async (req, res = response) => {
    const { uid } = req;

    const invitations = await Invitation.find({ user: uid });

    res.json({
        ok: true,
        invitations
    });
}

const createInvitation = async (req, res = response) => {
    const { nombreInvitado, fechaHoraEntrada, fechaCaducidad } = req.body;
    const { uid } = req;

    try {

        //  DEBIDO AL TAMAÑO DEL QR, TUVE QUE QUITAR ESTO Y DEJARLO TAL COMO SE VE ABAJO
        //  ANTES .const qrCode = await generateQRCode({ nombreInvitado, fechaHoraEntrada, fechaCaducidad });
        //                              DESPUES  ↓↓↓↓ solo con el ID
        const qrCode = await generateQRCode({  id: uid });

        const newInvitation = new Invitation({
            user: uid,
            nombreInvitado,
            fechaHoraEntrada,
            fechaCaducidad,
            qrCode
        });

        await newInvitation.save();

        res.json({
            ok: true,
            invitation: newInvitation
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const getInvitation = async (req, res = response) => {
    const { id } = req.params;
    const { uid } = req;

    try {
        const invitation = await Invitation.findById(id);

        if (!invitation || invitation.user.toString() !== uid) {
            return res.status(404).json({
                ok: false,
                msg: 'Invitación no encontrada'
            });
        }

        res.json({
            ok: true,
            invitation
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const deleteInvitation = async (req, res = response) => {
    const { id } = req.params;
    const { uid } = req;

    try {
        const invitation = await Invitation.findById(id);

        if (!invitation || invitation.user.toString() !== uid) {
            return res.status(404).json({
                ok: false,
                msg: 'Invitación no encontrada'
            });
        }

        await Invitation.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Invitación eliminada'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    getInvitations,
    createInvitation,
    getInvitation,
    deleteInvitation
}
