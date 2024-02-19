
import express from 'express';
import cors from 'cors';

const app = express()
import artworkRouter from "./routers/artwork-router.js";
import userRouter from "./routers/user-router.js";
import tokensRouter from "./routers/tokens-router.js";

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


// //Here i configure cors to accept only requests from
const corsOptions = {
    origin: 'http://localhost:5173',

}


app.use(cors(corsOptions));

const port = 3000

const SECRET = "dhdkshoidw273219102dsdqdpo";


app.get('/', (req, res) => {
    console.log(req);
    // res.send('Hello World!')
    res.json({ msg: "hello world"});
})

app.use('/users', userRouter);

app.use('/artworks', artworkRouter);


app.use('/tokens', tokensRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


