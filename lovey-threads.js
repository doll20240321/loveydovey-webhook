const RSSParser = require('rss-parser');
const axios = require('axios');
const parser = new RSSParser();

// 從 Railway Variables 讀取
const webhookUrl = process.env.webhook-url;
const feedUrl = process.env.rss-feed-url;

async function checkFeed() {
    try {
        const feed = await parser.parseURL(feedUrl);
        const latest = feed.items[0]; // 抓最新一篇
        if (latest) {
            await axios.post(webhookUrl, {
                content: `${latest.title}\n${latest.link}`
            });
            console.log('已推送最新貼文到 Discord！');
        } else {
            console.log('目前 RSS 沒有內容。');
        }
    } catch (err) {
        console.error('抓取 RSS 發生錯誤：', err.message);
    }
}

// 先測試一次
checkFeed();

// 定時檢查（例如每小時一次）
setInterval(checkFeed, 60 * 60 * 1000);

// 額外測試 webhook 是否能送出訊息
axios.post(webhookUrl, {
  content: "測試"
})
.then(() => console.log("成功"))
.catch(err => console.error("失敗", err));

