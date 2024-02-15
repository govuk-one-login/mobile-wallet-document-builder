import express, {Express, Request, Response} from 'express';
import bodyParser from "body-parser";

const app: Express = express();
app.use(bodyParser.json())

app.get('/hello-world', (req: Request, res: Response) => {
    res.send('This is the UI of the Example GOV.UK Wallet Document Builder');
});
 

export default app;
