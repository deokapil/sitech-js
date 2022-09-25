import feathers from "@feathersjs/client";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SERVER_URL);

const app = feathers();

app.configure(feathers.socketio(socket));
app.configure(
  feathers.authentication({
    storage: window.localStorage,
  })
);

export default app;
