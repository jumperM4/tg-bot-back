const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");

// replace the value below with the Telegram token you receive from @BotFather
const token = "6557229242:AAE4Ssb_EBwzGalK01Rq2jWc8dE8xBE0SxQ";

const webAppUrl = "https://charming-stardust-35cb39.netlify.app";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Заходи на наш сайт!", {
      reply_markup: {
        keyboard: [
          [{ text: "Заполнить форму", web_app: { url: webAppUrl + "/form" } }],
        ],
      },
    });
  }

  if (text === "/start") {
    await bot.sendMessage(chatId, "Ниже появится кнопка, заполни форму", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Перейти в магазин", web_app: { url: webAppUrl } }],
        ],
      },
    });
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      await bot.sendMessage(chatId, "Спасибо за обратную связь!");
      await bot.sendMessage(chatId, "Ваша страна " + data?.country);
      await bot.sendMessage(chatId, "Ваша улица " + data?.street);

      setTimeout(async () => {
        await bot.sendMessage(chatId, "Вся информация будет в этом чате!");
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  }
});

app.post("/web-data", async (req, res) => {
  const { query_id, products, totalPrice } = req.body;

  try {
    bot.answerWebAppQuery(query_id, {
      type: "article",
      id: query_id,
      title: "Успешная покупка!",
      input_message_content: {
        message_text: `Поздравляем с покупкой! Сумма к оплате: ${totalPrice}`,
      },
    });
    return res.status(200).json({});
  } catch (err) {
    bot.answerWebAppQuery(query_id, {
      type: "article",
      id: query_id,
      title: "Не удалось приобрести товар!",
      input_message_content: {
        message_text: `Не удалось приобрести товар!`,
      },
    });
    return res.status(500).json({});
  }
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
