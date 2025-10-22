# Quiz Game (Vite + React + TypeScript)

This project is a small quiz game built with Vite, React and TypeScript By Favour Uduose...

Features:

- Loads questions dynamically from src/data/questions.json
- Shows one question at a time with per-question timer
- Each game session is limited to 5 randomly-selected questions
- Timer is displayed during play and hidden on the final results screen
- Provides instant feedback on correctness
- Tracks score and shows final result
- Saves high scores to localStorage as a leaderboard
- Responsive UI and graceful error handling

How to run:

1. Install dependencies:
   npm install

2. Start dev server:
   npm run dev

3. Build for production:
   npm run build
   npm run preview

How to play:

- The game shows one question at a time. Each question has a countdown timer (shown in the top panel).
- Click an option to answer. Correct / incorrect feedback is shown briefly, then the next question appears.
- If the timer runs out, the question is marked incorrect and the game advances.
- When the game ends you will be prompted to enter a name to save your score to the leaderboard.
- Note: The timer UI is intentionally hidden on the results screen so the score view is not distracting.

Notes:

- Add, edit, or replace questions in src/data/questions.json. Each question item should contain:
  { "id": "q1", "question": "text", "options": ["a","b"], "answer": 0, "time": 15 }
- Leaderboard stored in browser localStorage under key `quiz_leaderboard`.

Enjoy!
