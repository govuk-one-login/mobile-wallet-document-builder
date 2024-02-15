import "dotenv/config";
import { createApp } from "./app";
import { portNumber } from "./config";

(async () => {
  const port = portNumber();
  const server = await createApp();

  server
    .listen(port, () => {
      console.log(`Server is running on port ${port}`);
    })
    .on("error", (error: Error) => {
      console.log(`Unable to start server: ${error.message}`);
    });
})();
