## Project Overview

- Name: Math Quiz Adventure
- Technology: Next.js, MongoDB, JWT, TailwindCSS
- Primary features: user registration/login, quiz play (multiple-choice questions), leaderboard

## Purpose

I am building this Math Quiz game for my university assignment. I have attached the assignment document as well. [CIS046-3 _assignment-brief_AY2526.pdf]


## Goals

- Provide a responsive quiz app with persistent user accounts and attempt tracking.
- Secure authentication using JWTs.
- Track and rank players on a leaderboard.
- Fetch Questions from a 3rd party API like: `opentdb` and `marcconrad`
- UI/Ux should be modern and futuristic like a space game.
- Add interactive Animations and colorful elements and graphics.


## Fetch Questions from 3rd party API


Here is a sample API that I get from `opentdb` we can use this as a random question generator.

URL: `[GET]` `https://opentdb.com/api.php?amount=10&category=19&difficulty=easy&type=multiple`

Response: 
```
{"response_code":0,"results":[{"type":"multiple","difficulty":"easy","category":"Science: Mathematics","question":"What is the equation for the area of a sphere?","correct_answer":"(4/3)&pi;r^3","incorrect_answers":["4&pi;r^2","(1/3)&pi;hr^2","&pi;r^4"]},{"type":"multiple","difficulty":"easy","category":"Science: Mathematics","question":"In Roman Numerals, what does XL equate to?","correct_answer":"40","incorrect_answers":["60","15","90"]},{"type":"multiple","difficulty":"easy","category":"Science: Mathematics","question":"How many sides does a trapezium have?","correct_answer":"4","incorrect_answers":["3","5","6"]},{"type":"multiple","difficulty":"easy","category":"Science: Mathematics","question":"What type of angle is greater than 90&deg;?","correct_answer":"Obtuse","incorrect_answers":["Acute","Right","Straight"]},{"type":"multiple","difficulty":"easy","category":"Science: Mathematics","question":"What prime number comes next after 19?","correct_answer":"23","incorrect_answers":["25","21","27"]},{"type":"multiple","difficulty":"easy","category":"Science: Mathematics","question":"The metric prefix &quot;atto-&quot; makes a measurement how much smaller than the base unit?","correct_answer":"One Quintillionth","incorrect_answers":["One Billionth","One Quadrillionth","One Septillionth"]},{"type":"multiple","difficulty":"easy","category":"Science: Mathematics","question":"What&#039;s the square root of 49?","correct_answer":"7","incorrect_answers":["4","12","9"]},{"type":"multiple","difficulty":"easy","category":"Science: Mathematics","question":"What is the correct order of operations for solving equations?","correct_answer":"Parentheses, Exponents, Multiplication, Division, Addition, Subtraction","incorrect_answers":["Addition, Multiplication, Division, Subtraction, Addition, Parentheses","Parentheses, Exponents, Addition, Substraction, Multiplication, Division","The order in which the operations are written."]},{"type":"multiple","difficulty":"easy","category":"Science: Mathematics","question":"How many sides does a heptagon have?","correct_answer":"7","incorrect_answers":["8","6","5"]},{"type":"multiple","difficulty":"easy","category":"Science: Mathematics","question":"What is the symbol for Displacement?","correct_answer":"&Delta;r","incorrect_answers":["dr","Dp","r"]}]}
```

## Use Banana API
Banana API is a another API that returns a random math question. basically the question comes as a image URL and we are receiving the answer as well.

URL: https://marcconrad.com/uob/banana/api.php
Response: 
```
{
  "question" : "https://www.sanfoh.com/uob/banana/data/t6c6141b802f66d52caa1592ef7n89.png",
  "solution" : 9 
}
```


## End-to-end Features (Functional)

1. User Registration

   - Fields: `username`, `email`, `password` (and confirm in UI if desired)
   - Validations: unique email, password length/strength
   - Success: returns user object and JWT token

2. User Login

   - Fields: `email`, `password`
   - On success: store JWT in client (localStorage/sessionStorage) and redirect to home

3. JWT-based Authentication

   - Backend middleware verifies token for protected endpoints (`quiz`, `leaderboard` submission if required)
   - Tokens stored client-side in `localStorage` or `sessionStorage`

4. Quiz Flow

   - Present multiple-choice questions that is fetching from the 3rd party API
   - Each Game has 10 quiz. 
   - For each quiz player have 30 seconds to answer.
   - If they answered correctly they will move to the next quiz.
   - Each correct answer gives a 1 point.
   - If user gives a incorrect answers, it will open a pop-up modal and it's showing a Banana Question from the Banana API. 
   - A player have 15 seconds to answer the Banana question if he gave the correct answer then user can continue the game but he will not get a point.
   - also if player is enabled to provide the correct answer for the Banana question or cant answer withing the given period then the game will be over and user can see the results page.

5. Leaderboard

   - Display: username, score, date/time, and possibly accuracy/time taken

6. Profile
    - Show player details
    - Previous games results.
    - Edit profile
    - update password


## Non-functional Requirements

- Security: passwords stored hashed (bcrypt or similar), JWT secrets stored in environment variables.
- Performance: app lightweight; server responds under reasonable latency for small user base.
- Reliability: seed tooling and data backups recommended.
- Maintainability: clear separation between frontend static assets and backend API.


## UX / User Flows

1. New user

   - Visits `register` -> fills form -> receives JWT -> lands on `home`.

2. Returning user

   - Goes to `login` -> receives JWT -> lands on `home` -> click start new game button -> lands on `quiz` -> plays -> sees `results` -> `home`.

3. In the `home` page we can see the start new game button with the leaderboard.


## Validation & Error Handling

- Client-side: basic input checks (email format, password length, required fields).
- Server-side: validate all payloads, return helpful error messages and status codes (400/401/403/409/500).
- Rate limiting: optionally protect auth endpoints against brute-force.

## Security Considerations

- Passwords: store hashed with bcrypt (salted). Never store plaintext.
- JWT: use strong secret from environment variable (e.g., `JWT_SECRET`). Set token expiration (e.g., 1h or 7d as appropriate).
- HTTPS: require TLS in production.
- CORS: restrict origins to the frontend domain in production.
- Input sanitization: avoid injection attacks; validate and sanitize fields.
