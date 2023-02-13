import express from 'express';
import fs from 'fs';

for (const dir of fs.readdirSync('pages')) {
    for (const file of fs.readdirSync(`pages/${dir}`)) {
        console.log(file);
        if (file.endsWith('.html'))
            fs.copyFileSync(`pages/${dir}/${file}`, `views/${file}`);
        else if (file.endsWith('.css'))
            fs.copyFileSync(`pages/${dir}/${file}`, `public/${file}`);
        else if (file.endsWith('.js'))
            fs.copyFileSync(`pages/${dir}/${file}`, `scripts/${file}`);
    }
}
// const app = express();
// const port = 3000;

// app.engine('html', (path, options, callback) => {
//     fs.readFile(path, (err, content) => {
//         if (err) return callback(err);
//         const rendered = content.toString().replace(/{{(\w+)}}/g, (_, p1) => {
//             return options[p1];
//         });
//         return callback(null, rendered);
//     });
// });

// app.use(express.static('public'));
// app.set('views', './views');
// app.set('view engine', 'html');

// app.get('/', (req, res) => {
//     if (req.query.action === 'new') res.redirect(`/${tick('', 'new').grid}`);
//     else res.render('index');
// });

// app.get('/:grid', (req, res) => {
//     // this is kinda eww but idfc
//     if (req.query.action) {
//         const state = tick(req.params.grid, req.query.action);
//         res.redirect(`/${state.grid}?gameOver=${state.gameOver}`);
//     } else
//         res.render('game', {
//             grid: render(req.params.grid),
//             gridData: req.params.grid,
//             gameOver:
//                 req.query.gameOver === 'true'
//                     ? '<div class="game-over">Game over!</div>'
//                     : '',
//         });
// });

// app.listen(port, () => {
//     console.log(`Listening on port ${port}`);
// });
