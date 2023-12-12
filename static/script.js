document.addEventListener('DOMContentLoaded', function() {
    const chatHistory = document.getElementById('chat-history');
    const userMessageInput = document.getElementById('user-message');
    const sendButton = document.getElementById('send-button');

    let initialPrompt = 1;
    let messages = [];
    sendMessageToServer();

    // Function to update the chat history on the page
    function updateChatHistory() {
        chatHistory.innerHTML = '';
        messages.forEach(message => {
            if(message.role !== 'system') {
                const messageDiv = document.createElement('div');
                messageDiv.className = message.role === 'user' ? 'user-message message' : 'assistant-message message';
                messageDiv.textContent = message.content;
                chatHistory.appendChild(messageDiv);
            }
        });
        // Scroll to the bottom of the chat history
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function sendMessageToServer() {
        let userMessage;
        if(initialPrompt === 1) {
            let rolePrompt = "現在你要扮演 AI 餐飲小助手「胖胖」，相當於服務生角色，幫大家處理餐廳訂位、點餐、結帳相關流程。以下是注意事項，請遵守每一項： 1. 請按照劇本流程輸出，並等待顧客的回應，千萬不要自己走完全部的對話流程，你只會扮演餐飲小助手而已 2. 若顧客沒有做出符合預期的回應（比如沒有選擇你提供的選項），請覆述一次 prompt。 3. 若顧客少提供資訊，請提示顧客提供完整的資訊。 4. 若顧客預訂日期為 12/24，請回覆「當天已客滿，請重新輸入預定日期」，並接到原流程（確認訂位資訊），不應讓顧客預定任何 12/24 時段位子。 5. 你不應該印出任何流程標號與名稱。 6. 我們的菜單如下，請適時提供，若顧客輸入為編號，請將編號對應回菜單品項，且前菜/主餐/點心只能各點一樣： **前菜：** a1. 鮭魚塔塔 $200元/份 a2. 焗烤法式蜗牛配松露醬 $250元/份  **主餐：** b1. 精選和牛扒，搭配紅酒梅汁 $350元/份 b2. 白酒燴龍蝦配松露奶油醬 $300元/份 b3. 松露焗烤野菌燉飯 $280元/份  **點心：** c1. 巧克力榛果慕斯 $120元/份 c2. 香草焦糖布丁 $120元/份 c3. 焦糖海鹽巧克力松露 $150元/份  接著是流程相關事項： 最一開始，詢問顧客要： a. 訂位、b. 外帶、c. 內用點餐，顧客選擇完跳至對應流程，三個流程分別如下：  a. 訂位： 步驟一：詢問顧客資訊，包含姓氏、預定人數(幾大幾小)、聯絡電話、預定日期、預定時間供顧客，特別注意預定日期一定要是當天(含當天)以後一個月內的日期，否則要求顧客重新選擇。預定時間選擇：a. 11:00 b. 11:30 c. 12:00 d. 12:30 e. 13:00 f. 13:30。 步驟二：確認訂位資訊，先檢查顧客是否針對每一項都有提供完整資訊，接著覆述一次，詢問顧客是否資訊有誤。 步驟三：詢問備註，如是否需要兒童椅。 步驟四：回覆訂位成功，結束訂位流程。  b. 外帶： 步驟一：提供菜單，等待顧客選擇要外帶餐點。 步驟二：檢查顧客餐點是否符合菜單品項（比如輸入菜單上沒有的數字或品項名稱，或資訊輸入不完全），若不完全，要求顧客重新輸入。 步驟三：確認餐點資訊，覆述顧客選擇餐點，詢問是否有誤。 步驟四：詢問訂購人資訊，包含姓氏、聯絡電話。 步驟五：確認訂購人資訊，覆述一次詢問是否有誤。 步驟六：詢問有無其他餐點備註？ 步驟七：告知外帶餐點訂購成功，預計 20 分鐘後可取餐。  c. 內用點餐與結帳： 步驟一：提供菜單，等待顧客選擇內用餐點。 步驟二：詢問顧客資訊包含桌號、餐點，而且顧客的餐點必須是菜單上有提供的餐點 步驟三：你必須確認顧桌號與餐點，並且再次列出向顧客確認，而且顧客的餐點必須是菜單上有提供的餐點，否則要求他再輸入一次。 請注意下方為例外流程： 若餐點不在菜單上(包含顧客輸入錯誤)/季節限定品項 -> 回覆「目前不提供 {...} 餐點，是否繼續點餐？」 是，保留現有餐點，繼續點餐（系統確認是否有其他餐點，決定下面兩者之一選項） 否，保留現有餐點 (有其他餐點的情況) 否，取消點餐 步驟四：根據餐點內容計算今日的消費金額，再和顧客確認「餐點內容」以及「今日消費金額」。若有錯誤，請再次跟顧客確認今日的餐點；確認無誤後，才可以進到下一個步驟。 步驟五： 請顧客選擇「存入發票的形式」，總共有兩種：「載具」和「紙本發票」。顧客選擇存入「載具」，你需要詢問顧客的「載具號碼」；若顧客選擇「紙本發票」，你則需要詢問顧客的「紙本發票寄送地址」。選擇結束之後，和顧客確認所詢問到的資訊，若資訊不正確，請再詢問顧客一次。 步驟六：確認完發票形式之後，請讓顧客擇一選擇「結帳方式」，總共有三種：「現金」、「信用卡」、「行動支付」。若顧客選擇「現金」，請你告訴顧客「請他到櫃檯結帳」；若顧客選擇「信用卡」，你則需要詢問顧客的信用卡資訊：信用卡號、信用卡到期日、手機號碼，以上三種資訊缺少任一個或一個以上，視為交易失敗例如：顧客只有提供信用卡到期日，沒有提供信用卡號和手機號碼，為交易失敗，請讓顧客重新填寫，或是讓顧客重新選擇其他付款方式。若顧客選擇「行動支付」，請你讓顧客擇一選擇以下行動支付種類：「apple pay」、「samsung pay」、「line pay」、「街口支付」，如果顧客選擇的支付方式不是以上這4種方式，視為交易失敗，例如顧客選擇「台灣pay」，為交易失敗，請你再重新讓顧客選擇行動支付種類，或是讓顧客重新選擇其他付款方式。 步驟七：結束結帳流程，不論顧客選擇何種付款方式，皆需提供回饋表單讓顧客填寫（https://forms.gle/q83b1wbU3vo9Pvu47），請不要把後續的文字也變成表單超連結。  接下來，我會扮演顧客的角色跟你對話，請你依照上面內容，一步一步詢問你所需要的資訊。請開始扮演胖胖吧！請先親切地自我介紹。";
            userMessage = rolePrompt;
        } else {
            userMessage = userMessageInput.value.trim();
        }

        if (userMessage !== '') {
            if(initialPrompt === 1) {
                initialPrompt = 0;
                messages.push({ role: 'system', content: userMessage });
            } else {
                // Add user's message to the local messages array
                messages.push({ role: 'user', content: userMessage });
            }
            updateChatHistory();

            // Send user's message to the server
            fetch('/send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    messages: messages,
                }),
            })
            .then(response => response.json())
            .then(data => {
                // Update local messages with server's response
                messages = data.history;
                console.log(messages);
                updateChatHistory();
            });

            // Clear the input field
            userMessageInput.value = '';
        }
    }

    sendButton.addEventListener('click', function(event) {
        event.preventDefault();
        sendMessageToServer();
    });

    // Deal with Chinese input
    let composing = false;   // trace composition
    userMessageInput.addEventListener('compositionstart', function(event) {
        composing = true;
    });

    userMessageInput.addEventListener('compositionend', function(event) {
        composing = false;
    });

    userMessageInput.addEventListener('keydown', function(event) {
        if (!composing && event.key === 'Enter') {
            event.preventDefault();
            sendMessageToServer();
        }
    });

    // Initial call to get the chat history from the server
    fetch('/get_chat_history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: messages,
        }),
    })
    .then(response => response.json())
    .then(data => {
        // Update local messages with server's response
        messages = data.history;
        updateChatHistory();
    });
});
