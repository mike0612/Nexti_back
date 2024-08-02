const QRCode = require('qrcode');

const generateQRCode = async (data) => {
    try {
        const qrCode = await QRCode.toDataURL(JSON.stringify(data));
        return qrCode;
    } catch (err) {
        console.error(err);
        throw new Error('Could not generate QR Code');
    }
}

module.exports = {
    generateQRCode
}
