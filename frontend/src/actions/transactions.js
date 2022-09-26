import { getTransList } from "../api/transactions";

export const getTransactions = async (dispatch) => {
  const result = await getTransList();
  if (result) {
    dispatch({ type: "UPDATE_TRANSACTIONS", payload: result });
  }
};
