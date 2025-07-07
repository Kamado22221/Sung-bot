const { Configuration, OpenAIApi } = require('openai');
const config = require('../config');

const configuration = new Configuration({
  apiKey: config.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  name: 'ai',
  description: 'Pose une question à ChatGPT',
  ownerOnly: false,
  async execute(client, message, args) {
    if (!args.length) {
      return message.reply('❗️ Merci de fournir une question.');
    }
    const prompt = args.join(' ');
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });
      const answer = response.data.choices[0].message.content;
      message.reply(answer);
    } catch (error) {
      message.reply('❌ Erreur lors de la requête à OpenAI.');
    }
  }
};
