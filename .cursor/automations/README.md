# Cursor Automations — Online Travel Guide

Пошаговая настройка автономной разработки.

## Шаг 0: GitHub (обязательно)

Cloud Automations работают с **удалённым репозиторием**. Сейчас код только локально.

```bash
cd travel-guide
git add .
git commit -m "feat: travel guide MVP with AI, map, PWA"
# Создай репо на github.com/new → travel-guide (private ok)
git remote add origin https://github.com/YOUR_USER/travel-guide.git
git push -u origin main
```

В Cursor: **Settings → GitHub** — подключи аккаунт, если ещё не подключён.

---

## Шаг 1: Три автоматизации

| # | Название | Триггер | Зачем |
|---|----------|---------|-------|
| 1 | **Daily Builder** | Каждый день 09:00 | Улучшает продукт без тебя |
| 2 | **PR Quality Gate** | Push / PR opened | Проверка build + review |
| 3 | **Content Sprint** | Пн 10:00 | Новый контент (города, секции) |

Промпты лежат в `.cursor/automations/*.md`

---

## Шаг 2: Создание в Cursor

1. Открой **Automations → + New Automation**
2. Или перейди по prefill-ссылке (сгенерированы ниже агентом)
3. Выбери **Repository** → твой `travel-guide`
4. Включи **Memories** и **Open pull request**
5. Модель: **Claude Sonnet** или **GPT-5.x** (medium/high)
6. Вставь промпт из соответствующего `.md` файла
7. **Create**

---

## Шаг 3: Переменные окружения (для cloud agent)

В Cloud Agent settings / repo secrets (если нужен AI на проде):
- `GEMINI_API_KEY          _KEY` — для тестов chat API

Локальная разработка агента в cloud sandbox не имеет твоего `.env.local` — chat-тесты в CI опциональны.

---

## Бilling

Automations = cloud agent runs. Следи за usage в Cursor dashboard (Pro+).

---

## Prefill links

После push на GitHub открой ссылки из чата агента или создай вручную по промптам.
