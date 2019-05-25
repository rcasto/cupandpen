const express = require('express');

const port = 3000;
const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port,
    () => console.log(`Server started on port ${port}`));