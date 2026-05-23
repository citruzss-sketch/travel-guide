# Cursor Automations — Online Travel Guide

Автономная разработка проекта через Cloud Agents в Cursor.

## Быстрый старт

1. **GitHub** — репозиторий: `https://github.com/citruzss-sketch/travel-guide`
2. **Cursor → Automations** — создай или включи автоматизации ниже
3. В каждой: выбери репозиторий, включи **Memories** и **Open pull request** (кроме PR Gate)
4. Модель: Claude Sonnet или GPT-5.x (medium/high)

## Три агента

| Агент | Расписание | Промпт | Prefill |
|-------|------------|--------|---------|
| **Daily Builder** | Каждый день 09:00 | [daily-builder.md](./daily-builder.md) | [Создать](https://cursor.com/automations/new?prefill=eyJuYW1lIjoiVHJhdmVsIEd1aWRlIOKAlCBEYWlseSBCdWlsZGVyIiwiZGVzY3JpcHRpb24iOiJBdXRvbm9tb3VzIGRhaWx5IHByb2R1Y3QgaW1wcm92ZW1lbnRzIGZvciBPbmxpbmUgVHJhdmVsIEd1aWRlIiwid29ya2Zsb3ciOnsidHJpZ2dlcnMiOlt7InR5cGUiOiJjcm9uIiwiY3JvbkV4cHJlc3Npb24iOiIwIDkgKiAqICoifV0sImFjdGlvbnMiOlt7InR5cGUiOiJhZ2VudCIsInByb21wdCI6IlJlYWQgQUdFTlRTLm1kIGFuZCAuY3Vyc29yL2F1dG9tYXRpb25zL2RhaWx5LWJ1aWxkZXIubWQuIFBpY2sgb25lIGJhY2tsb2cgaXRlbSwgaW1wbGVtZW50LCBydW4gbnBtIHJ1biBidWlsZCwgb3BlbiBQUi4ifV0sIm1lbW9yeUVuYWJsZWQiOnRydWUsImdpdENvbmZpZyI6eyJvcGVuUHVsbFJlcXVlc3QiOnRydWV9fX0) |
| **Content Sprint** | Пн 10:00 | [content-sprint.md](./content-sprint.md) | [Создать](https://cursor.com/automations/new?prefill=eyJuYW1lIjoiVHJhdmVsIEd1aWRlIOKAlCBDb250ZW50IFNwcmludCIsImRlc2NyaXB0aW9uIjoiV2Vla2x5IGNvbnRlbnQgc3ByaW50OiBlbnJpY2ggVmlldG5hbSBjaXRpZXMgb3IgYWRkIG5ldyBkZXN0aW5hdGlvbnMiLCJ3b3JrZmxvdyI6eyJhY3Rpb25zIjpbeyJwcm9tcHQiOiJSZWFkIEFHRU5UUy5tZCBhbmQgLmN1cnNvci9hdXRvbWF0aW9ucy9jb250ZW50LXNwcmludC5tZC4gRG8gb25lIGNvbnRlbnQgdGFzayAoZW5yaWNoIGNpdGllcyBPUiBhZGQgbmV3IGNpdHkpLiBSdW4gbnBtIHJ1biBidWlsZC4gT3BlbiBQUiB0aXRsZWQgY29udGVudDogLi4uIiwidHlwZSI6ImFnZW50In1dLCJnaXRDb25maWciOnsib3BlblB1bGxSZXF1ZXN0Ijp0cnVlfSwibWVtb3J5RW5hYmxlZCI6dHJ1ZSwidHJpZ2dlcnMiOlt7ImNyb25FeHByZXNzaW9uIjoiMCAxMCAqICogMSIsInR5cGUiOiJjcm9uIn1dfX0) |
| **PR Quality Gate** | На каждый PR | [pr-quality-gate.md](./pr-quality-gate.md) | [Создать](https://cursor.com/automations/new?prefill=eyJuYW1lIjoiVHJhdmVsIEd1aWRlIOKAlCBQUiBRdWFsaXR5IEdhdGUiLCJkZXNjcmlwdGlvbiI6IlBSIHF1YWxpdHkgZ2F0ZTogYnVpbGQsIGxpbnQsIHJldmlldyBvbiBldmVyeSBwdXNoL1BSIiwid29ya2Zsb3ciOnsiYWN0aW9ucyI6W3sicHJvbXB0IjoiUmVhZCBBR0VOVFMubWQgYW5kIC5jdXJzb3IvYXV0b21hdGlvbnMvcHItcXVhbGl0eS1nYXRlLm1kLiBSdW4gbnBtIHJ1biBidWlsZCBhbmQgbGludC4gUmV2aWV3IFBSIGRpZmYuIENvbW1lbnQgd2l0aCBmaW5kaW5ncy4gRml4IHRyaXZpYWwgaXNzdWVzLiIsInR5cGUiOiJhZ2VudCJ9XSwiZ2l0Q29uZmlnIjp7Im9wZW5QdWxsUmVxdWVzdCI6ZmFsc2V9LCJtZW1vcnlFbmFibGVkIjp0cnVlLCJ0cmlnZ2VycyI6W3sidHlwZSI6InB1bGxfcmVxdWVzdCJ9XX19) |

> Уже есть Daily Builder: https://cursor.com/automations/85f0825e-644b-41f8-a6d3-7b30e7a2d02e

## Что делает каждый агент

- **Daily Builder** — берёт задачу из `AGENTS.md`, пишет код, `npm run build`, открывает PR
- **Content Sprint** — добавляет контент (города, места, цены) или новый город во Вьетнаме
- **PR Quality Gate** — build + lint + review комментарий на PR, мелкие фиксы

## План развития (для Memories)

1. Контент: Ho Chi Minh, Hue, Hoi An
2. Страны: Таиланд, Бали (скелет)
3. UX: PWA offline, share, a11y
4. AI: city-specific prompts, fallbacks
5. Quality: ESLint, error boundaries, skeletons

## Billing

Automations = cloud agent runs. Следи за usage в Cursor dashboard.

## Secrets (опционально)

Для тестов chat API в CI: `GEMINI_API_KEY` в repo secrets. Локальный `.env.local` агент в cloud не видит.
