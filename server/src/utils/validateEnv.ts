import { cleanEnv } from "envalid"; // import the cleanEnv function to validate the environment variables
import { port, str } from "envalid"; // import the port and str functions to validate the PORT and MONGO_URI environment variables

export default cleanEnv(process.env, { // validate the environment variables
  MONGO_URI: str(),
  SECRET: str(),
  PORT: port(),
  BUCKET_NAME: str(),
});