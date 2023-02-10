import express from 'express';
const app = express();
app.use(express.static('root'));

const port = 3000;

app.get('/', (req, res) => {});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
