import "dotenv/config";
import { createApp } from "./app";
import { getPortNumber } from "./config";

(async () => {
  const port = getPortNumber();
  const server = await createApp();

  server
    .listen(port, () => {
      console.log(`Server is running on on http://localhost:${port}`);
    })
    .on("error", (error: Error) => {
      console.log(`Unable to start server: ${error.message}`);
    });
})();
