const app = require('./index');
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Review service running on http://localhost:${port}`);
});
