const apiKeyInput = document.getElementById("apiKey");
const gameSelect = document.getElementById("gameSelect");
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const form = document.getElementById("form");
const aiResponse = document.getElementById("aiResponse");

const markdownToHTML = (text) => {
  const converter = new showdown.Converter();
  return converter.makeHtml(text);
};

const askAI = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash";
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const userQuestion = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}.
    ## Tarefa
    Você deve responder a pergunta do usuário com base no seu conhecimento sobre o jogo.
    Estratégias, builds, dicas e truques.
    ## Regras
     - Se você não sabe a resposta, diga que não sabe. Não tente inventar uma resposta.
     - Se a pergunta não for relacionada ao jogo, responda com "Essa pergunta não é sobre o jogo".
      - Considere a data atual ${new Date().toLocaleDateString()}.
     - Faça pesquisas atualizadas utilizando o patch atual do jogo para responder. Baseada na data atual.
     - Nunca responda itens que você não tenha certeza de que exista no patch atual do jogo.
    ## Resposta 
    -Economize na resposta. Seja direto e objetivo. 
    -No máximo 600 caracteres
    - Não precisa de nenhuma, saudação, despedida ou agradecimento.
    - Responda apenas a pergunta do usuário.
    - Organize a resposta em tópicos, se necessário.
    - Use markdown para formatar a resposta.
    - Use emojis gamers para deixar a resposta mais divertida.
    ## Pergunta do usuário
    ${question}?
  `;

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: userQuestion,
        },
      ],
    },
  ];

  const tools = [
    {
      google_search: {},
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
      tools,
    }),
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
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
    aiResponse.querySelector(".response-content").innerHTML =
      markdownToHTML(text);
    aiResponse.classList.remove("hidden");
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
