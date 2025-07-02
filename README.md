# 💻 Využitie interaktívneho vzdelávacieho prostredia pre praktické riešenie úloh kybernetickej bezpečnosti

Tento projekt bol vytvorený ako súčasť diplomovej práce na tému aplikovania praktických cvičení z oblasti kybernetickej bezpečnosti. 
Cieľom bolo navrhnúť a implementovať jednoduchý systém na vykonávanie simulovaných penetračných testov a praktických úloh, doplnený o automatické vyhodnocovanie odpovedí.

## 🧠 Hlavné funkcionality:
- Systém pozostáva z klienta (HTML + JS) a serverovej časti (Node.js).
- Užívateľ rieši zadania v prostredí Kali Linux, pripája sa k zraniteľným systémom.
- Úlohy sa vyhodnocujú automaticky na základe odpovedí a záznamov.
- Možnosť sledovať úspešnosť a skóre.

## 🖼️ Diagramy
Bloková schéma testovacieho prostredia:
![Testovacie prostredie](docs/testovacie_prostredie.png)

Vývojový diagram systému:
![Vývojový diagram](docs/vyvojovy_diagram.png)

## 🗃️ Technológie
- Node.js
- HTML/CSS/JS
- Penetračné testovanie v Kali Linux
- Redis, Samba, SSH, NAT

## 📁 Struktúra
- `client/` – HTML stránky úloh a používateľské rozhranie
- `server/` – Node.js skripty na spracovanie výsledkov
- `docs/` – Diagramy z diplomovej práce

## 🏁 Ako spustiť
1. Naklonuj repozitár:  
git clone https://github.com/kollard/Cybersecurity-Education-System.git
2. Spusti server.js v Node.js
3. Otvor index.html vo webovom prehliadači
