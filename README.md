# VHDL Generator Backend

Ovaj backend servis omogućava generisanje VHDL koda koristeći LLM model preko Groq API-ja. Na osnovu tekstualnog opisa komponente, backend šalje zahtjev modelu i vraća generisani VHDL kod.
📦 Instalacija

Kloniranje repozitorija:

    git clone git@github.com:Zlatanius/VHDL-Generator-Backend.git
    cd VHDL-Generator-Backend

Instaliranje zavisnosti:

    npm install

Nakon instaliranja zavisnosti potrebno je kreirati .env fajl u root direktoriju i dodati sljedeće varijable:

    GROQ_API_KEY=your_groq_api_key
    PORT=4000
    MAX_ATTEMPTS=3

GROQ_API_KEY: Tvoj API ključ za Groq

PORT: Port na kojem server pokreće aplikaciju (default je 4000)

MAX_ATTEMPTS: Maksimalan broj pokušaja korekcije koda

🚀 Pokretanje servera

Server se lokalno pokreće sa slijedećom komandom:

    npm run dev

Server će biti dostupan na adresi http://localhost:4000.

🧱 Tehnologije

- Node.js

- Express.js

- Groq LLM API
