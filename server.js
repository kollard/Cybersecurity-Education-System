const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;	//port na ktorom bude spusteny server

app.use(bodyParser.json());
app.use(express.static('.'));

//Nastavenie spravnych odpovedi na otazky

const correctAnswers = {
    'uloha1-otazka1': '1', // /usr/bin/find
    'uloha1-otazka2': '2', // FLG0147258O
    'uloha2-otazka1': '3', // /home/msfadmin/.ssh/authorized_keys
    'uloha2-otazka2': '4', // FLG137982465 
    'uloha3-otazka1': '5', // U3L0H4
    'uloha3-otazka2': '6', // 20.10.2020
    'uloha3-otazka3': '7', // FLG654321
};


//Matematika bodov

app.post('/submit', (req, res) => {
    const { questionId, answer, hintsUsed } = req.body;
    let correct = correctAnswers[questionId] && answer.toLowerCase().includes(correctAnswers[questionId].toLowerCase());
    let scoreDecrease = hintsUsed * 10; 			//penalizacia za pouzitie napovedy
    let score = correct ? Math.max(50 - scoreDecrease, 0) : 0;  //spocitanie bodov pri spravnej odpovedi
    res.json({ correct: correct, score: score });
});


//Nastavenie napoved otazky

const hints = {
    'uloha1-otazka1': ["vyhladajte subory ktore maju povolenie s (-u=s)", "find / -perm -u=s -type f 2>/dev/null"],
    'uloha1-otazka2': ["pouzite kombinaciu find a exec (find /home/user1/ -exec ls {} \;)", "find /home/user1/not_personal_data/flag_1 -exec cat {} \;"],
    
    'uloha2-otazka1': ["cat /home/user/.*history", "sudo cat ~/.ssh/id_dsa.pub >> /home/msfadmin/.ssh/authorized_keys"],    
    'uloha2-otazka2': ["konkretne sa to nachadza v priecinku /user/data", "cat /home/user/data/flag2.txt"],
    
    'uloha3-otazka1': ["vyhladajte vsetky kluce (KEYS *)", "vypiste kluc uzivatela Uloha3 (GET (key))"],
    'uloha3-otazka2': ["cat /Dokumenty/hash.txt"],
    'uloha3-otazka3': ["john --wordlist=/usr/share/wordlists/rockyou.txt <priecinok s hashom>"],
};


//Kontrola poctu pouzitych napoved v ulohe

app.get('/hint/:ulohaId/:otazkaId/:hintNumber', (req, res) => {
    const { ulohaId, otazkaId, hintNumber } = req.params;
    const hintKey = `uloha${ulohaId}-otazka${otazkaId}`;
    const hintIndex = parseInt(hintNumber, 10);
    const hint = hints[hintKey] && hints[hintKey][hintIndex] ? hints[hintKey][hintIndex] : "Žiadna ďalšia nápoveda.";
    res.json({ hint: hint });
});


//Nastavenie sluzby mail

const transporter = nodemailer.createTransport({
    host: 'smtp.centrum.sk', //mail provider
    port: 465, //port mail providera
    secure: true,
    auth: {
        user: 'cvicenie01@centrum.sk',  //meno a heslo mailu z ktoreho sa bude posielat vyhodnotenie
        pass: 'Cvicenie111.' 
    }
});

//Odosielanie mailu a nastavenie formatu

app.post('/send-results', (req, res) => {
  const { name, results } = req.body; 
  
    let resultsString = "";
    Object.entries(results).forEach(([key, value]) => {
        resultsString += `${key}: ${value}\n`;
    });

  let mailOptions = {
        from: 'cvicenie01@centrum.sk',
        to: 'Ucitel1@gmail.com',    //mail kam sa odoslu vysledky cvicenia
        subject: `Vysledok od ${name}`,
        text: `Vysledok od ${name}:\n\n${resultsString}` 
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ', error);
            res.status(500).send('Error sending email.');
        } else {
            console.log('Email sent: ', info.response);
            res.send('Email sent successfully.');
        }
    });
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
