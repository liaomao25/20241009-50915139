const themes = {
    theme1: [
        'https://goodsmileshop.com/medias/sys_master/images/images/h73/hfb/9558723985438.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdRWILxmAq7qOx5clakYvUtGUhYqkRae9Fc9Jr472NBb_3ISneQge0c-raygqNVPmssrE&usqp=CAU',
        'https://upload.wikimedia.org/wikipedia/zh/thumb/d/d1/Bleach_%E5%9B%9B%E6%A5%93%E9%99%A2%E5%A4%9C%E4%B8%80.jpg/180px-Bleach_%E5%9B%9B%E6%A5%93%E9%99%A2%E5%A4%9C%E4%B8%80.jpg',
        'https://upload.wikimedia.org/wikipedia/zh/1/15/Neliel_Tu_Oderschvank.JPG',
        'https://www.banpresto.jp/prize/detail_img/0088251_prize_item_img1.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPQoFQTewd92hldu82mTOEDFBuBloZ6JgSls1PyDwr0vPUO38CDqO3zCthoVa_nb9qYbA&usqp=CAU',
        'https://today-obs.line-scdn.net/0hDMvMauAHG2JLNAnpxsdkNXNiFxN4UgFraQdcDGYyRAFlGAk3dAVIAWdkQ042B1Vka1tTAG9hQAAzAllhIg/w644',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP2g3ic62BqQ2x2ssR4KSRcoELuQbcZ3u9aO4RhcDJG9QyReAfVYLUhFK7WcNRchoaPbc&usqp=CAU',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ16OzXv1Oj7TdEdkWszimqhisUY6z9nOvz7c5cgNHrTUQIhfVT1Kh3x_zgVqUN-1QRdVM&usqp=CAU'
    ],
    theme2: [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpiCxNRgd7KbNCuOzBnKzzbE3o8bXToPRwavq2E0aDgCMlLkwWhGqWhMjWABGPqCIFtrc&usqp=CAU',
        'https://static.wikia.nocookie.net/tasw/images/e/ee/Yachiru_Unohana.png/revision/latest?cb=20230728225425',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY_fRvRK9I539SbEc-Lw-IedvHrVU1u9chrnYLICXofkHPOqdq0HRlI9aTPQFLk6ph204&usqp=CAU',
        'https://tc-animate.techorus-cdn.com/resize_image/resize_image.php?image=4535123840173_2_1714644354.jpg&width=500',
        'https://preview.redd.it/say-something-nice-about-soi-fon-v0-p4tuqx69ukyb1.jpg?width=322&format=pjpg&auto=webp&s=79df10b6303c6aa0677dcf3d6e0e80d8dec9531d',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg3QL62dH3AX-Px4sllaNsaJcvdZM3GxxHyuLliXOlClfzhbcjyzb7l8TZpCj9iGQzW1s&usqp=CAU',
        'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTY1gevfgPhOUyna7g1Mje58P8CNoYlm2QnMSbfeTDk_P4zhjs6eqXU1MHTHrpSLbtU3_NVo8ehvs-pQmhoEij9DLeYMu1TLE6Kf6RKeQ',
        'https://static.wikia.nocookie.net/bleach/images/7/7e/Katen_Kyokotsu.png/revision/latest?cb=20230326225758&path-prefix=zh',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0-wGNHT5qAvUrkkiPjzCS9UDFiAlzQ8h5D9gwLfU-GMSxklT2_VJIfZXXMEpkIZrqkTsmEO80b3Ut37F3uQ1li1HhS4wUR8to3uFgw'
    ]
};

let currentTheme = 'theme1';
let isGameStarted = false;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let scoreElement = document.getElementById('score');
const container = document.querySelector('.container');
const timerElement = document.getElementById('timer');

// 成功和失敗音效
const successSound = new Audio('success.mp3');
const failSound = new Audio('fail.mp3');

function generateCards() {
    container.innerHTML = '';
    let gridSize = parseInt(document.getElementById('grid-size').value, 10);  // 取得使用者選擇的網格大小
    container.style.gridTemplateColumns = `repeat(${gridSize}, 150px)`;       // 動態設置網格列數

    let totalCards = (gridSize * gridSize) / 2;  // 計算所需卡片對數
    let cards = [];

    themes[currentTheme].slice(0, totalCards).forEach((img) => {
        for (let i = 0; i < 2; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-inner" data-image="${img}">
                    <div class="card-front">
                        <img src="${img}" alt="image" style="width:100%; height:100%; border-radius: 10px;">
                    </div>
                    <div class="card-back">
                        Back
                    </div>
                </div>
            `;
            cards.push(card);
        }
    });

    cards = cards.sort(() => Math.random() - 0.5);  // 隨機打亂卡片
    cards.forEach(card => container.appendChild(card));

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => flipCard(card));
    });
}

function flipCard(card) {
    if (lockBoard || card === firstCard) return;
    card.classList.add('flip');
    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        checkForMatch();
    }
}

function checkForMatch() {
    lockBoard = true;
    let isMatch = firstCard.querySelector('.card-inner').dataset.image === secondCard.querySelector('.card-inner').dataset.image;

    if (isMatch) {
        successSound.play();
        disableCards();
        matches++;
        scoreElement.textContent = `得分: ${matches}`;
        if (matches === themes[currentTheme].length) {
            alert("你贏了！");
            resetGame();
        }
    } else {
        failSound.play();
        unflipCards();
    }
}

function disableCards() {
    if (document.getElementById('hide-completed').checked) {
        setTimeout(() => {
            firstCard.style.visibility = 'hidden';
            secondCard.style.visibility = 'hidden';
        }, 500);
    }
    firstCard.removeEventListener('click', () => flipCard(firstCard));
    secondCard.removeEventListener('click', () => flipCard(secondCard));
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function resetGame() {
    isGameStarted = false;
    matches = 0;
    scoreElement.textContent = `得分: ${matches}`;
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('flip');
    });
}

document.getElementById('flip-front').addEventListener('click', () => {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('flip');
    });
});

document.getElementById('flip-back').addEventListener('click', () => {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('flip');
    });
});

document.getElementById('switch-theme').addEventListener('click', () => {
    currentTheme = currentTheme === 'theme1' ? 'theme2' : 'theme1';
    if (!isGameStarted) {
        generateCards();
    }
});

document.getElementById('start-game').addEventListener('click', () => {
    if (!isGameStarted) {
        isGameStarted = true;
        generateCards();
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('flip');
        });

        let countdown = parseInt(document.getElementById('countdown-time').value, 10);
        timerElement.textContent = `倒數: ${countdown}`;
        
        const countdownInterval = setInterval(() => {
            countdown--;
            timerElement.textContent = `倒數: ${countdown}`;
            if (countdown === 0) {
                clearInterval(countdownInterval);
                document.querySelectorAll('.card').forEach(card => {
                    card.classList.add('flip');
                });
            }
        }, 1000);
    }
});

document.getElementById('restart-game').addEventListener('click', resetGame);
