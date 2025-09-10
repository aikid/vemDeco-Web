// Imports
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3010;
const HOST = '0.0.0.0'; 


// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
    res.render('index', { text: 'This is EJS'})
})

app.get('/login', (req, res) => {
    res.render('login', { text: 'Login Page'})
})

app.get('/cadastro', (req, res) => {
    res.render('cadastro', { text: 'Cadastro Page'})
})

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { text: 'Dashboard Page'})
})

app.get('/confirmaremail', (req, res) => {
    res.render('confirmaremail', { text: 'confirmaremail Page'})
})

app.get('/esquecisenha', (req, res) => {
    res.render('esquecisenha', { text: 'esquecisenha Page'})
})

app.get('/produto', (req, res) => {
    res.render('produto', { text: 'produto Page'})
})

app.get('/contato', (req, res) => {
    res.render('contato', { text: 'produto Page'})
})



//  Listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`))