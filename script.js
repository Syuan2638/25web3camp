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
        { question: "一位才華洋溢的爵士鋼琴家夢想開一間俱樂部。他有三個不容妥協的目標：第一，音樂必須是絕對純正的，堅守最嚴格的藝術標準；第二，舞台必須對所有想上台的音樂家開放，人人平等；第三，為了賺錢，服務必須極快，每晚能接待大量客人。他很快發現，如果上台的音樂家太多，就很難維持音樂的純正性與服務速度。他面臨的根本處境是什麼？", options: ["A) 他的首要問題是找不到好的服務生。", "B) 他必須接受一個事實：他無法同時將三個目標都發揮到極致，必須有所取捨。", "C) 解決方案很簡單，只要提高飲品的價格就行了。", "D) 他應該放棄開放舞台，只邀請知名樂手來確保品質。"], answer: "B" },
        { question: "一位探險家發現了一座神秘島嶼，島上有一種只會發光的金色寶石，總數只有2100萬顆，永遠不會再增加。島上的原住民用它來交換珍貴物品，且沒有任何一個首領或外人可以控制它的產出。這種寶石之所以被視為珍寶，其最核心的特質是什麼？", options: ["A) 因為它在夜裡會發光，非常美麗。", "B) 因為它可以輕易地被切割成任何形狀。", "C) 因為它的數量固定，不會因濫發而貶值，代表著一種穩定的價值儲存。", "D) 因為島上所有人都擁有至少一顆。"], answer: "C" },
        { question: "一個繁忙的中央車站是城市交通的核心，但因人潮過多而變得極度擁擠。為了解決這個問題，市長在旁邊建立了一條「快速接駁軌道」，專門處理前往郊區的短途旅程。乘客先到這條軌道上完成大部分路程，最後再接回中央車站系統。這條「快速接駁軌道」的本質是什麼？", options: ["A) 它是一個全新的、與中央車站完全無關的獨立交通系統。", "B) 它是一個輔助設施，旨在分擔主系統的壓力，提升整體效率。", "C) 它是一個通往另一個城市的秘密通道。", "D) 它是一個臨時搭建的工程，很快就會被拆除。"], answer: "B" },
        { question: "在一個古老的王國，繼承王位的唯一方法，是解開一道由開國君王設下的、極其複雜的數學謎題。全國的王子們都投入大量的時間與資源（聘請學者、建立計算高塔）日夜不停地計算，第一個解出謎題的人才能向全國宣布自己是新國王。這種決定繼承權的方式，其核心精神是什麼？", options: ["A) 繼承權是隨機分配的，全憑運氣。", "B) 繼承權屬於王國中最富有的人。", "C) 繼承權屬於最年長的王子。", "D) 繼承權是透過投入巨大的努力與資源來證明的，誰付出的「功勞」最多，誰就獲勝。"], answer: "D" },
        { question: "在一個被巨大高牆分隔的兩個王國，一位公主想將一封信物（如一枚戒指）交給牆另一邊的王子。她無法親自過去，只能透過一個由兩國衛兵共同監管的「傳送門」。這個「傳送門」扮演了什麼角色？", options: ["A) 它是王子的私人郵箱。", "B) 它是一個中立的通道，專門用來安全地連接兩個獨立的世界。", "C) 它是一座用來觀光的瞭望塔。", "D) 它是公主用來逃離王國的秘密出口。"], answer: "B" },
        { question: "一位天才建築師的夢想不是建造一座最高的摩天大樓，而是設計一個「萬能的連結中心」，讓世界上所有不同風格、不同規則的建築（例如中式園林、歐洲城堡、現代大樓）都能互相連接，人們可以在其中自由穿梭，訊息和物品也能安全流通。這個「萬能的連結中心」的願景是什麼？", options: ["A) 建立一個統一風格的全球城市。", "B) 摧毀所有舊建築，建造新建築。", "C) 實現不同獨立系統之間的互操作性，創造一個互聯網絡。", "D) 建造一座史上最安全的建築。"], answer: "C" },
        { question: "一個神秘的「鍊金術師兄弟會」，只有透過現有成員的共同推薦才能加入。兄弟會內部的知識和實驗記錄都受到嚴格保護，不對外公開。這種組織的結構特徵是什麼？", options: ["A) 一個完全開放、任何人都可以自由加入的社團。", "B) 一個需要許可、由特定成員共同管理的半封閉組織。", "C) 一個由單一會長說了算的獨裁機構。", "D) 一個即將解散的臨時團體。"], answer: "B" },
        { question: "一位富翁立下了一份魔法遺囑，內容是：「當我的小兒子年滿18歲生日那天午夜12點整，我銀行金庫的大門將自動為他打開。」這個遺囑的神奇之處在於，條件一旦滿足，過程就無須任何人干預，自動發生。這份遺囑的運作原理是什麼？", options: ["A) 遺囑的執行完全依賴律師的記憶力。", "B) 這是一個預先設定好條件，並在條件觸發時自動執行的契約。", "C) 金庫的鑰匙其實一直都藏在兒子房間裡。", "D) 兒子需要猜對密碼才能打開金庫。"], answer: "B" },
        { question: "一個跨國企業集團內部的財務系統，由來自不同國家的數個分公司共同維護。系統的參與者是預先設定好的，他們之間的交易高效且保密，但這個系統並不對集團外的任何人開放。這個系統的性質是什麼？", options: ["A) 是一個全球公開的股票交易市場。", "B) 是一個僅限特定聯盟成員參與的協作平台。", "C) 是一個由總公司董事長一人控制的私人帳本。", "D) 是一個給實習生練習用的模擬系統。"], answer: "B" },
        { question: "一個網路論壇，任何人都可以註冊發言，所有的貼文和回覆都永久公開，所有人都能看到，且論壇沒有管理員可以單方面刪除帖子或禁止用戶。這個論壇的本質是什麼？", options: ["A) 一個需要付費才能閱讀的私人俱樂部。", "B) 一個由版主團隊嚴格控管的專業社群。", "C) 一個完全公開、透明、抗審查的公共空間。", "D) 一個只有原始發文者才能看到內容的部落格。"], answer: "C" },
        { question: "一位頂級賽車手在參加正式的世界大賽前，會先在一條與正式賽道一模一樣的「模擬賽道」上進行測試。他在這裡可以隨意駕駛、測試極限，即使撞車了也不會有人員傷亡或真實的賽車損毀。這個「模擬賽道」的作用是什麼？", options: ["A) 是一個讓觀眾付費觀賞的表演場地。", "B) 是一個無風險的環境，用於在真實比賽前進行演練和開發。", "C) 它的存在是為了讓正式賽道看起來更專業。", "D) 在這裡獲得的冠軍獎盃和真實比賽一樣有價值。"], answer: "B" },
        { question: "一位擁有超能力的時間管理者，他能為宇宙中發生的每一件事都蓋上一個精確且無法偽造的「時間戳」。這使得所有事件的先後順序都一目了然，大家不需要互相爭論誰先誰後，從而極大地加快了宇宙歷史的記錄速度。這種能力的關鍵作用是什麼？", options: ["A) 讓時間可以倒流。", "B) 透過創建一個可靠的時間序列，來提升整個系統的處理效率。", "C) 讓每個人都擁有預知未來的能力。", "D) 消除所有事件的發生記錄。"], answer: "B" },
        { question: "一對情侶將他們的愛情誓言刻在了一塊由成千上萬塊小石頭組成的巨大石碑上，每一塊小石頭都與前後的石頭緊密相連。如果有人想偷偷修改其中一個字，他必須同時說服超過一半的石頭持有者，並重刻整座石碑。為什麼修改誓言如此困難？", options: ["A) 因為石碑上的字是用一種特殊的墨水寫的。", "B) 因為篡改的成本極高，需要控制大部分系統並付出巨大的努力。", "C) 因為石碑被放在一個沒人知道的地方。", "D) 因為只有情侶本人才能修改。"], answer: "B" },
        { question: "一家頂級情報機構內部的通訊系統，只有局長有權限決定誰可以讀取或發送情報。這確保了極高的機密性和執行效率。這種系統設計的最大優點是什麼？", options: ["A) 任何人都可以輕鬆加入成為特工。", "B) 能夠有效控制資訊流動，保障組織內部的隱私。", "C) 系統的維護成本非常低。", "D) 所有的情報都會自動向公眾公開。"], answer: "B" },
        { question: "如果說鐵達尼號上一段可歌可泣、足以成為傳奇的愛情故事是「數位黃金」，那麼船上另一對普通夫婦之間溫馨、頻繁的日常互動，雖然同樣珍貴，但更貼近生活，更像是可以用來日常交換小物件的「數位白銀」。這種「數位白銀」的定位是什麼？", options: ["A) 它比「數位黃金」更有價值。", "B) 它的目的是為了儲存巨大的財富，不輕易動用。", "C) 它的設計更適合快速、小額的日常使用。", "D) 它只有這對普通夫婦才能擁有。"], answer: "C" },
        { question: "一位發明家創造了一個「世界生成器」平台，他不僅自己使用，還允許全世界的開發者在這個平台上建造屬於自己的小世界（例如遊戲世界、社交世界、金融世界）。這個「世界生成器」的本質是什麼？", options: ["A) 它只是一個用來儲存數據的倉庫。", "B) 它是一個可編程的基礎平台，能支持各種應用的創建與運行。", "C) 它是一個單一功能的計算機。", "D) 只有發明家本人才能在上面建造世界。"], answer: "B" },
        { question: "在一個魔法世界裡，任何巫師想施展法術，都必須消耗自己體內的「法力」。越是強大的法術，消耗的「法力」就越多。這種「法力」在魔法世界中的作用是什麼？", options: ["A) 它是衡量一個巫師受歡迎程度的指標。", "B) 它是維持魔法系統運作所必須支付的成本或燃料。", "C) 它是一種可以食用的魔法糖果。", "D) 每個巫師的「法力」都是無限的。"], answer: "B" },
        { question: "一個繁華的王國（主鏈）因人口過多而道路擁擠。國王於是授權一位貴族在旁邊建立一個自治領地（側鏈），這個領地有自己的法律和更快的馬車，專門處理日常的商業交易。領地的財富最終仍需向王國報告。這個「自治領地」的模式是什麼？", options: ["A) 它是王國的一個普通城市，沒有任何特殊之處。", "B) 它是一個與主系統掛鉤，但獨立運作以提高效率的輔助系統。", "C) 它是一個意圖推翻王國的敵對勢力。", "D) 它的運作效率比王國還要慢。"], answer: "B" },
        { question: "在過去，人們寫信需要依賴郵局系統，信件只能傳遞文字。後來，有人發明了一種「魔法信紙」，人們不僅可以在上面寫字，還能附上可以自動播放音樂、甚至執行簡單任務的「魔法符文」。這種從「普通信紙」到「魔法信紙」的轉變，關鍵的創新是什麼？", options: ["A) 信紙的材質變得更好了。", "B) 郵票的設計變得更漂亮了。", "C) 信紙被賦予了可編程和自動執行的能力。", "D) 寫信的速度變快了。"], answer: "C" },
        { question: "在一個貴族議會中，發言權的大小並非由年齡或智慧決定，而是由每位貴族擁有的土地數量決定。擁有的土地越多，投票時的影響力就越大。這種權力分配的規則是什麼？", options: ["A) 一人一票，人人平等。", "B) 透過武力決鬥來決定發言權。", "C) 根據持有的資產（權益）來決定權力大小。", "D) 由議會中最有學問的人來做所有決定。"], answer: "C" },
        { question: "一個由單一獨裁者統治的王國，雖然命令下達和執行效率極高，但如果這位獨裁者被刺殺或做出了錯誤的決定，整個王國就可能陷入混亂或崩潰。這暴露了該王國體制的什麼根本性弱點？", options: ["A) 王國的訊息傳播速度太慢。", "B) 存在單點故障風險，系統的命運繫於單一中心。", "C) 王國的建設成本太高。", "D) 王國的法律過於公開透明。"], answer: "B" },
        { question: "一個城市為了推廣節水，在廣場上設置了一個神奇的「許願池」。市民只要投入一枚象徵性的「練習幣」（沒有真實價值），池水就會噴出美麗的水花作為獎勵，讓市民體驗節水的樂趣。這個「許願池」的功能是什麼？", options: ["A) 是一個可以讓人致富的投資工具。", "B) 是一個讓用戶免費獲得「體驗道具」以進行學習和測試的設施。", "C) 是一個用來收集市民真實貨幣的捐款箱。", "D) 是一個真正的魔法許願池，可以實現任何願望。"], answer: "B" },
        { question: "一群曾為世界上最大社交網絡公司設計過安全系統的頂尖工程師，離開後決定創建一個全新的、更安全的數位城市。他們沒有沿用舊城市的藍圖，而是發明了一種全新的、專為資產安全設計的建築語言。這個新城市的最大特點是什麼？", options: ["A) 它沿用了所有舊城市的設計，只是換了個名字。", "B) 它由一群經驗豐富的頂尖團隊打造，並採用了全新的底層技術以追求高安全性。", "C) 它的建造速度是所有城市中最慢的。", "D) 它只允許原社交網絡公司的員工居住。"], answer: "B" },
        { question: "一位偉大的魔法師創造了一個「魔法運行核心」，所有其他巫師編寫的「法術卷軸」都必須在這個「核心」上才能被正確執行。這個核心確保了無論是誰、在何時何地施展同一個法術，其效果都完全一致。這個「魔法運行核心」的作用是什麼？", options: ["A) 它是一個儲存所有法術卷軸的圖書館。", "B) 它是一個標準化的執行環境，確保了規則的一致性和安全性。", "C) 它是一個用來判斷巫師等級的考場。", "D) 它可以讓巫師創造出無限的法力。"], answer: "B" },
        { question: "在一個大型的民主議會中，任何重大決策都需要絕大多數議員投票同意才能通過。雖然這確保了決策的穩健和公平，但也導致了改革的進程異常緩慢，因為協調所有人的意見非常耗時。這種現象反映了該系統的哪個內在特性？", options: ["A) 系統的運作效率非常高。", "B) 系統因為去中心化的治理模式，導致了決策效率低下。", "C) 系統的參與人數太少。", "D) 系統缺乏安全性，容易被外部攻擊。"], answer: "B" },
        { question: "你得到一個傳家寶盒，打開它需要一把日常使用的鑰匙。但製造商告訴你，如果有一天你把寶盒和鑰匙都弄丟了，唯一能證明你是主人並重新打造一個一模一樣的寶盒的方法，是說出當初購買時記錄下的、由12個秘密單詞組成的「創世密語」。這把鑰匙和「創世密語」的根本區別是什麼？", options: ["A) 鑰匙比「創世密語」更重要。", "B) 鑰匙只提供臨時的訪問權，而「創世密語」代表了不可剝奪的最終所有權。", "C) 「創世密語」可以隨意更改。", "D) 弄丟了「創世密語」沒關係，只要有鑰匙就好。"], answer: "B" },
        { question: "一位歷史學家在研究一個古老文明的編年史，他發現這部歷史是由一塊塊石板組成的，每一塊石板的末尾都刻有一個獨特的代碼，而下一塊石板的開頭必須包含這個代碼才能被連接上去。這種結構帶來了什麼效果？", options: ["A) 讓歷史可以被任何人隨意修改。", "B) 創造了一個環環相扣的記錄鏈，使得篡改任何一個環節都極其困難。", "C) 讓歷史記錄變得非常難以閱讀。", "D) 這種結構沒有任何實際作用。"], answer: "B" },
        { question: "一條通往首都的主幹道（主鏈）因車流量過大而頻繁堵塞，通行費也水漲船高。為此，政府在旁邊修建了一條專用的高速公路（側鏈），與主幹道相連。許多前往首都附近地區的車輛都改走這條高速公路，因為它更快、更便宜。這條高速公路扮演了什麼角色？", options: ["A) 它是一個完全獨立的道路系統，與主幹道無關。", "B) 它作為主幹道的擴容方案，有效緩解了其交通壓力。", "C) 它的通行費比主幹道更貴。", "D) 它的目的是為了取代主幹道。"], answer: "B" },
        { question: "在一個童話王國，每一位村民的善行都會被記錄在一本公開的「功德簿」上，這本簿子放在村莊廣場，任何人都可以隨時翻閱，查看誰幫助了誰。這種做法帶來了什麼社會效益？", options: ["A) 使得村民之間充滿了猜忌。", "B) 由於資訊的公開透明，極大地增強了社區的信任度。", "C) 只有村長才能看這本功德簿。", "D) 這本功德簿每年都會被銷毀。"], answer: "B" },
        { question: "在一個高度機密的特務組織裡，所有行動指令都由總司令一人下達。雖然這確保了指令傳達的極高效率和保密性，但這個組織最大的隱患是什麼？", options: ["A) 特務們之間的溝通非常緩慢。", "B) 招募新特務的過程非常困難。", "C) 權力過於集中，一旦總司令叛變或被捕，整個組織將面臨癱瘓或被篡改的風險。", "D) 組織的運營費用非常低。"], answer: "C" },
        { question: "以前的計算機只能用來做加減乘除，就像一個功能單一的算盤。後來，新一代的計算機誕生了，它不僅能計算，還能在上面編寫和運行各種各樣的應用程式，就像一個萬能的平台。這場革命的核心是什麼？", options: ["A) 計算機的外觀變得更漂亮了。", "B) 計算機從單一功能的工具，演變為一個可編程的、支持複雜應用的平台。", "C) 計算機的價格變得更貴了。", "D) 舊的計算機完全無法使用了。"], answer: "B" },
        { question: "一位魔法師想要將他A世界的「火焰石」轉移到B世界使用。他無法直接傳送，只能先把「火焰石」鎖在A世界的一個保險庫裡，同時，B世界的一個魔法陣會憑空生成一顆能量完全相等的「寒冰石」給他。這個過程最核心的原則是什麼？", options: ["A) 讓魔法師同時擁有兩顆寶石。", "B) 確保資產在跨界轉移時，其總價值保持一比一恆定，不會增加或減少。", "C) 這個過程非常緩慢且昂貴。", "D) 「寒冰石」比「火焰石」更有價值。"], answer: "B" },
        { question: "一位王子在全國範圍內尋找一位只留下一隻水晶鞋的神秘女孩。他將水晶鞋的精確尺寸和樣式（交易ID）公佈在全國的公告欄（區塊鏈瀏覽器）上，讓所有城市的官員進行比對。這個行為的目的是什麼？", options: ["A) 為了拍賣這隻水晶鞋。", "B) 為了查詢和驗證一筆特定「事件」的詳細信息。", "C) 為了展示王子的財富。", "D) 為了銷毀這隻水晶鞋。"], answer: "B" },
        { question: "在一個由無數個獨立小島組成的世界，每個島嶼都有自己的語言和文化。一位偉大的航海家出現了，他的目標不是征服這些島嶼，而是建立安全的航線和通用的翻譯工具，讓所有島嶼都能自由貿易和交流。這位航海家推動的是哪個時代的來臨？", options: ["A) 孤立主義時代，每個島嶼都閉關鎖國。", "B) 帝國統治時代，所有島嶼被一個強權控制。", "C) 互聯互通時代，強調不同獨立系統間的協作與連接。", "D) 史前時代，島嶼之間沒有任何聯繫。"], answer: "C" },
        { question: "一位男孩從學生時代起，就把對心愛女孩的每一次心動和為她做的小事，都記錄在一本日記裡。畢業時，這本日記成為了他們愛情故事的唯一見證，每一頁都承載著不可磨滅的記憶。這本日記的本質是什麼？", options: ["A) 一個可以隨意撕毀和修改的草稿本。", "B) 一個記錄事件、儲存價值的分散式帳本。", "C) 一個用來傳遞秘密訊息的工具。", "D) 一個很快就會被遺忘的物品。"], answer: "B" },
        { question: "你在一個主題樂園裡玩一個「海盜冒險」的模擬遊戲，你用樂園發放的「遊戲金幣」購買了一把虛擬的寶劍。關於這把寶劍，以下哪個描述是正確的？", options: ["A) 它可以帶出樂園，在現實世界的商店裡換取真實的商品。", "B) 它只在「海盜冒險」這個遊戲中有意義，本身沒有現實世界的價值。", "C) 它是用真正的黃金打造的。", "D) 你可以用它來支付樂園的門票。"], answer: "B" },
        { question: "你有一個魔法音樂盒，你需要一個簡單的口令（密碼）來打開它聽音樂。但音樂盒的製造商給了你一個獨一無二的「工匠印記」（助記詞）。這個「工匠印記」的作用是什麼？", options: ["A) 用來改變音樂盒播放的曲子。", "B) 它的作用和日常口令完全一樣。", "C) 它是你對音樂盒擁有權的終極證明，即使盒子丟了，你也能憑它要求工匠再造一個。", "D) 它是一個裝飾品，沒有實際功能。"], answer: "C" },
        { question: "一條高速公路的設計公司，在公路正式通車前，在旁邊建造了一條一模一樣的「駕駛員訓練道」。這條訓練道對開發者來說，最重要的意義是什麼？", options: ["A) 可以在上面舉辦收費的賽車表演。", "B) 可以在一個安全的環境中測試新車型和交通規則，而不會造成真實世界的損失。", "C) 可以用來炫耀公司的建造技術。", "D) 在訓練道上超速不會被處罰，所以可以隨意駕駛。"], answer: "B" },
        { question: "在一部電影中，一個由11位頂尖高手組成的團隊，試圖盜取一個由單一強大安保系統保護的賭場金庫。相比之下，如果這筆錢分散存放在全球數千個由不同人保管的小保險箱裡，盜竊的難度會如何變化？", options: ["A) 難度不變。", "B) 難度會大大增加，因為攻擊者需要同時攻破成千上萬個獨立目標。", "C) 難度會降低，因為小保險箱更容易被破解。", "D) 兩種情況下都不可能被盜。"], answer: "B" },
        { question: "一個電影製片方為了宣傳新片，舉辦了兩種活動。活動A是「首映禮抽獎」，中獎者可以獲得具有真實市場價值的電影票。活動B是「線上模擬導演遊戲」，玩家可以去指定網站免費領取「遊戲幣」來體驗拍電影。活動B中的「領取遊戲幣」的行為，類似於區塊鏈中的什麼？", options: ["A) 購買電影公司的股票。", "B) 從「水龍頭」獲取無價值的測試幣。", "C) 參與電影的票房分紅。", "D) 收到具有真實價值的「空投」。"], answer: "B" },
        { question: "一位男孩在情人節送給女孩一條獨一無二的項鍊，一旦女孩接受，這份禮物的所有權就轉移了。第二天，即使男孩後悔了，他也無法單方面從女孩的脖子上強行拿回項鍊。這次贈與行為的特點是什麼？", options: ["A) 它是可以隨時撤銷的。", "B) 它是公開透明的，全世界都知道。", "C) 它是一筆不可逆的交易，一旦確認就無法回溯。", "D) 項鍊的價值會隨著時間增長。"], answer: "C" },
        { question: "兩個敵對的魔法家族，為了讓家族繼承人聯姻，需要交換一份神聖的婚約。他們不信任任何單一的見證人，於是建立了一個由兩家各派三名長老組成的「六人議會」，只有六人全部同意，婚約才能生效。這種方式的主要優點是什麼？", options: ["A) 簽署婚約的速度非常快。", "B) 費用非常低廉。", "C) 透過多方驗證，避免了單點失敗或背叛的風險，安全性更高。", "D) 讓整個過程變得更加複雜和不必要。"], answer: "C" },
        { question: "一個王國的主城牆固若金湯，由皇家衛隊（主鏈）守衛。而在北方邊境，有一座獨立的堡壘（側鏈），由當地的領主和民兵（側鏈驗證者）負責防禦。關於這座北方堡壘的安全性，下列哪個說法是正確的？", options: ["A) 它的安全完全由遠在首都的皇家衛隊負責。", "B) 如果堡壘被攻破，主城牆也會立刻倒塌。", "C) 它的安全性取決於自身領主和民兵的實力，與主城牆的防禦力沒有直接關係。", "D) 堡壘的防禦力一定比主城牆更強。"], answer: "C" },
        { question: "在一個高科技未來世界，所有市民的生活都由一台名為「中央主腦」的超級電腦管理。雖然生活井然有序，效率極高，但如果一個病毒入侵了「中央主腦」，整個社會將會瞬間癱瘓。這個社會結構的脆弱性來源於哪裡？", options: ["A) 市民之間缺乏溝通。", "B) 過度依賴一個中心化的控制點。", "C) 科技發展得太快。", "D) 病毒過於強大。"], answer: "B" },
        { question: "當你收到一封來自遠方朋友的加密信件後，你想核實信件的確切寄出時間、寄件人地址等公開信息（非信件內容）。你會去哪裡查詢這些記錄？", options: ["A) 去詢問寄件人本人。", "B) 去一個公開的、記錄所有信件流轉信息的「中央郵政檔案館」。", "C) 這些信息是保密的，無法查詢。", "D) 去銷毀這封信件。"], answer: "B" },
        { question: "一個古老王國的公主，厭倦了宮廷中任何一項小改革都需要經過數十位大臣數月討論的緩慢過程。她嚮往城中市集裡小販們自由交易的活力與效率。宮廷的這種決策模式，反映了哪種組織的典型缺點？", options: ["A) 獨裁制組織，決策速度極快。", "B) 去中心化治理的組織，由於需要達成廣泛共識，導致更新擴張緩慢。", "C) 規模太小的組織，缺乏人才。", "D) 資金不足的組織。"], answer: "B" },
        { question: "在一個未來社會，每個人都被一個中央系統評分。高分者可以享受高速通道和優質服務（高效率），低分者則處處受限。這個系統運行穩定，規則明確（高安全性），但所有人都失去了自主選擇的權利。這個社會在設計上犧牲了什麼？", options: ["A) 犧牲了效率。", "B) 犧牲了安全。", "C) 犧牲了參與者的自由和去中心化的特性。", "D) 犧牲了系統的穩定性。"], answer: "C" },
        { question: "在一部可以時間旅行的電影裡，主角可以反覆回到過去，改變他說過的話和做過的事。但在現實世界的對話中，一旦話說出口，就無法「收回」，它已經成為了既定事實。現實世界對話的這種特性，在交易中被稱為什麼？", options: ["A) 可逆性。", "B) 最終性，即交易一旦確認就不可更改。", "C) 匿名性。", "D) 複雜性。"], answer: "B" },
        { question: "一位身在紐約的藝術家，想把他的一幅數位畫作（資產）送到東京的朋友手上。他透過一個中介服務，先把紐約的畫作「鎖定」在一個虛擬畫廊裡，使其無法再被交易；同時，該服務在東京為他的朋友「生成」一個一模一樣的數位副本。這個過程的核心目的是什麼？", options: ["A) 為了讓藝術家能同時在兩個城市賣畫。", "B) 為了確保畫作的價值在轉移過程中是恆定的，避免了「一畫兩賣」的問題。", "C) 為了提高畫作的價格。", "D) 為了證明紐約的畫廊比東京的更安全。"], answer: "B" },
        { question: "當你得到一個需要用秘密口令才能打開的魔法日記本時，智者建議你把口令記在一張只有你知道的羊皮紙上，並藏在安全的地方，而不是告訴你的寵物鸚鵡。為什麼智者會這樣建議？", options: ["A) 因為鸚鵡可能會忘記。", "B) 因為將敏感資訊以「離線」方式儲存，可以最大限度地防止被他人（或駭客）竊聽或盜取。", "C) 因為羊皮紙比鸚鵡更懂魔法。", "D) 因為這是一個考驗你記憶力的挑戰。"], answer: "B" }
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
                radioInput.value = opt.charAt(0);

                const label = document.createElement('label');
                label.htmlFor = radioInput.id;
                label.textContent = opt;
                
                listItem.appendChild(radioInput);
                listItem.appendChild(label);
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
            if (selectedOption && selectedOption.value === q.answer) {
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
