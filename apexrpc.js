require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const { RichPresence, Util } = require('discord.js-selfbot-rpc');
const http = require('http');

const client = new Client({ checkUpdate: false });

// ヘルスチェック用HTTPサーバー
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('OK');
}).listen(process.env.PORT || 10000, () => {
  console.log(`ヘルスチェックサーバーがポート ${process.env.PORT || 10000} で起動しました`);
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
}, 60000); // 60秒

client.on('error', (error) => {
  console.error('クライアントエラー:', error);
  process.exit(1);
});

client.on('rateLimit', (info) => {
  console.warn('レート制限:', info);
});

// SIGTERMの適切な処理
process.on('SIGTERM', () => {
  console.log('SIGTERM シグナルを受信。プロセスを終了します...');
  client.destroy().catch((err) => console.error('クライアント終了エラー:', err));
  server.close((err) => {
    if (err) console.error('サーバー終了エラー:', err);
    console.log('ヘルスチェックサーバーを終了しました');
    process.exit(0);
  });
});

// 未処理の例外をキャッチ
process.on('uncaughtException', (error) => {
  console.error('未処理の例外:', error);
  process.exit(1);
});

// 未処理のPromise拒否をキャッチ
process.on('unhandledRejection', (reason, promise) => {
  console.error('未処理のPromise拒否:', reason);
});

// Discordにログイン
client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error('ログインエラー:', error);
  process.exit(1);
});
