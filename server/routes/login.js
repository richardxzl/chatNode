const express = require('express');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();



app.post('/google', async(req, res) => {

    // let body = req.body;

    // console.log('kaka' + verificaToken);

    let token = req.body.idtoken;

	let googleUser = await verify(token)
		.catch(e => {
		    return res.status(403).json({
		        ok: false,
		        err: e
		    });
	});

		   // redirecting user to interface
	// console.log(googleUser);

   	let tokenx = jwt.sign({
        usuario: googleUser
    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

    console.log(tokenx);



    res.json({
        ok: true,
        usuario: googleUser,
        tokenx
    });
});

app.get('/chat', (req, res) => {

	// return res.redirect('chat.html?nombre=ri&sala=1');
    console.log(req.body);


});

// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}




module.exports = app;