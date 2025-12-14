import { configDotenv } from "dotenv";
import app from "./src/app.mjs";

configDotenv();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`The server started at the port no ${PORT}`);
});
