const { Schema, model } = require('mongoose');

const InvitationSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nombreInvitado: {
        type: String,
        required: true
    },
    fechaHoraEntrada: {
        type: Date,
        required: true
    },
    fechaCaducidad: {
        type: Date,
        required: true
    },
    qrCode: {
        type: String,
        required: true
    }
});

InvitationSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Invitation', InvitationSchema);
