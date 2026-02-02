const RSSParser = require('rss-parser');
const axios = require('axios');
const parser = new RSSParser();

console.log("Webhook URL:", process.env.WEBHOOK_URL);
console.log("Feed URL:", process.env.RSS_FEED_URL);

// 從 Railway Variables 讀取
const webhookUrl = process.env.WEBHOOK_URL;
const feedUrl = process.env.RSS_FEED_URL;

let lastPostedLink = null;

async function checkFeed() {
    try {
        const feed = await parser.parseURL(feedUrl);
        const latest = feed.items[0]; // 抓最新一篇
        if (latest) {
            // 判斷是否已經推送過
            if (latest.link !== lastPostedLink) {
                await axios.post(webhookUrl, {
                    content: `${latest.title}\n${latest.link}`
                });
                lastPostedLink = latest.link; // 更新紀錄
                console.log('已推送最新貼文到 Discord！');
            } else {
                console.log('沒有新貼文，跳過推送。');
            }
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


