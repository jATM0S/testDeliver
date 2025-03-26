(function () {
  // Inject the CSS
  const style = document.createElement("style");
  const config = window.chatWidgetConfig || {};
  const {
    bubbleBgColor = "#1E3A8A",
    bubbleColor = "#FFFFFF",

    chatBackgroundColor = "#F0F4F8",
    chatBorder = "#C6D1E1",
    headerBackgroundColor = "#3B82F6",
    headerTextColor = "#FFFFFF",

    footerBackgroundColor = "#1E3A8A",

    sendButtonColor = "#2563EB",
    sendTextColor = "#FFFFFF",

    headerText = "Chat with us",
    inputBorderColor = "#3B82F6",
    placeholderText = "Type your message here...",
    inputTextColor = "#1F2937",
    inputBgColor = "#E0E7FF",

    questionTextColor = "#ffffff",
    questionBackgroundColor = "#2d3748",
    answerTextColor = "#000000",
    answerBackgroundColor = "#e5e7eb",
    faqTextColor = "#000000",
    faqBackgroundColor = "#e5e7eb",
    faqSectionBackgroundColor = "#000000",
    Key,

    FAQs,
  } = config;

  function getFooterWatermarkColor(hex, factor = 0.4) {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    // Calculate brightness using perceived luminance formula
    let brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

    // Adjust color: if bright, darken; if dark, lighten
    if (brightness > 0.5) {
      r = Math.floor(r * (1 - factor));
      g = Math.floor(g * (1 - factor));
      b = Math.floor(b * (1 - factor));
    } else {
      r = Math.min(255, Math.floor(r + (255 - r) * factor));
      g = Math.min(255, Math.floor(g + (255 - g) * factor));
      b = Math.min(255, Math.floor(b + (255 - b) * factor));
    }

    // Convert back to hex
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  const watermarkColor = getFooterWatermarkColor(footerBackgroundColor);

  style.innerHTML = `
    .hidden {
      display: none !important;
    }
    #chat-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      flex-direction: column;
    }
    
    #chat-bubble{
      background-color:${bubbleBgColor};
      color:${bubbleColor};
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.875rem;
    }
    #chat-button{
      height: 2.5rem;
      width: 2.5rem;
    }
    
    #chat-popup {
      height: 70vh;
      max-height: 70vh;
      transition: all 0.3s;
      overflow: hidden;
      background-color: ${chatBackgroundColor};
      position: absolute;
      bottom: 4.5rem;
      right: 0;
      width: 24rem;
      border-radius: 0.375rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      font-size: 0.875rem;
    }
    #chat-messages{
      border-top: 1px solid ${chatBorder};
      border-bottom: 1px solid ${chatBorder};
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
    }
    #chat-questions {
      background-color:${faqSectionBackgroundColor};
      display: flex;
      overflow-x: auto;
      gap: 0.5rem;
      padding: 1rem;
    }

    #chat-header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: ${headerBackgroundColor};
      color: ${headerTextColor};
      border-top-left-radius: 0.375rem;
      border-top-right-radius: 0.375rem;
    }
    #chat-header h3 {
      margin: 0;
      font-size: 1.125rem;
    }
    #close-popup{
      border: none;
      cursor: pointer;
      background-color:inherit;
    }
    #close-popup svg{
      height:1.5rem;
      width:1.5rem;
      color: ${headerTextColor};
      stroke: currentColor;
      fill: currentColor;
    }

    #chat-input-container{
      background-color:${footerBackgroundColor};
      padding:1rem;
    }
    #chat-input-container div{
      display:flex;
      align-items:center;
      gap:1rem;
    }
    #chat-submit {
      color:${sendTextColor};
      background-color:${sendButtonColor};
    }
    #chat-input{
      background-color:${inputBgColor};
      color:${inputTextColor};
      border: 1px solid ${inputBorderColor};
      outline: none;
      border-radius: 6px;
      padding: 8px 16px;
      flex: 1;
      width: 75%;
    }
    #chat-input::placeholder {
      color: ${inputTextColor};
      opacity: 0.7;
    }

    #chat-submit {
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
    }
    
    #watermark{
      color:${watermarkColor};
      text-align:center;
      font-size:0.75rem;
      padding-top:1rem;
    }
    
    #faq-button{
      background-color: ${faqBackgroundColor};
      padding: 0.5rem 0.5rem;
      border-radius: 0.375rem;
      border:none;
      white-space: nowrap;
      flex-shrink: 0;
      font-size: 0.75rem;
      color: ${faqTextColor};
    }
    
    #question{
      display:flex;
      justify-content: flex-end;
      margin-bottom:0.75rem;
    }
    #question div{
      background-color:${questionBackgroundColor} ;
      color: ${questionTextColor};
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      max-width: 70%;
    }
    #answer{
      margin-bottom:0.75rem;
      display:flex;
    }
    #answer div{
      max-width:70%;
      border-radius:0.5rem;
      padding:0.5rem 1rem;
      color:${answerTextColor};
      background-color: ${answerBackgroundColor};
    }
    .loader {
      width: 40px;
      aspect-ratio: 2;
      --_g: no-repeat radial-gradient(circle closest-side,#000 90%,#0000);
      background: 
        var(--_g) 0%   50%,
        var(--_g) 50%  50%,
        var(--_g) 100% 50%;
      background-size: calc(100%/3) 50%;
      animation: l3 1s infinite linear;
    }
    @keyframes l3 {
      20%{background-position:0%   0%, 50%  50%,100%  50%}
      40%{background-position:0% 100%, 50%   0%,100%  50%}
      60%{background-position:0%  50%, 50% 100%,100%   0%}
      80%{background-position:0%  50%, 50%  50%,100% 100%}
    }

    @media (max-width: 640px) {
      #chat-popup {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        max-height: 100%;
      }
    }
    `;

  document.head.appendChild(style);

  // Create chat widget container
  const chatWidgetContainer = document.createElement("div");
  chatWidgetContainer.id = "chat-widget-container";
  document.body.appendChild(chatWidgetContainer);

  // Inject the HTML
  chatWidgetContainer.innerHTML = `
      <div id="chat-bubble">
        <svg xmlns="http://www.w3.org/2000/svg" id="chat-button" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>

      <div id="chat-popup" >
        
        <div id="chat-header" >
          <h3>${headerText}</h3>
          <button id="close-popup">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div id="chat-messages"></div>
        
        <div id="chat-questions">
        </div>

        <div id="chat-input-container" >
          <div>
            <input type="text" id="chat-input" placeholder="${placeholderText}">
            <button id="chat-submit">Send</button>
          </div>
          <p id="watermark">Powered by Wishchat</p>
        </div>

      </div>
    `;

  // Add event listeners
  const chatInput = document.getElementById("chat-input");
  const chatSubmit = document.getElementById("chat-submit");
  const chatMessages = document.getElementById("chat-messages");
  const chatBubble = document.getElementById("chat-bubble");
  const chatPopup = document.getElementById("chat-popup");
  const closePopup = document.getElementById("close-popup");
  const chatQuestions = document.getElementById("chat-questions");
  chatBubble.addEventListener("click", function () {
    console.log("ChatBubble clicked!!");
    console.log("before bubble:", chatPopup.classList);
    togglePopup();
    console.log("after bubble:", chatPopup.classList);
  });

  closePopup.addEventListener("click", function () {
    console.log("close button clicked!!");
    console.log("Before close button:", chatPopup.classList);
    togglePopup();
    console.log("After close button:", chatPopup.classList);
  });

  function togglePopup() {
    chatPopup.classList.toggle("hidden");
    if (!chatPopup.classList.contains("hidden")) {
      document.getElementById("chat-input").focus();
    }
  }

  if (FAQs) {
    FAQs.forEach((faq) => {
      const questionBtn = document.createElement("button");
      questionBtn.id = "faq-button";
      questionBtn.textContent = faq.question;
      chatQuestions.appendChild(questionBtn);
      questionBtn.addEventListener("click", () => {
        handleFAQ(faq.question, faq.answer);
      });
    });
  } else {
    chatQuestions.remove();
  }
  function handleFAQ(question, answer) {
    const questionElement = document.createElement("div");
    questionElement.id = "question";

    questionElement.innerHTML = `
      <div>
        ${question}
      </div>
    `;
    chatMessages.appendChild(questionElement);
    reply(answer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatSubmit.addEventListener("click", function () {
    const message = chatInput.value.trim();
    if (!message) return;

    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatInput.value = "";

    onUserRequest(message);
  });

  chatInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      chatSubmit.click();
    }
  });

  const handlePrompt = async (message) => {
    try {
      const response = await fetch(
        `https://kfwsdw58-8000.inc1.devtunnels.ms/api/query/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": `${Key}`,
          },
          body: JSON.stringify({
            query: message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Response from backend:", data);
      return data.response;
    } catch (error) {
      console.error("Error sending request:", error);
      return "Error occurred while processing your request.";
    }
  };

  function onUserRequest(message) {
    // Handle user request here
    console.log("User request:", message);

    // Display user message
    const questionElement = document.createElement("div");
    questionElement.id = "question";
    questionElement.innerHTML = `
        <div>
          ${message}
        </div>
      `;
    chatMessages.appendChild(questionElement);

    const chatLoadingDiv = document.createElement("div");
    chatLoadingDiv.id = "chat-loading";
    chatLoadingDiv.classList.add("loader");
    for (let i = 0; i < 3; i++) {
      const span = document.createElement("span");
      chatLoadingDiv.appendChild(span);
    }
    chatMessages.appendChild(chatLoadingDiv);
    chatInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    (async () => {
      const answer = await handlePrompt(message);
      reply(answer);
    })();
  }

  function reply(message) {
    const answerElement = document.createElement("div");
    answerElement.id = "answer";
    const messageContainer = document.createElement("div");
    answerElement.appendChild(messageContainer);

    const chatLoadingDiv = document.getElementById("chat-loading");
    if (chatLoadingDiv) {
      chatLoadingDiv.remove();
    }

    chatMessages.appendChild(answerElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    let index = 0;

    function typeWriter() {
      if (index < message.length) {
        messageContainer.innerHTML = message.substring(0, index + 1);
        index++;
        setTimeout(typeWriter, 5);
      }
    }

    typeWriter();
  }
})();
