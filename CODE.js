function generateCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for(let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = {
  name: 'code',
  description: 'Génère un code d’intégration de 8 caractères pour un utilisateur mentionné',
  ownerOnly: false,
  async execute(client, message, args) {
    if (!message.mentionedIds || message.mentionedIds.length === 0) {
      return message.reply('❗️ Merci de mentionner un utilisateur, par ex : `.code @pseudo`');
    }

    const mentionedId = message.mentionedIds[0];
    const code = generateCode(8);

    // Ici tu peux stocker ce code si tu veux pour gestion plus avancée

    const msg = `🔑 Ton code d’intégration est : *${code}*\nUtilise ce code pour connecter ton bot facilement.`;

    try {
      await client.sendMessage(mentionedId + '@c.us', msg);
      message.reply(`✅ Le code d’intégration a été envoyé en privé à <@${mentionedId}>.`);
    } catch (error) {
      message.reply('❌ Impossible d’envoyer le code en privé. Le bot doit avoir déjà eu un message de cet utilisateur.');
    }
  }
};
