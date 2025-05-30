// Utility functions
const nombresTipos = {
    conversation: 'texto',
    extendedTextMessage: 'texto',
    imageMessage: 'imagen',
    stickerMessage: 'sticker',
    audioMessage: 'audio',
    videoMessage: 'video',
    documentMessage: 'documento',
    locationMessage: 'ubicación',
    contactMessage: 'contacto',
    pollCreationMessage: 'encuesta',
    reactionMessage: 'reacción'
};

module.exports = {
    formatDate: (date) => {
        return date.toISOString();
    },
    nombresTipos
};
