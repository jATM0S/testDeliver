(function () {
  // Inject the CSS
  const style = document.createElement("style");

  const config = window.chatWidgetConfig || {};
  const {
    bubbleBgColor,
    bubbleColor,

    chatBackgroundColor,
    chatBorder,
    headerBackgroundColor,
    headerTextColor,

    footerBackgroundColor,

    sendButtonColor,
    sendTextColor,

    headerText,
    inputBorderColor,
    placeholderText,
    inputTextColor,
    inputBgColor,

    questionTextColor,
    questionBackgroundColor,
    answerTextColor,
    answerBackgroundColor,
    faqTextColor,
    faqBackgroundColor,
    faqSectionBackgroundColor,
    Key,

    FAQs,
  } = config;
  // console.log(FAQs);
  // console.log(config);

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
      display: none;
    }
    #watermark{
      color:${watermarkColor};
    }
    #chat-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      flex-direction: column;
    }
    #chat-messages{
      border-top: 1px solid ${chatBorder};
      border-bottom: 1px solid ${chatBorder};
    }
    #chat-popup {
      height: 70vh;
      max-height: 70vh;
      transition: all 0.3s;
      overflow: hidden;
      background-color: ${chatBackgroundColor};
    }
    #chat-header{
      background-color:${headerBackgroundColor};
      color:${headerTextColor};
    }
    #chat-input-container{
      background-color:${footerBackgroundColor};
    }
    #chat-submit {
      color:${sendTextColor};
      background-color:${sendButtonColor};
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
    // .loader {
    //   text-align: left;
    //   display: flex;
    //   justify-content: flex-start; 
    // }

    // .loader span {
    //   display: inline-block;
    //   vertical-align: middle;
    //   width: 10px;
    //   height: 10px;
    //   background: black;
    //   border-radius: 50%;
    //   animation: loader 0.8s infinite alternate;
    // }

    // .loader span:nth-of-type(2) {
    //   animation-delay: 0.2s;
    // }

    // .loader span:nth-of-type(3) {
    //   animation-delay: 0.6s;
    // }

    // @keyframes loader {
    //   0% {
    //     opacity: 0.9;
    //     transform: scale(0.5);
    //   }
    //   100% {
    //     opacity: 0.1;
    //     transform: scale(1);
    //   }
    // }
.customDiv {
  background-color: #1f2937;
  color: white;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  max-width: 70%;
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

      <div id="chat-popup" class="absolute bottom-18 right-0 w-96 rounded-md shadow-md flex flex-col transition-all text-sm hidden">
        
        <div id="chat-header" class="flex justify-between items-center p-4 rounded-t-md">
          <h3 class="m-0 text-lg">${headerText}</h3>
          <button id="close-popup" class="border-none cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div id="chat-messages" class="flex-1 p-4 overflow-y-auto"></div>
        
        <div id="chat-questions" class="flex overflow-x-auto space-x-2 p-4">
        </div>

        <div id="chat-input-container" class="p-4">
          <div class="flex space-x-4 items-center">
            <input type="text" id="chat-input" placeholder="${placeholderText}">
            <button id="chat-submit">Send</button>
          </div>
          <div class="flex text-center text-xs pt-4">
            <span class="flex-1" id="watermark">Powered by Wishchat</span>
          </div>
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
  if (FAQs) {
    FAQs.forEach((faq) => {
      const questionBtn = document.createElement("button");
      questionBtn.className =
        "bg-gray-200 px-2 py-2 rounded-md whitespace-nowrap flex-shrink-0 text-xs text-black";
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
    const messageElement = document.createElement("div");
    messageElement.className = "flex justify-end mb-3";
    messageElement.innerHTML = `
      <div class="bg-gray-800 text-white rounded-lg py-2 px-4 max-w-[70%]">
        ${question}
      </div>
    `;
    chatMessages.appendChild(messageElement);
    const replyElement = document.createElement("div");
    replyElement.className = "flex mb-3";
    replyElement.innerHTML = `
        <div class="bg-gray-200 text-black rounded-lg py-2 px-4 max-w-[70%]">
          ${answer}
        </div>
      `;
    const chatLoadingDiv = document.getElementById("chat-loading");
    if (chatLoadingDiv) {
      chatLoadingDiv.remove();
    }
    chatMessages.appendChild(replyElement);
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

  chatBubble.addEventListener("click", function () {
    togglePopup();
  });

  closePopup.addEventListener("click", function () {
    togglePopup();
  });

  function togglePopup() {
    chatPopup.classList.toggle("hidden");
    if (!chatPopup.classList.contains("hidden")) {
      document.getElementById("chat-input").focus();
    }
  }
  const handlePrompt = async (message) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}api/query/`,
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
    const messageElement = document.createElement("div");
    messageElement.className = "flex justify-end mb-3";
    messageElement.innerHTML = `
        <div class="bg-gray-800 text-white rounded-lg py-2 px-4 max-w-[70%]">
          ${message}
        </div>
      `;
    chatMessages.appendChild(messageElement);

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
    const replyElement = document.createElement("div");
    replyElement.className = "flex mb-3";
    
    const messageContainer = document.createElement("div");
    messageContainer.className = "bg-gray-200 text-black rounded-lg py-2 px-4 max-w-[70%]";
    replyElement.appendChild(messageContainer);
  
    const chatLoadingDiv = document.getElementById("chat-loading");
    if (chatLoadingDiv) {
      chatLoadingDiv.remove();
    }
  
    chatMessages.appendChild(replyElement);
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
