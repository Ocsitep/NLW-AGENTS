const apiKeyInput = document.getElementById("apiKey");
const gameSelect = document.getElementById("gameSelect");
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const form = document.getElementById("form");
const aiResponse = document.getElementById("aiResponse");

// AIzaSyAUPnDU55BjAOzFIxy5nEK8NqvEhQ3cEb8

const askAI = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash";
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const userQuestion = `Sendo um especialista no game ${game}, me responda a pergunta: ${question}. Quero uma resposta objetiva, mas completa com explicações.`;

  const contents = [
    {
      parts: [
        {
          text: userQuestion,
        },
      ],
    },
  ];
  //chamada API
  const response = await fetch(geminiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
    }),
  });

  const data = await response.json();
  console.log({ data });
  return data.candidates[0].content.parts[0].text
};

const sendForm = async (event) => {
  event.preventDefault();
  const apiKey = apiKeyInput.value;
  const game = gameSelect.value;
  const question = questionInput.value;

  if (apiKey == "" || game == "" || question == "") {
    alert("Por favor, preencha todos os campos.");
    return;
  }
  askButton.disabled = true;
  askButton.textContent = "Perguntando...";
  askButton.classList.add("loading");

  try {
    const text = await askAI(question, game, apiKey);
  } catch (error) {
    console.log("Erro ao enviar o formulário:", error);
    alert("Ocorreu um erro ao enviar a pergunta. Por favor, tente novamente.");
  } finally {
    askButton.disabled = false;
    askButton.textContent = "Perguntar";
    askButton.classList.remove("loading");
  }
};

form.addEventListener("submit", sendForm);
