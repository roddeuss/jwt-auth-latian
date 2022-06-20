require('dotenv').config

const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

app.use(express.json)

let refreshToken = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.accessToken
    if(refreshToken = null) return res.sendStatus(401)
    if (!refreshToken.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({name: user.name})
        res.json({accessToken: accessToken})
    })
})

const posts = [
    {
        username: "kyle",
        title: "post 1"
    },
    {
        username: "jack",
        title: "post 2"
    }
]

app.get('/posts', AuthenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

app.delete('/logout', (req, res) => {
    refreshToken = refreshToken.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/login', (req, res) => {
    //Authenticate User

    const username = req.body.username
    const user = {name: username}

   const accessToken =  generateAccessToken(user)
   const refreshToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
   refreshToken.push(refreshToken)

   res.json({ accessToken: accessToken, refreshToken: refreshToken})
})

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}

app.listen(4000)