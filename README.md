# Kawiarnia Specialty - Frontend E-commerce
Aplikacja frontendowa (SPA) dla kawiarni specialty. Projekt składa się ze strefy sklepu dla klientów oraz rozbudowanego panelu administracyjnego do zarządzania asortymentem, dostawami i zamówieniami.

*Uwaga: Repozytorium zawiera wyłącznie warstwę kliencką. Do pełnego działania wymagany jest dedykowany backend (Node.js/Express).*

## Główne funkcjonalności
#### Strefa Klienta
1. Katalog produktów: Dynamiczne renderowanie asortymentu z podziałem na kategorie (ziarna, herbaty, zaparzacze, filtry, szkło).

2. Filtrowanie i wyszukiwanie: Filtry dostosowujące się do kontekstu (np. metoda obróbki tylko dla kawy), wyszukiwarka tekstowa oraz suwak cenowy.

3. Paginacja: Wydajne ładowanie list produktów partiami (po 30 sztuk) ograniczające obciążenie przeglądarki.

4. Konto użytkownika: Zarządzanie profilem, adresami oraz dostęp do historii zamówień.

5. Śledzenie zamówień: Wizualna oś czasu (Progress Bar) prezentująca aktualny etap realizacji na podstawie danych z bazy.

6. Lista oczekujących (Waitlist): Możliwość zapisu na powiadomienia e-mail dla wyprzedanych produktów.

#### Panel Administratora
1. Zarządzanie zamówieniami: Interfejs do zmiany statusów zamówień z walidacją dopuszczalnych przejść.

2. Rejestracja dostaw: Złożony formularz do masowego dodawania stanów magazynowych oraz wprowadzania nowych produktów do bazy.

3. Dodawanie produktów: Formularz z dynamicznymi polami wymaganymi dla konkretnych kategorii i obsługą przesyłania plików zdjęciowych (FormData).

4. Statystyki: Podstawowe podsumowanie przychodów i aktywnych zamówień.

## Technologie
- Framework: React (Hooks: useState, useEffect, useMemo, useCallback, useContext)

- Styling: Tailwind CSS

- Routing: React Router DOM v6

- Zarządzanie stanem globalnym: Context API (AuthProvider, CartContext)

- Komunikacja API: Axios z obsługą tokenów i interceptorów

- Zależności dodatkowe: react-icons, @uidotdev/usehooks, react-slider

## Wybrane rozwiązania techniczne
- React Portals: Modale aplikacji (np. szczegóły produktu, formularze dostaw) są renderowane poza głównym drzewem DOM (w document.body). Eliminuje to problemy z konfliktami z-index oraz obcinaniem interfejsu przez klasy typu overflow-hidden i transformacje CSS z Tailwinda.

- Dynamiczne formularze UI: Interfejs modyfikuje dostępne pola na podstawie wybranej kategorii (np. wymusza podanie farmy i profilu smakowego tylko dla ziaren kawy).