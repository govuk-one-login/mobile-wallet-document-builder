import app from "./app";
import dotenv from 'dotenv';

dotenv.config();
const port: number | string = process.env.PORT || 3000;


(async () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        app.emit("appStarted");
    }).on("error", (error: Error) => {
        console.log(`Unable to start server: ${error.message}`);
    })
})().catch((error) => {
    console.log(`Server failed to create app ${error.message}`);
});

