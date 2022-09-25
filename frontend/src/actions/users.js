import { serverLogin, serverLogout } from "../api/auth";
export const login = async (user, dispatch) => {
  dispatch({ type: "START_LOADING" });

  const result = await serverLogin(user, dispatch);
  if (result) {
    dispatch({ type: "UPDATE_USER", payload: result });
    dispatch({ type: "CLOSE_LOGIN" });
  }

  dispatch({ type: "END_LOADING" });
};

export const logout = async (dispatch) => {
  await serverLogout();
  dispatch({ type: "UPDATE_USER", payload: null });
};
