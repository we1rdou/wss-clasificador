const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { nombresTipos } = require('../utils/utils');
const config = require('../config/config');

async function arrancarBot() {
  const { state, saveCreds } = await useMultiFileAuthState('sesion');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('Escanea este código QR para conectar WhatsApp:\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('❌ Conexión cerrada. ¿Reconectar?', shouldReconnect);
      if (shouldReconnect) arrancarBot();
    }

    if (connection === 'open') {
      console.log('✅ Conectado a WhatsApp');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const numeroCompleto = msg.key.remoteJid;
    const miNumero = sock.user.id.split(':')[0].split('@')[0];
    let numeroLimpio = numeroCompleto.replace(/[^0-9]/g, '');
    if (numeroLimpio === miNumero || numeroCompleto.startsWith(miNumero)) {
      numeroLimpio = miNumero;
      console.log('📩 Mensaje enviado a uno mismo detectado.');
    }

    let tipoInterno = Object.keys(msg.message)[0];

    // Mejorar la detección de encuestas y otros tipos anidados
    if (msg.message.pollCreationMessageV3) {
      tipoInterno = 'pollCreationMessage';
    } else if (msg.message.pollCreationMessage) {
      tipoInterno = 'pollCreationMessage';
    } else if (tipoInterno === 'extendedTextMessage') {
      const ext = msg.message.extendedTextMessage;
      if (ext.pollCreationMessage || ext.pollCreationMessageV3) {
        tipoInterno = 'pollCreationMessage';
      } else if (ext.contextInfo?.quotedMessage) {
        const quoted = ext.contextInfo.quotedMessage;
        if (quoted.pollCreationMessage || quoted.pollCreationMessageV3) {
          tipoInterno = 'pollCreationMessage';
        } else if (Object.values(quoted).some(v => v && (v.pollCreationMessage || v.pollCreationMessageV3))) {
          tipoInterno = 'pollCreationMessage';
        } else if (quoted.reactionMessage) {
          tipoInterno = 'reactionMessage';
        }
      }
    } else if (msg.message.reactionMessage) {
      tipoInterno = 'reactionMessage';
    }

    const tipoVisible = nombresTipos[tipoInterno] || tipoInterno;

    console.log('\n📩 Nuevo mensaje recibido');
    console.log('👤 De:', numeroLimpio);
    console.log('📦 Tipo:', tipoVisible);

    // Filtrar mensajes no reconocidos para el historial
    if (!['conversation', 'extendedTextMessage', 'imageMessage', 'stickerMessage', 'audioMessage', 'videoMessage', 'documentMessage', 'locationMessage', 'contactMessage', 'pollCreationMessage', 'reactionMessage'].includes(tipoInterno)) {
        console.log(`⚠️ Mensaje no reconocido (${tipoInterno}). Ignorando...`);
        return;
    }

    // Ajustar la fecha a la hora local
    const registro = {
        fecha: new Date().toLocaleString('es-ES', { timeZone: 'America/Guayaquil' }),
        numero: numeroLimpio,
        tipo: tipoVisible
    };
    fs.appendFileSync('historial.json', JSON.stringify(registro) + '\n');

    let respuesta = '';
    switch (tipoInterno) {
      case 'conversation':
      case 'extendedTextMessage':
        respuesta = '📝 Recibí tu mensaje de texto.';
        break;
      case 'imageMessage':
        respuesta = '📷 Recibí tu imagen.';
        break;
      case 'stickerMessage':
        respuesta = '🎟 Recibí tu sticker.';
        break;
      case 'audioMessage':
        respuesta = '🎧 Recibí tu audio.';
        break;
      case 'videoMessage':
        respuesta = '🎬 Recibí tu video.';
        break;
      case 'documentMessage':
        respuesta = '📄 Recibí tu documento.';
        break;
      case 'locationMessage':
        respuesta = '📍 Recibí tu ubicación.';
        break;
      case 'contactMessage':
        respuesta = '👤 Recibí el contacto.';
        break;
      case 'pollCreationMessage':
        respuesta = '📊 Recibí tu encuesta.';
        break;
      case 'reactionMessage':
        respuesta = '💬 Recibí tu reacción.';
        break;
      default:
        respuesta = `🤖 Recibí un mensaje no clasificado (${tipoInterno}).`;
    }

    await sock.sendMessage(numeroCompleto, { text: respuesta });
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const tipoInterno = Object.keys(msg.message)[0];

    if (tipoInterno === 'imageMessage') {
        console.log('📷 Imagen recibida.');

        // Aquí puedes agregar lógica adicional para clasificar la imagen.

        await sock.sendMessage(msg.key.remoteJid, {
            text: `📷 Recibí tu imagen.`
        });
    } else if (tipoInterno === 'conversation') {
        const textContent = msg.message?.conversation || 'Sin contenido';
        console.log('📝 Mensaje de texto recibido:', textContent);
        console.log('🔍 Todos los campos del mensaje:', JSON.stringify(msg.message, null, 2)); // Registro detallado de los campos del mensaje

        // Guardar el contenido del mensaje en el historial
        const registro = {
            fecha: new Date().toLocaleString('es-ES', { timeZone: 'America/Guayaquil' }),
            numero: numeroLimpio,
            tipo: 'texto',
            contenido: textContent
        };
        fs.appendFileSync('historial.json', JSON.stringify(registro) + '\n');

        // Verificar si el contenido es inesperado
        if (!msg.message?.conversation) {
            console.warn('⚠️ El campo conversation no está presente o está vacío.');
        }
    }
});
}

module.exports = { arrancarBot };
