
const { query } = require("express");
const express = require("express");
const jwt = require('jsonwebtoken')
const connection = require('../db.config.js');
const controller = require('../models/controller.js');

const app = express();
app.use(express.json());
const SECRET = 'mykey'
/* Récupération du header bearer */
exports.extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

/* Vérification du token */
exports.checkTokenMiddleware = (req, res, next) => {
    // Récupération du token
    const token = req.headers.authorization && this.extractBearerToken(req.headers.authorization)

    // Présence d'un token
    if (!token) {
        return res.status(401).json({ message: 'Error. Need a token' })
    }

    // Véracité du token
    jwt.verify(token, SECRET, (err, decodedToken) => {
        if (err) {
            res.status(401).json({ message: 'Error. Bad token' })
        } else {
            return next()
        }
    })
}