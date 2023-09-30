const app  = require('./app')


app.listen(process.env.PORT, () => {
    console.log(`Server listening on Port http://localhost:${process.env.PORT}`);
})