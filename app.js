// Инициализируем Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Расширяем шторку на весь экран телефона

const form = document.getElementById('bookingForm');
const mainBtn = document.getElementById('mainBtn');
const codeSection = document.getElementById('codeSection');

let isCodeSent = false; // Флаг: отправлен ли уже код

// Узнаем Telegram ID пользователя, который открыл бота
const userId = tg.initDataUnsafe?.user?.id || "test_user";

// Сюда мы позже вставим ссылку на твой бесплатный сервер Render
const SERVER_URL = "https://my-web-server-vbgh.onrender.com
"; 

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const time = document.getElementById('time').value;

    if (!isCodeSent) {
        // ЭТАП 1: Запрашиваем код подтверждения
        mainBtn.innerText = "Отправка...";
        
        try {
            const response = await fetch(`${SERVER_URL}/api/send-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, phone })
            });

            if (response.ok) {
                isCodeSent = true;
                codeSection.classList.remove('hidden'); // Показываем поле для кода
                mainBtn.innerText = "Подтвердить запись";
            } else {
                alert("Ошибка при отправке кода. Попробуйте снова.");
                mainBtn.innerText = "Получить код";
            }
        } catch (error) {
            alert("Сервер пока не отвечает (мы его еще не запустили)");
            mainBtn.innerText = "Получить код";
        }

    } else {
        // ЭТАП 2: Проверяем введенный код
        const code = document.getElementById('verifyCode').value;
        mainBtn.innerText = "Проверка...";

        try {
            const response = await fetch(`${SERVER_URL}/api/verify-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, name, phone, email, time, code })
            });

            if (response.ok) {
                tg.showAlert("🎉 Вы успешно записаны! Чек отправлен на почту.");
                tg.close(); // Закрываем Web App автоматически
            } else {
                alert("Неверный код подтверждения!");
                mainBtn.innerText = "Подтвердить запись";
            }
        } catch (error) {
            alert("Ошибка соединения с сервером.");
        }
    }
});
