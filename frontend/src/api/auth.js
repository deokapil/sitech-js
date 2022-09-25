import app from "../FeathersClient";

export const serverLogin = async (credentials = null, dispatch = null) => {
  try {
    let auth = null;
    if (!credentials) {
      // Try to authenticate using an existing token
      auth = await app.reAuthenticate();
    } else {
      // Otherwise log in with the `local` strategy using the credentials we got
      auth = await app.authenticate({
        strategy: "local",
        ...credentials,
      });
    }
    return auth;
  } catch (error) {
    if (!dispatch) {
      return null;
    }
    dispatch({
      type: "UPDATE_ALERT",
      payload: { open: true, severity: "error", message: error.message },
    });
  }
};

export const serverLogout = async () => {
  await app.logout();
};
