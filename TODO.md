# Social Links - TODO & Release Plan

## 📦 Wersja 1.16.0 (Najbliższe wydanie)

- [ ] **Wydanie na npm i zamknięcie zadań GitHub:**
  - Podbicie wersji do `1.16.0` w `package.json`.
  - `npm run build && npm publish`.
  - Zamknięcie PR **#56** (Twitter -> X, obsłużone w 1.15.1).
  - Zamknięcie PR **#52** i Issue **#43** (LinkedIn Company + percent-encoding).
  - Zamknięcie PR **#55** (Diakrytyki w linkach).
  - Zamknięcie PR **#51** (Dependabot - usunięty wraz z Jestem).

---

## 🔮 Backlog (Przyszłe wydania)

- [ ] **Issue #26: Wykrywanie tylko pełnych linków (`detectProfile` w/o bare ID fallback):**
  - Dodanie opcji np. `detectProfile(input, { linksOnly: true })` lub `hasDomain: true`.
  - Zapobieganie sytuacji, w której dowolny string (np. `"vinspee"`) dopasowuje się do pierwszego zarejestrowanego profilu tylko dlatego, że pasuje do samego `PROFILE_ID`.
- [ ] **Issue #31: Wsparcie dla usług bazujących na numerach telefonów (WhatsApp, Telegram itp.):**
  - Rozważenie funkcyjnego walidatora/matchera zamiast wyłącznie czystego RegExp (parsowanie i formatowanie numerów międzynarodowych).
