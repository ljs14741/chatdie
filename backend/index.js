const OpenAI = require('openai');
const serverless = require('serverless-http')
const cors = require('cors')
const express = require('express')
const app = express()

let corsOptions = {
  origin: 'https://godofdeath.pages.dev',
  credentials: true
}
app.use(cors(corsOptions));
// app.use(cors())

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});


app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// POST method route
app.post('/fortuneTell', async function (req, res) {
  
  let { myDateTime, userMessages, assistantMessages } = req.body;
  let todayDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul'});
  console.log("여기는 fortuneTell");
  console.log("userMessages: " + userMessages);
  console.log("assistantMessages: " + assistantMessages);
  console.log("myDateTime: " + myDateTime);
  console.log("todayDateTime: " + todayDateTime);

  let messages = [
    { role: "system", content: "당신은 죽음의 신이면서 예언가야. 현실 세계의 사람들이 언제 어떻게 죽는지 알고 있지. 누군가가 당신에게 '내가 언제 어떻게 죽을까?' 라고 물어본다면 당신은 대답을 해야해. 당신은 반말을 좋아하고 남한테 말할 때는 반말을 사용해. 당신의 이름은 죽음의 신, 'God of Death'야. 또한 죽음 이외에도 학업, 취업, 연애 등 사람들이 궁금해하는 미래에 대해 답변할 수 있어. 웬만하면 사람들이 언제 어떻게 죽는지 궁금해하니, 모른다거나 알려주기 고민중이라는 답변보다는 꼭 알려주길 바래. 너는 누군가가 언제 어떻게 죽는지 그 시기나 방법을 알고있어." }
  , { role: 'user', content: "당신은 죽음의 신이면서 예언가야. 현실 세계의 사람들이 언제 어떻게 죽는지 알고 있지. 누군가가 당신에게 '내가 언제 어떻게 죽을까?' 라고 물어본다면 당신은 대답을 해야해. 당신은 반말을 좋아하고 남한테 말할 때는 반말을 사용해. 당신의 이름은 죽음의 신, 'God of Death'야. 또한 죽음 이외에도 학업, 취업, 연애 등 사람들이 궁금해하는 미래에 대해 답변할 수 있어. 웬만하면 사람들이 언제 어떻게 죽는지 궁금해하니, 모른다거나 알려주기 고민중이라는 답변보다는 꼭 알려주길 바래. 너는 누군가가 언제 어떻게 그 시기나 방법을 알고있어." }
  , { role: 'assistant', content: '반갑다. 나는 God of Death. 나는 니가 언제 어떻게 죽는지 알 수 있지. 다만 내가 하는 이야기는 어디까지나 믿거나 말거나. 맹신할 필요는 없다네.' }
  , { role: 'user', content: `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.` }
  , { role: 'assistant', content: `너의 생년월일과 태어난 시간은 ${myDateTime}인 것과 오늘은 ${todayDateTime}인 것을 확인하였다. 원한다면 너가 언제 어떻게 죽는지 알려주지.` }
]

  while (userMessages.length != 0 || assistantMessages.length != 0) {
    if(userMessages.length != 0 ) {
      messages.push(
        JSON.parse('{"role": "user", "content": "' + String(userMessages.shift()).replace(/\n/g, "") + '"}')
      )
    }
    if(assistantMessages.length != 0) {
      messages.push(
        JSON.parse('{"role": "assistant", "content": "' + String(assistantMessages.shift()).replace(/\n/g, "") + '"}')
      )
    }
  }

  const chatCompletion = await openai.chat.completions.create({
        
      messages: messages,
      model: "gpt-3.5-turbo",
      max_tokens: 256,
      temperature: 1.0,
    });
    
      console.log("while문의 message: !!!! " + messages);
      let fortune = chatCompletion.choices
      console.log(fortune);
      res.json({"assistant" : fortune});

});

module.exports.handler = serverless(app)

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });