import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { serverLogin } from "../api/auth";
import reducer from "./reducer";

const initialState = {
  currentUser: null,
  openLogin: false,
  loading: false,
  alert: { open: false, severity: "info", message: "" },
  transactions: [],
  section: 0,
};

const Context = createContext(initialState);

export const useValue = () => {
  return useContext(Context);
};
const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    serverLogin().then((currentUser, err) => {
      if (currentUser) {
        dispatch({ type: "UPDATE_USER", payload: currentUser });
      }
      if (err) {
        return null;
      }
    });
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export default ContextProvider;
