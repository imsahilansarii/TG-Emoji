const TelegramBot = require('node-telegram-bot-api');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

console.log("🚀 Advanced Emoji Extractor Bot Running...");


// ✅ START COMMAND
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id,
`✨ *Welcome to PRO Emoji Extractor Bot!*

🎯 Send any *Premium Emoji*
🖼 Or send with image/video caption

📦 Features:
• Multi emoji detection  
• Inline mode (@yourbot)  
• Copy-ready IDs  

👇 Try now!`,
    { parse_mode: "Markdown" }
    );
});


// ✅ MAIN MESSAGE HANDLER
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    const entities = msg.entities || msg.caption_entities;

    if (!entities) return;

    let emojiIds = [];

    entities.forEach((entity) => {
        if (entity.type === "custom_emoji") {
            emojiIds.push(entity.custom_emoji_id);
        }
    });

    if (emojiIds.length === 0) return;

    const uniqueIds = [...new Set(emojiIds)];

    const formatted = uniqueIds.map((id, i) => `🔹 *${i+1}.* \`${id}\``).join('\n');

    bot.sendMessage(chatId,
`🎯 *Emoji Extracted!*

📦 Total: *${uniqueIds.length}*

🆔 IDs:
${formatted}

📋 Tap below to copy`,
    {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "📋 Copy All IDs",
                        switch_inline_query: uniqueIds.join(" ")
                    }
                ]
            ]
        }
    });
});


// 🌐 INLINE MODE (IMPORTANT FEATURE)
bot.on('inline_query', (query) => {
    const text = query.query;

    let results = [];

    if (!text) {
        results.push({
            type: 'article',
            id: 'empty',
            title: 'Send emoji to extract ID',
            description: 'Type or paste premium emoji',
            input_message_content: {
                message_text: "👉 Send premium emoji to get ID"
            }
        });
    } else {
        results.push({
            type: 'article',
            id: 'result',
            title: 'Paste your text',
            description: text,
            input_message_content: {
                message_text: text
            }
        });
    }

    bot.answerInlineQuery(query.id, results, { cache_time: 0 });
});
