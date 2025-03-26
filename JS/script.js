document.addEventListener("DOMContentLoaded", () => {
    const tasks = [
        { id: "economy", name: "Экономика" },
        { id: "management", name: "Менеджмент" },
        { id: "IT", name: "IT" },
        { id: "engineer", name: "Инженерия" }
    ];
    let currentTaskIndex = 0;
    let openedCards = [];
    let matchedCards = 0;
    let moveCounter = 0;

    const startGame = document.querySelector(".start-game");
    const gameBoard = document.getElementById("gameBoard");
    const modalOverlay = document.querySelector(".modal-overlay");
    const modalOverlayNext = document.querySelector(".modal-overlay-next");
    const moveCounterElement = modalOverlay.querySelector(".move-counter");
    const moveCounterNextElement = modalOverlayNext.querySelector(".move-counter");
    const restartGame = modalOverlay.querySelector(".restart-game");
    const nextBtn = modalOverlayNext.querySelector(".nextBtn");
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");

    const cards = document.querySelectorAll(".memory-card");

    // Функция для отображения задания
    function setTask() {
        taskElement.textContent = `Найди все карточки по теме "${tasks[currentTaskIndex].name}"`;
        gameBoard.insertBefore(taskElement, gameBoard.firstChild);
    }

    // Функция для перемешивания карточек
    function shuffleCards() {
        cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * cards.length);
            card.style.order = randomPos;
        });
    }

    // Функция для проверки совпадений
    function checkMatch(card) {
        openedCards.push(card);
        moveCounter++;  // Увеличиваем счетчик ходов после каждого клика

        if (openedCards.length === 4) {
            if (openedCards.every(c => c.id === tasks[currentTaskIndex].id)) {
                openedCards.forEach(c => c.classList.add("disappear"));
                matchedCards += 4;

                setTimeout(() => {
                    // Показать окно перехода на следующую тему
                    if (currentTaskIndex < tasks.length - 1) {
                        modalOverlayNext.style.display = "block";
                        moveCounterNextElement.textContent = `${moveCounter}`;
                    } else {
                        // Показать окно завершения игры
                        modalOverlay.style.display = "block";
                        moveCounterElement.textContent = `${moveCounter}`;
                    }
                }, 500);
            } else {
                setTimeout(() => {
                    openedCards.forEach(c => c.classList.remove("flip"));
                }, 800);
            }
            openedCards = [];
        }
    }

    // Обработчик клика по карточке
    function handleCardClick(event) {
        const clickedCard = event.target.closest(".memory-card");
        if (!clickedCard || openedCards.includes(clickedCard) || clickedCard.classList.contains("flip")) {
            return;
        }

        clickedCard.classList.add("flip");
        if (clickedCard.id === tasks[currentTaskIndex].id) {
            checkMatch(clickedCard);
        } else {
            // Все клики увеличивают счетчик ходов, даже если это неправильная карточка
            moveCounter++;  
            setTimeout(() => clickedCard.classList.remove("flip"), 800);
        }
    }

    // Функция для перехода к следующему этапу
    function nextStage() {
        modalOverlayNext.style.display = "none";
        currentTaskIndex++;

        if (currentTaskIndex < tasks.length) {
            // Скрываем карточки с предыдущей темой
            document.querySelectorAll(".memory-card").forEach(card => {
                if (card.id === tasks[currentTaskIndex - 1].id) {
                    card.classList.add("disappear"); // Применяем исчезновение
                    card.style.pointerEvents = "none"; // Блокируем взаимодействие с исчезнувшими картами
                }
            });

            setTask(); // Устанавливаем задание для новой темы
            shuffleCards(); // Перемешиваем карточки для следующей темы
        } else {
            // Игра завершена
            alert("Игра завершена! Все этапы пройдены.");
            location.reload();
        }
    }

    // Запуск игры
    startGame.addEventListener("click", () => {
        let title = document.querySelector("h1");
        let btn = document.querySelector("button");
        let desc = document.querySelector(".description");
        title.style.display = "none";
        btn.style.display = "none";
        desc.style.display = "none";
        gameBoard.style.display = "flex";

        shuffleCards(); // Перемешиваем карточки
        setTask(); // Устанавливаем задание
    });

    // Слушатель кликов по карточкам
    gameBoard.addEventListener("click", handleCardClick);
    restartGame.addEventListener("click", nextStage);
    nextBtn.addEventListener("click", nextStage);
});



