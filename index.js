import express from 'express';
import fs from 'fs';

const app = express();
const port = 3000;

app.engine('html', (path, options, callback) => {
    fs.readFile(path, (err, content) => {
        if (err) return callback(err);
        const rendered = content.toString().replace(/{{(\w+)}}/g, (_, p1) => {
            return options[p1];
        });
        return callback(null, rendered);
    });
});

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('index', {
        placeholder: 'hello world',
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
