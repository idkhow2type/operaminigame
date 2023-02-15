import express from 'express';
import fs from 'fs';

const app = express();

for (const dir of ['public', 'scripts', 'views']) {
    try {
        if (!fs.existsSync()) fs.mkdirSync(dir);
    } catch (e) {}
}
for (const dir of fs.readdirSync('pages')) {
    for (const file of fs.readdirSync(`pages/${dir}`)) {
        if (!fs.existsSync(`public/${dir}`)) fs.mkdirSync(`public/${dir}`);
        if (file.endsWith('.html'))
            fs.copyFileSync(`pages/${dir}/${file}`, `views/${file}`);
        else if (file.endsWith('.js'))
            fs.copyFileSync(`pages/${dir}/${file}`, `scripts/${file}`);
        else if (['.css', '.png'].some((s) => file.endsWith(s)))
            fs.copyFileSync(`pages/${dir}/${file}`, `public/${dir}/${file}`);
    }
}

const modules = {};
for (const file of fs.readdirSync('scripts')) {
    modules[file.slice(0, file.length - 3)] = await import(`./scripts/${file}`);
}

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
        games: fs
            .readdirSync('pages')
            .filter((dir) => !['index'].includes(dir))
            .map(
                (dir) =>
                    `<li><a href="/${dir}"><div class="image-cover"></div><div class="image" style="--url: url('/${dir}/thumbnail.png')"></div><h2>${dir}</h2></a></li>`
            )
            .join(''),
        page: 'index',
    });
});

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/:game', (req, res) => {
    modules[req.params.game].start(req, res);
});

app.get('/:game/:data', (req, res) => {
    modules[req.params.game].update(req, res);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
