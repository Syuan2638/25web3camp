document.addEventListener('DOMContentLoaded', () => {
    // --- 獲取所有元素 ---
    const body = document.body;
    const envelopePage = document.getElementById('envelope-page');
    const strandsPage = document.getElementById('strands-page');
    const animalPuzzlePage = document.getElementById('animal-puzzle-page');
    const animalInput = document.getElementById('animal-input');
    const letterPage = document.getElementById('letter-page');
    const gameContainer = document.getElementById('game-container');
    const endingPage = document.getElementById('ending-page');
    const quizPage = document.getElementById('quiz-page');
    const continueToGameButton = document.getElementById('continue-to-game-button');
    const backToLetterButton = document.getElementById('back-to-letter-button');
    const finalPuzzle = document.getElementById('final-puzzle');
    const magicInput = document.getElementById('magic-input');
    const gameBoardElement = document.getElementById('game-board');
    const minesCountElement = document.getElementById('mines-count');
    const resetButton = document.getElementById('reset-button');
    const showQuizButton = document.getElementById('show-quiz-button');
    const hintContainerElement = document.getElementById('hint-container');
    const toolPopup = document.getElementById('tool-popup');
    const toolShovel = document.getElementById('tool-shovel');
    const toolFlag = document.getElementById('tool-flag');
    const quizContainer = document.querySelector('#quiz-page .quiz-container');
    const submitQuizButton = document.getElementById('submit-quiz-button');
    const hintLine1 = document.getElementById('hint-line-1');
    const hintLine2 = document.getElementById('hint-line-2');
    const finalKeyInput = document.getElementById('final-key-input');

    // ===== 初始載入時，為第一頁顯示背景 =====
    body.classList.add('show-animals-bg');

    // --- 開場動畫與頁面切換事件 ---
    envelopePage.addEventListener('click', () => {
        envelopePage.classList.add('hidden');
        strandsPage.classList.remove('hidden');
        initializeStrandsGame();
        body.classList.add('show-animals-bg');
    });

    animalInput.addEventListener('input', (event) => {
        const rawInput = event.target.value.trim();
        const cleanedInput = rawInput.toLowerCase();
        
        if (cleanedInput === 'fox') { 
            animalInput.disabled = true;
            
            setTimeout(() => {
                animalPuzzlePage.classList.add('hidden');
                letterPage.classList.remove('hidden');
                body.classList.add('show-animals-bg');
                setTimeout(() => { continueToGameButton.classList.remove('hidden'); }, 10000);
                
                animalInput.disabled = false;
                animalInput.value = '';
            }, 500);
        }
    });

    continueToGameButton.addEventListener('click', () => {
        letterPage.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        body.classList.remove('show-animals-bg');
        startGame();
    });

    backToLetterButton.addEventListener('click', () => {
        gameContainer.classList.add('hidden');
        letterPage.classList.remove('hidden');
        body.classList.add('show-animals-bg');
    });
    
    magicInput.addEventListener('input', (event) => {
        const rawInput = event.target.value;
        const cleanedInput = rawInput.toUpperCase().replace(/\s/g, '');
        if (cleanedInput === 'ILOVEYOU') {
            magicInput.disabled = true;
            setTimeout(() => {
                gameContainer.classList.add('hidden');
                endingPage.classList.remove('hidden');
                
                body.classList.remove('show-animals-bg');
                body.classList.add('show-secret-bg');

            }, 500);
        }
    });

    showQuizButton.addEventListener('click', () => {
        gameContainer.classList.add('hidden');
        quizPage.classList.remove('hidden');
        body.classList.remove('show-animals-bg');
        generateQuiz();
    });

    submitQuizButton.addEventListener('click', () => {
        checkQuizAnswers();
    });

    finalKeyInput.addEventListener('input', (event) => {
        const userInput = event.target.value;
        const correctAnswer = 'f8971dac3d7';

        if (userInput === correctAnswer) {
            finalKeyInput.disabled = true;
            finalKeyInput.classList.add('success');
            setTimeout(() => {
                alert('恭喜你，這就是我們之間的魔法連結！');
            }, 300);
        }
    });

    // --- 連線遊戲 (Strands) 邏輯 ---
    const strandsBoardElement = document.getElementById('strands-board');
    const strandsWordsToFindElement = document.getElementById('strands-words-to-find');

    const STRANDS_GRID = [
        ['m', 'n', 'i', 'c', 'e', 't', 'l'],
        ['e', 'e', 't', 'o', 'o', 'p', 'i'],
        ['t', 'h', 'a', 'l', 'k', 'a', 'o'],
        ['e', 'k', 'a', 'm', 'b', 'd', 't'],
        ['e', 'r', 's', 'o', 'l', 'o', 'n'],
        ['u', 'k', 'c', 'a', 'i', 'c', 'i'],
        ['m', 'c', 'h', 'n', 't', 'i', 'b']
    ];

    const STRANDS_DATA = {
        themeWords: [
            {
                word: "metamask",
                coords: [
                    { r: 0, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 2, c: 2 },
                    { r: 3, c: 3 }, { r: 3, c: 2 }, { r: 4, c: 2 }, { r: 3, c: 1 }
                ]
            },
            {
                word: "bitcoin",
                coords: [
                    { r: 6, c: 6 }, { r: 6, c: 5 }, { r: 6, c: 4 }, { r: 5, c: 5 },
                    { r: 4, c: 5 }, { r: 5, c: 6 }, { r: 4, c: 6 }
                ]
            },
            {
                word: "ethereum",
                coords: [
                    { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 3, c: 0 },
                    { r: 4, c: 1 }, { r: 4, c: 0 }, { r: 5, c: 0 }, { r: 6, c: 0 }
                ]
            },
            {
                word: "polkadot",
                coords: [
                    { r: 1, c: 5 }, { r: 1, c: 4 }, { r: 2, c: 3 }, { r: 2, c: 4 },
                    { r: 2, c: 5 }, { r: 3, c: 5 }, { r: 2, c: 6 }, { r: 3, c: 6 }
                ]
            },
            {
                word: "litecoin",
                coords: [
                    { r: 0, c: 6 }, { r: 1, c: 6 }, { r: 0, c: 5 }, { r: 0, c: 4 },
                    { r: 0, c: 3 }, { r: 1, c: 3 }, { r: 0, c: 2 }, { r: 0, c: 1 }
                ]
            },
            {
                word: "blockchain",
                coords: [
                    { r: 3, c: 4 }, { r: 4, c: 4 }, { r: 4, c: 3 }, { r: 5, c: 2 },
                    { r: 5, c: 1 }, { r: 6, c: 1 }, { r: 6, c: 2 }, { r: 5, c: 3 },
                    { r: 5, c: 4 }, { r: 6, c: 3 }
                ]
            }
        ]
    };

    let strandsState = {};

    function initializeStrandsGame() {
        strandsState = {
            currentSelection: [],
            foundWords: new Set()
        };

        strandsBoardElement.innerHTML = '';
        strandsBoardElement.style.animation = '';
        STRANDS_GRID.forEach((row, r) => {
            row.forEach((char, c) => {
                const cell = document.createElement('div');
                cell.classList.add('strands-cell');
                cell.textContent = char;
                cell.dataset.r = r;
                cell.dataset.c = c;
                strandsBoardElement.appendChild(cell);
            });
        });

        strandsWordsToFindElement.innerHTML = '';
        const wordOrder = ["metamask", "bitcoin", "ethereum", "polkadot", "litecoin", "blockchain"];
        wordOrder.forEach(word => {
            const wordEl = document.createElement('span');
            wordEl.classList.add('strands-word-display');
            wordEl.id = `word-${word}`;
            wordEl.textContent = '＿'.repeat(word.length);
            strandsWordsToFindElement.appendChild(wordEl);
        });
        
        strandsBoardElement.addEventListener('click', handleStrandsCellClick);
    }

    function handleStrandsCellClick(e) {
        if (!e.target.classList.contains('strands-cell')) return;
        const cell = e.target;
        
        if (cell.classList.contains('found-theme')) return;

        const r = parseInt(cell.dataset.r);
        const c = parseInt(cell.dataset.c);

        const existingSelectionIndex = strandsState.currentSelection.findIndex(s => s.r === r && s.c === c);
        if (existingSelectionIndex !== -1) {
            clearSelection();
            return;
        }

        const lastCell = strandsState.currentSelection.length > 0 ? strandsState.currentSelection[strandsState.currentSelection.length - 1] : null;

        if (!lastCell || (Math.abs(r - lastCell.r) <= 1 && Math.abs(c - lastCell.c) <= 1)) {
            strandsState.currentSelection.push({ r, c });
            cell.classList.add('selected');
        } else {
            clearSelection();
            strandsState.currentSelection.push({ r, c });
            cell.classList.add('selected');
        }
        
        checkCurrentPathForMatch();
    }

    function clearSelection() {
        document.querySelectorAll('.strands-cell.selected').forEach(c => c.classList.remove('selected'));
        strandsState.currentSelection = [];
    }

    function checkCurrentPathForMatch() {
        const selectionPathString = strandsState.currentSelection.map(cell => `${cell.r}-${cell.c}`).join(' ');

        for (const wordData of STRANDS_DATA.themeWords) {
            if (strandsState.foundWords.has(wordData.word)) continue;

            const answerPathString = wordData.coords.map(cell => `${cell.r}-${cell.c}`).join(' ');
            
            if (selectionPathString === answerPathString) {
                markWordAsFound(wordData);
                clearSelection();
                checkStrandsWin();
                return;
            }
        }
    }
    
    function markWordAsFound(wordData) {
        strandsState.foundWords.add(wordData.word);
        wordData.coords.forEach(coord => {
            const cell = document.querySelector(`.strands-cell[data-r="${coord.r}"][data-c="${coord.c}"]`);
            if (cell) {
                cell.classList.add('found-theme');
            }
        });

        const wordDisplay = document.getElementById(`word-${wordData.word}`);
        if(wordDisplay) {
            wordDisplay.textContent = wordData.word;
            wordDisplay.classList.add('found');
        }
    }

    function checkStrandsWin() {
        if (strandsState.foundWords.size === STRANDS_DATA.themeWords.length) {
            setTimeout(() => {
                alert('恭喜你！你找到了所有關鍵詞。');
                strandsPage.classList.add('hidden');
                animalPuzzlePage.classList.remove('hidden');
            }, 500);
        }
    }

    // --- 踩地雷遊戲設定 ---
    const BOARD_WIDTH = 15, BOARD_HEIGHT = 5;
    const MINE_LOCATIONS = [
        { r: 0, c: 0 }, { r: 4, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 1 }, { r: 2, c: 1 }, { r: 3, c: 1 }, { r: 4, c: 1 },
        { r: 0, c: 2 }, { r: 4, c: 2 }, { r: 1, c: 3 }, { r: 0, c: 4 }, { r: 2, c: 4 }, { r: 3, c: 5 }, { r: 1, c: 6 },
        { r: 4, c: 6 }, { r: 3, c: 7 }, { r: 0, c: 8 }, { r: 2, c: 8 }, { r: 1, c: 9 }, { r: 0, c: 10 }, { r: 1, c: 11 },
        { r: 2, c: 12 }, { r: 3, c: 12 }, { r: 4, c: 12 }, { r: 1, c: 13 }, { r: 0, c: 14 }
    ];
    const MINE_COUNT = MINE_LOCATIONS.length;
    const PRESET_INITIAL_CELLS = [
        { r: 2, c: 0 }, { r: 1, c: 2 }, { r: 2, c: 2 }, { r: 3, c: 2 }, { r: 3, c: 4 },
        { r: 4, c: 4 }, { r: 0, c: 6 }, { r: 4, c: 7 }, { r: 4, c: 9 }, { r: 1, c: 10 },
        { r: 3, c: 10 }, { r: 4, c: 10 }, { r: 3, c: 11 }, { r: 3, c: 13 }, { r: 1, c: 14 },
        { r: 3, c: 14 }, { r: 4, c: 14 }
    ];

    // ▼▼▼ 題庫更新 ▼▼▼
    const quizQuestions = [
        { question: "在一座與世隔絕的寺廟裡，僧侶們守護著一口「宿命之井」。井中映照的未來，由所有住持級僧侶的禪定之力共同交織而成。", options: ["任何人都有機會瞥見自己的未來。", "寺廟的方丈可以單獨扭轉井中映照的因果。", "井的穩定性源於核心參與者的無形制約。", "為防止未來的因果洩露，井水每天都會被抽乾。"], answer: 2 },
        { question: "一位夢境建築師構建了共享的夢境維度。夢境的永久性改變，須讓所有深層睡眠者的潛意識都同步接納，但這會讓他所創造的夢境缺少什麼特性？", options: ["夢境世界內部嚴密的邏輯自洽性與物理法則。", "抵禦來自外部精神實體惡意入侵的防禦能力。", "進行大規模、即時性場景變換的流暢度與效率。", "夢境世界對個體參與者思想隱私的周密保護。"], answer: 2 },
        { question: "在深海中，幾個古老的利維坦部落為爭奪熱泉而爆發過毀滅性戰爭。最終，它們達成深淵盟約：任何關於熱泉能量的分配，都須得到所有部落首領的「靈能印記」才能生效。這項盟約的創立，主要是為了解決什麼問題？", options: ["確保單一部落無法憑藉自身力量去破壞對所有部落都有利的脆弱生態。", "讓海洋中最微小的浮游生物，也能公平地參與到珍貴能量的分配決策之中。", "讓關於能量分配的重大決策，能夠在瞬息之間就迅速地討論並最終完成。", "將盟約的詳細內容告知所有海洋生物，以最大限度地展示其過程的公平性。"], answer: 0 },
        { question: "古老的煉金術士手稿記載著一種被稱為「世界之魂」的物質。它滲透萬物，記錄每一次物質形態的轉換。沒有人能創造或銷毀它，只能觀察其規律。如果「世界之魂」是一種信息架構，它的核心特質是什麼？", options: ["一個由至高存在隨意設定和修改所有內部規則的宏大實驗場。", "一個分佈式的、自治的、具有高度數據完整性的底層運作協議。", "一個只有通過了嚴格試煉的「大師級」煉金術士才能接入的專有網絡。", "一個反應迅速，但所有規律都由單一源頭所決定的中心化系統。"], answer: 1 },
        { question: "一個人工智能「奧丁」，為追求絕對的預測能力，將全人類的所有數據都匯入其位於格陵蘭的中央處理器。這種設計，在賦予「奧丁」近乎全知能力的同時，也創造了什麼樣的終極弱點？", options: ["維護和冷卻這台龐大的中央處理器所需要的巨額能源成本。", "將整個文明的命脈凝聚成一個單一的、一旦被摧毀就萬劫不復的實體目標。", "全球各地的數據傳輸到格陵蘭時，會產生微秒級別的信號延遲。", "人們會因為對隱私的擔憂，而被動地抵抗系統的數據收集行為。"], answer: 1 },
        { question: "一位法老渴望建造一座能直達天國的巨塔。首席建築師告訴他：「陛下，若要讓這座塔的建造進度達到最快，就必須廢除所有工匠的討論會，由您一人發號施令。」這番話，揭示了這座巨塔在結構上必然存在何種缺陷？", options: ["為了追求意志的貫徹速度，它從根本上排除了系統的冗餘性和容錯能力。", "它的宏偉建造藍圖，必須對所有前來朝貢的附屬國家完全公開展示。", "它賴以建立的地基所使用的特殊材料，是地球上不可再生的稀有資源。", "它的外部防禦工事的堅固程度，遠比塔樓自身的高度更為重要。"], answer: 0 },
        { question: "一支探險隊在南極發現了一個外星文明的遺物：一個被稱為「奇點」的黑色立方體。研究發現，這個立方體是控制該文明所有科技的「根密鑰」。這個發現，讓地球的科學家們感到何種最深層的恐懼？", options: ["該外星文明所使用的科技，可能與地球現有的物理學體系完全不兼容。", "一個發達文明竟將其存續希望寄託在一個單一的、可被奪取的物體上。", "這個被稱為「奇點」的神秘立方體，其內部蘊含的能源可能會耗盡。", "地球上的科學家們完全無法理解立方體表面上鐫刻的任何外星文字。"], answer: 1 },
        { question: "在文字誕生之初，一個部落發明了用「血石」來記錄契約。這種石頭數量有限，無法偽造，其在成員間的交換，就是無需長老見證的承諾。這種「血石契約」的出現，意味著什麼樣的社會變革？", options: ["一個能夠讓契約條文在滿足特定條件後自動執行的時代。", "一個可以在沒有中心權威的情況下，獨立驗證和轉移價值的時代。", "一個讓契約的傳遞速度能夠超越部落中最快的奔馬的時代。", "一個規定了只有部落的族長本人，才有資格持有「血石」的時代。"], answer: 1 },
        { question: "一位失傳已久的符文大師，創造了一種「自執行卷軸」。卷軸上不僅記載著財富的歸屬，更可以預設一段符文邏輯：當某個條件被滿足時，卷軸會自動觸發並完成使命。這項發明最核心的突破在於？", options: ["讓卷軸的書寫和繪製速度，達到了前所未有的程度。", "讓卷軸內部所記載的財富，可以被無限地複製和增發。", "它將「條件語句」和「執行指令」物化，使其成為一個無需外力干預的邏輯閉環。", "讓卷軸上所記載的內容，永遠無法被任何未經授權的第三方所解讀。"], answer: 2 },
        { question: "在一座不夜城中，有一個被稱為「神經元」的快遞網絡，以其處理海量信息包裹的驚人能力而聞名。為了實現這種性能，該網絡在設計其「三大信條」時，最側重於哪一項？", options: ["讓城市的每一位居民，都能夠深度參與到網絡的路線規劃決策之中。", "確保網絡的中央服務器，是運用了最高科技、堅不可摧的物理實體。", "將網絡處理並發數據流的「帶寬」，不計代價地推向其物理極限。", "對每一個流轉的信息包裹，都進行最為複雜的多重加密以保障隱私。"], answer: 2 },
        { question: "一座古老帝國的「靈魂之井」因承載太多國民的祈願而變得渾濁不堪。一位先知並未試圖淨化井水，而是在井的周圍挖掘了許多「許願池」。人們可以在池邊進行日常的祈禱。這些「許願池」扮演了何種角色？", options: ["一個旨在通過長期運作，吸乾「靈魂之井」所有能量的敵對系統。", "一個通過將高頻次的負載進行分流，從而保障核心系統穩定性的擴展層。", "一個被秘密設計用來監視所有國民內心真實祈願內容的情報機構。", "一個比「靈魂之井」更為神聖，但也更難以與之進行有效溝通的備用系統。"], answer: 1 },
        { question: "一個由數理邏輯學家組成的隱秘社團，創造了一種完全由符號構成的「元語言」。用這種語言描述任何事物，都能從結構上消除模糊性。如果用這種語言來構建一個國家的法律體系，其首要目的是什麼？", options: ["讓法官在審理案件時，能夠極大地加快法律條文的執行速度。", "通過形式化的嚴謹性，最大限度地減少因法律漏洞而產生的非正義判決。", "讓法律條文的內容，能夠更容易地被不懂法律的普通平民所理解。", "確保這套先進的法律，能被準確無誤地翻譯成任何國家的語言。"], answer: 1 },
        { question: "一所神秘的刺客學院，其訓練場上會源源不絕地出現沒有靈魂的「稻草人靶子」，供學徒練習。入口處的守衛會給每位新來的學徒一枚「訓練場徽章」。這個「徽章與靶子」的體系，其存在的根本目的是？", options: ["鑒別出所有學徒中最有天賦的人，並秘密給予他們真正的暗殺任務。", "提供一個高擬真度但零風險的環境，讓使用者能自由地測試系統機制。", "一個會隨機在大量的稻草人靶子中，混入真實敵人的殘酷生存試煉。", "一個專門用來懲罰那些在訓練中，違反了刺客信條的學徒的地方。"], answer: 1 },
        { question: "一位畫家想將他的一幅畫作，通過一種「魔法傳送陣」寄給遠方的朋友。啟動傳送陣時，除了要放入畫作，還必須在旁邊的凹槽裡投入一顆「星塵砂」。這顆「星塵砂」的本質是什麼？", options: ["一份額外支付給收件朋友的、代表心意的禮物。", "作為整個魔法網絡完成這次「傳送-驗證」服務所消耗能量的補償。", "用來購買一個能讓畫作在傳送過程中散發出絢麗光芒的特效。", "向整個魔法網絡證明自己是一位技藝高超、值得信賴的畫家。"], answer: 1 },
        { question: "一座懸浮於雲海之上的「神都」，其連接地面的唯一通道「光之階梯」因使用者過多而時常能量不足。為此，神都的統治者在地面上建立了一座「凡人集市」。它與「神都」的關係，最精準的比喻是？", options: ["兩者是直接的競爭關係，凡人集市的最終目標是取代天空之城。", "凡人集市是一個完全自治的實體，與神都沒有任何官方的聯繫。", "凡人集市是一個處理高頻次交互的「緩衝區」，以保障核心系統的穩定性。", "神都的所有至高律法，在凡人集市都完全適用且由神都衛隊執行。"], answer: 2 },
        { question: "一位青年，遇到一個自稱是守衛的人，但他卻要求青年立下「靈魂血誓」，將自己的一切秘密都與他共享。這位青年應該立刻做出何種判斷？", options: ["這可能是成為學院的一種特殊的秘密試煉。", "這是一個偽裝的欺詐者，意圖不軌。", "他嘗試試探他接下來的行動。", "匿名發帖詢問這是否是正常流程。"], answer: 1 },
        { question: "在一片原始森林中，兩棵不同種類的樹，通過地下的菌絲網絡，交換了彼此所需的磷和氮。這次交換沒有經過任何「森林之王」的批准。這個自然現象，體現了哪種最根本的互動模式？", options: ["一種不依賴中心化權威進行仲裁的、點對點的價值交換。", "對於那位並不存在的「森林之王」的絕對統治的默認。", "只有特定種類的、被稱為「貴族」的樹木才能進行的特殊交換。", "這次寶貴的資源交換是秘密進行的，地上的動物毫不知情。"], answer: 0 },
        { question: "一個古老的沙漠部落，為了決定誰有權在年度大會上發言，其儀式是要求候選人徒手將一桶水從綠洲搬運到沙漠中心，再倒在沙地上蒸發掉。一位年輕的成員對此感到困惑並詢問長老。長老最富有智慧的回答應該是？", options: ["「這是為了鍛煉你們所有人的體魄，為未來可能發生的戰爭做準備。」", "「因為只有通過這種高昂且不可回收的付出，才能證明你發言的嚴肅性。」", "「這是我們部落自古流傳下來的、一種向偉大的雨神祈求雨水的儀式。」", "「這是為了通過最簡單直接的方式，找出我們所有部落成員當中走得最快的人。」"], answer: 1 },
        { question: "一艘深空探索艦「漫遊者號」，其航行日誌的每一頁，都需經過艦上所有部門主管的一致簽署才能生效。一天，艦體外殼被微型隕石擊中，造成一處無關緊要的刮痕。按照日誌記錄流程，這個微不足道事件的正式記錄，將會經歷什麼？", options: ["它將被艦船的人工智能自動忽略，因為系統足夠智能去判斷其重要性。", "它將觸發一個與記錄「發現新宜居星球」一樣複雜漫長的官僚程序。", "只有艦長本人，才有權力決定是否需要將這件小事記錄在案。", "這個記錄過程將會進行得非常迅速，因為事件本身並不重要。"], answer: 1 },
        { question: "你是一名間諜，需要將一份絕密藍圖送出敵國。你有兩個選擇：一是將藍圖藏在一位普通商人的馬車中，這輛馬車速度快，且毫不起眼；二是將藍圖交給一支由重兵護送的、行進緩慢的皇家使團。如果藍圖的「不被篡改」和「傳遞過程的可驗證性」是首要目標，你會如何抉擇？", options: ["選擇商人，因為隱蔽和速度是作為一名間諜的第一要務。", "選擇皇家使團，因為對信息傳遞的「強健性」保障超越了對效率的考量。", "將藍圖小心地撕成兩半，交由兩個不同的渠道分別傳送。", "為了絕對安全，選擇立刻銷毀藍圖，不冒任何一絲風險。"], answer: 1 },
        { question: "一個古老的靈魂容器，本身只是一個普通的陶罐。但真正賦予它力量的，是只有其主人知道的、能召唤並約束靈魂的「真言」。如果主人死去，只要新的繼承者知道了這句「真言」，他就能用任何一個新的陶罐，重新召喚同一個靈魂。在這個比喻中，「陶罐」和「真言」的關係，最貼切的描述是？", options: ["它們是不可分割的一個整體，一旦陶罐破碎，真言也隨之失效。", "「陶罐」是可替換的「界面」，而「真言」是獨立於界面的、代表所有權的「根密鑰」。", "「真言」是一把特殊的鑰匙，它只能打開這個特定的「陶罐」。", "在這個組合中，「陶罐」本身的存在遠比那句「真言」更為重要。"], answer: 1 },
        { question: "一座上古神殿的聖物，被封印在一個需要三位大祭司，分別用代表「過去」、「現在」、「未來」的三把鑰匙，同時插入三處不同的鎖孔才能開啟的密室中。這種安保設計的哲學核心是？", options: ["為了防止某一位貪婪的大祭司，產生獨吞聖物的邪惡念頭。", "為了體現時間本身三位一體的神秘性，具有強烈的宗教儀式感。", "一種通過分散權限、要求多個獨立條件同時滿足來防止單點失敗的機制。", "為了讓開啟聖物密室的整個過程，顯得更加困難和充滿神秘色彩。"], answer: 2 },
        { question: "想像一個宇宙，其唯一的法則就是「因果鏈」。任何一個事件的發生，都是其前序所有事件的必然結果。在這個宇宙中，「篡改歷史」之所以不可能，其根本原因是什麼？", options: ["因為有一位無所不知、無所不能的時間之神在嚴密地監視著一切。", "因為每一個「當下」的數據結構中，都包含了對其所有「過去」的數據摘要。", "因為所有過去的事件都已經徹底消散，在宇宙中沒有留下任何痕跡。", "因為沒有任何已知的生命體，能夠擁有足夠的能量去進行時間旅行。"], answer: 1 },
        { question: "一位音樂家創作了一首曠世交響樂，並將其唯一的樂譜正本，存放在了「世界中央音樂館」的地下金庫中。然後，他發行了一種「演奏授權證書」，任何持有該證書的樂團，都可以在世界任何地方合法地演奏此曲。這個過程，隱喻了何種現代資產的流動方式？", options: ["建立一個輔助的、更加高效的網絡，來專門處理盜版侵權的問題。", "通過將「價值本體」進行錨定，來創造出一種可流通的「價值權益代表物」。", "一種需要消耗巨大能量和時間的、极其複雜的版權驗證過程。", "一種能夠讓這位音樂家在不同的國家，創建出全新身份的方法。"], answer: 1 },
        { question: "一家擁有全球業務的古老貿易行，其所有的賬目都由總部的一位大學士用鵝毛筆記錄，效率極其低下。新一代的繼承人上任後，決定授權各地的分行建立自己的賬房，使用更快的算盤記賬。這種管理革新，體現了哪種系統架構的優化思想？", options: ["用一套全新的、完全保密的記賬方法，來取代現有的公開方法。", "利用「分治」思想，將大量本地化的計算任務從主幹網絡中剝離。", "建立一個由所有存在競爭關係的貿易行，共同組成的商業聯盟。", "放棄所有分權，將各地賬房的算盤都收歸到總部進行統一管理。"], answer: 1 },
        { question: "一位即將歸隱的棋聖，對他唯一的弟子說：「孩子，你要記住，一盤完美的棋，你無法讓它同時具備『無窮的變化』、『絕對的防守』和『落子無悔的公平』。你走的每一步，都是在這三者之間尋找那轉瞬即逝的平衡點。」棋聖的話，揭示了何種關於複雜系統設計的根本性制約？", options: ["只要擁有足夠強大的計算能力，一個完美的系統是可能存在的。", "一個系統的幾個理想屬性之間，往往存在著不可調和的內在張力。", "只要完全犧牲掉棋局的防守，就一定能夠贏得最終的勝利。", "在所有棋局中，最好的策略就是不讓你的對手知道你的遊戲規則。"], answer: 1 }
    ];
    // ▲▲▲ 更新結束 ▲▲▲

    let selectedQuestionsForQuiz = [];

    let board = [], flags = 0, gameOver = false;
    let hasAttemptedQuiz = false;
    let activeCellForPopup = null;
    let usePaperForNextThree = true;
    let mineHitCount = 0;
    let quizSuccessCount = 0;

    toolShovel.addEventListener('click', () => {
        if (activeCellForPopup) {
            const { r, c } = activeCellForPopup;
            const cellData = board[r][c];
            if (cellData.isFlagged || cellData.isRevealed) { closeToolPopup(); return; }

            if (cellData.isMine) {
                mineHitCount++;
                cellData.element.classList.add('explosion-shake');
                setTimeout(() => {
                    cellData.element.classList.remove('explosion-shake');
                    if (mineHitCount >= 3) {
                        showQuizButton.classList.remove('hidden');
                        gameBoardElement.classList.add('locked');
                        alert('你踩到太多地雷了！需要回答問題才能繼續。');
                    } else {
                        alert(`你踩到了一個地雷！還有 ${3 - mineHitCount} 次機會。`);
                    }
                }, 800);
            } else { 
                revealCell(r, c);
            }
            closeToolPopup();
        }
    });

    toolFlag.addEventListener('click', () => {
        if (activeCellForPopup) {
            const { r, c } = activeCellForPopup;
            toggleFlag(r, c);
            closeToolPopup();
        }
    });

    window.addEventListener('click', (event) => {
        if (!toolPopup.classList.contains('hidden') && !toolPopup.contains(event.target) && !event.target.classList.contains('cell')) {
            closeToolPopup();
        }
    });

    function resetBoard() {
        gameOver = false;
        flags = 0;
        closeToolPopup();
        board = [];
        gameBoardElement.innerHTML = '';
        gameBoardElement.style.gridTemplateColumns = `repeat(${BOARD_WIDTH}, 45px)`;
        minesCountElement.textContent = MINE_COUNT;
        
        for (let r = 0; r < BOARD_HEIGHT; r++) {
            const row = [];
            for (let c = 0; c < BOARD_WIDTH; c++) {
                const cell = { isMine: false, isRevealed: false, isFlagged: false, element: null, adjacentMines: 0 };
                row.push(cell);
            }
            board.push(row);
        }
        MINE_LOCATIONS.forEach(loc => {
            if (loc.r < BOARD_HEIGHT && loc.c < BOARD_WIDTH) {
                board[loc.r][loc.c].isMine = true;
            }
        });
        for (let r = 0; r < BOARD_HEIGHT; r++) {
            for (let c = 0; c < BOARD_WIDTH; c++) {
                if (!board[r][c].isMine) {
                    board[r][c].adjacentMines = calculateAdjacentMines(r, c);
                }
            }
        }
        createBoardElement();

        PRESET_INITIAL_CELLS.forEach(coord => {
            if (board[coord.r] && board[coord.r][coord.c] && !board[coord.r][coord.c].isMine) {
                revealCell(coord.r, coord.c, true);
            }
        });
    }

    function startGame() {
        finalPuzzle.classList.add('hidden');
        magicInput.value = '';
        magicInput.disabled = false;
        usePaperForNextThree = true;
        hasAttemptedQuiz = false;
        mineHitCount = 0;
        
        hintContainerElement.classList.add('hidden');
        hintLine1.classList.add('hidden');
        hintLine2.classList.add('hidden');
        quizSuccessCount = 0;
        
        showQuizButton.classList.add('hidden');
        gameBoardElement.classList.remove('locked');
        resetBoard();
        resetButton.addEventListener('click', () => {
            if (!endingPage.classList.contains('hidden')) {
                endingPage.classList.add('hidden');
                gameContainer.classList.remove('hidden');
            }
            body.classList.remove('show-animals-bg');
            startGame();
        });
    }

    function createBoardElement() {
        for (let r = 0; r < BOARD_HEIGHT; r++) {
            for (let c = 0; c < BOARD_WIDTH; c++) {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.dataset.row = r;
                cellElement.dataset.col = c;
                cellElement.addEventListener('click', (event) => {
                    event.stopPropagation();
                    handleCellClick(r, c, event);
                });
                board[r][c].element = cellElement;
                gameBoardElement.appendChild(cellElement);
            }
        }
    }

    function handleCellClick(r, c, event) {
        if (gameOver || board[r][c].isRevealed) {
            closeToolPopup();
            return;
        }
        activeCellForPopup = { r, c };
        const rect = event.target.getBoundingClientRect();
        toolPopup.style.top = `${window.scrollY + rect.bottom + 5}px`;
        toolPopup.style.left = `${window.scrollX + rect.left + rect.width / 2 - toolPopup.offsetWidth / 2}px`;
        toolPopup.classList.remove('hidden');
    }

    function toggleFlag(r, c) {
        if (gameOver || board[r][c].isRevealed) return;
        const cell = board[r][c];
        const cellElement = cell.element;

        if (cell.isFlagged) {
            const flagImg = cellElement.querySelector('.flag-icon');
            if (flagImg) cellElement.removeChild(flagImg);
            cell.isFlagged = false;
            flags--;
        } else {
            if (flags >= 26) {
                alert('最多只能插 26 支旗子！');
                return;
            }
            const flagImg = document.createElement('img');
            flagImg.src = 'images/flag.png';
            flagImg.alt = '旗子';
            flagImg.classList.add('flag-icon');
            cellElement.appendChild(flagImg);
            cell.isFlagged = true;
            flags++;
        }
        minesCountElement.textContent = MINE_COUNT - flags;
        checkWinCondition();
    }

    function closeToolPopup() {
        toolPopup.classList.add('hidden');
        activeCellForPopup = null;
    }

    function revealCell(r, c, isInitial = false) {
        if (r < 0 || r >= BOARD_HEIGHT || c < 0 || c >= BOARD_WIDTH || board[r][c].isRevealed) return;
        const cell = board[r][c];
        cell.isRevealed = true;
        cell.element.classList.add('revealed');
        if (cell.isFlagged) toggleFlag(r, c);
        
        const img = document.createElement('img');
        img.classList.add('crypto-icon');
        let hasCustomImage = true;

        if (cell.adjacentMines === 1) {
            img.src = 'images/bitcoin.png'; img.alt = '比特幣';
        } else if (cell.adjacentMines === 2) {
            img.src = 'images/ethereum.png'; img.alt = '以太幣';
        } else if (cell.adjacentMines === 3) {
            if (usePaperForNextThree) {
                img.src = 'images/paper.png';
                img.alt = '信紙';
            } else {
                img.src = 'images/polkadot.png';
                img.alt = '波卡';
            }
            usePaperForNextThree = !usePaperForNextThree;
        } else if (cell.adjacentMines === 4) {
            img.src = 'images/Litecoin.png'; img.alt = '萊特幣';
        } else {
            hasCustomImage = false;
        }

        if (hasCustomImage) {
            cell.element.appendChild(img);
        } else if (cell.adjacentMines >= 0) {
            cell.element.textContent = cell.adjacentMines;
            cell.element.dataset.mines = cell.adjacentMines;
            if (cell.adjacentMines === 0 && !isInitial) {
                 for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        revealCell(r + dr, c + dc);
                    }
                }
            }
        }
        checkWinCondition();
    }

    function calculateAdjacentMines(r, c) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const newR = r + dr;
                const newC = c + dc;
                if (newR >= 0 && newR < BOARD_HEIGHT && newC >= 0 && newC < BOARD_WIDTH && board[newR][newC].isMine) {
                    count++;
                }
            }
        }
        return count;
    }

    function checkWinCondition() {
        if (gameOver) return;
        let correctlyFlaggedMines = 0;
        let revealedCount = 0;
        for (let r = 0; r < BOARD_HEIGHT; r++) {
            for (let c = 0; c < BOARD_WIDTH; c++) {
                const cell = board[r][c];
                if (cell.isFlagged && cell.isMine) {
                    correctlyFlaggedMines++;
                }
                if (cell.isRevealed) {
                    revealedCount++;
                }
            }
        }
        const nonMineCells = (BOARD_WIDTH * BOARD_HEIGHT) - MINE_COUNT;
        if (correctlyFlaggedMines === MINE_COUNT || revealedCount === nonMineCells) {
            endGame(true);
        }
    }

    function endGame(isWin) {
        gameOver = true;
        closeToolPopup();
        if (isWin) {
            for (let r = 0; r < BOARD_HEIGHT; r++) {
                for (let c = 0; c < BOARD_WIDTH; c++) {
                    const cell = board[r][c];
                    if (!cell.isRevealed) {
                        cell.isRevealed = true;
                        cell.element.classList.add('revealed');
                    }
                    cell.element.innerHTML = '';
                    if (cell.isMine) {
                        const heartImg = document.createElement('img');
                        heartImg.src = 'images/heart.png';
                        heartImg.alt = '愛心';
                        heartImg.classList.add('heart-icon');
                        cell.element.appendChild(heartImg);
                    }
                }
            }
            finalPuzzle.classList.remove('hidden');
        }
    }

    function generateQuiz() {
        quizContainer.innerHTML = '';
        selectedQuestionsForQuiz = [];
        const shuffledQuestions = [...quizQuestions].sort(() => 0.5 - Math.random());
        selectedQuestionsForQuiz = shuffledQuestions.slice(0, 3);

        selectedQuestionsForQuiz.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('quiz-question');

            const questionText = document.createElement('p');
            questionText.textContent = `第 ${index + 1} 題: ${q.question}`;
            questionDiv.appendChild(questionText);

            const optionsList = document.createElement('ul');
            optionsList.classList.add('quiz-options');
            
            q.options.forEach((opt, optIndex) => {
                const listItem = document.createElement('li');
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = `quiz-question-${index}`;
                radioInput.id = `q${index}-opt${optIndex}`;
                radioInput.value = optIndex; // 使用選項的索引作為其值

                const label = document.createElement('label');
                label.htmlFor = radioInput.id;
                label.textContent = opt; // 顯示已去除 A/B/C/D 的選項文字

                // ▼▼▼ 修改的區塊 ▼▼▼
                const optionWrapper = document.createElement('div');
                optionWrapper.classList.add('quiz-option-wrapper');
                optionWrapper.appendChild(radioInput);
                optionWrapper.appendChild(label);
                listItem.appendChild(optionWrapper);
                // ▲▲▲ 修改結束 ▲▲▲

                optionsList.appendChild(listItem);
            });

            questionDiv.appendChild(optionsList);
            quizContainer.appendChild(questionDiv);
        });
    }

    function checkQuizAnswers() {
        if (!hasAttemptedQuiz) {
            hintContainerElement.classList.remove('hidden');
            hintLine1.classList.remove('hidden');
        }
        hasAttemptedQuiz = true;

        let correctCount = 0;
        selectedQuestionsForQuiz.forEach((q, index) => {
            const selectedOption = document.querySelector(`input[name="quiz-question-${index}"]:checked`);
            // 比較被選中選項的索引值 (轉換為數字) 是否與答案索引相符
            if (selectedOption && parseInt(selectedOption.value, 10) === q.answer) {
                correctCount++;
            }
        });

        if (correctCount === 3) {
            quizSuccessCount++;
            alert('恭喜你！全部答對了！遊戲版已解鎖。');
            
            if (quizSuccessCount === 2) {
                hintLine2.classList.remove('hidden');
            }
            
            gameBoardElement.classList.remove('locked');
            mineHitCount = 0;
            showQuizButton.classList.add('hidden');
            
            quizPage.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            body.classList.remove('show-animals-bg');

        } else {
            alert(`你答對了 ${correctCount} 題，但沒有全部答對喔！請再試一次。`);
            generateQuiz();
        }
    }
});
