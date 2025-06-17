require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const { RichPresence, Util } = require('discord.js-selfbot-rpc');
const http = require('http');

const client = new Client();

// ヘルスチェック用HTTPサーバー
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('OK');
}).listen(process.env.PORT || 8000, () => {
  console.log(`ヘルスチェックサーバーがポート ${process.env.PORT || 8000} で起動しました`);
});

client.on('ready', async () => {
  console.log(`ログイン成功: ${client.user.tag}`);

  const applicationId = '1170557910988886046';

  let largeImage;
  try {
    largeImage = await Util.getAssets(applicationId, 'apex');
  } catch (error) {
    console.error('アセット取得エラー:', error);
    largeImage = null;
  }

  const presence = new RichPresence()
    .setStatus('online')
    .setType('PLAYING')
    .setApplicationId(applicationId)
    .setName('Apex Legends')
    .setDetails('Playing Ranked')
    .setState('King\'s Canyon')
    .setAssetsLargeImage(largeImage ? largeImage.id : undefined)
    .setAssetsLargeText('Apex Legends')
    .setTimestamp();

  client.user.setPresence(presence.toData());
  console.log('リッチプレゼンスを設定しました！');
});

// プロセスを維持するためのハートビート
setInterval(() => {
  console.log('ボットは動作中です...');
}, 60000);

client.login(process.env.DISCORD_TOKEN);
