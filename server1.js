const express = require('express')
const path = require('path')
const app = express();

const port = 8000;
app.use(express.static(__dirname))


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'maintenance.html'))
})

app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`)
})