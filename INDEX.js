const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }
});

const commands = new Map();

const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const command = require(path.join(commandsPath, file));
    commands.set(command.name, command);
  }
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
  console.log('QR Code généré, scanne-le avec WhatsApp!');
});

client.on('ready', () => {
  console.log('SUNg BOT est prêt !');
});

client.on('message', async message => {
  try {
    const { body, author, fromMe } = message;
    if (!body.startsWith(config.PREFIX)) return;

    const args = body.slice(config.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!commands.has(commandName)) return;

    const command = commands.get(commandName);

    if (command.ownerOnly) {
      const isOwner = (fromMe || author === config.OWNER_NUMBER || message.from === config.OWNER_NUMBER);
      if (!isOwner) {
        return message.reply('🚫 Seul le propriétaire du bot peut utiliser cette commande.');
      }
    }

    await command.execute(client, message, args);

  } catch (err) {
    console.error('Erreur lors de la commande:', err);
  }
});

client.initialize();
