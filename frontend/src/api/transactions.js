import app from "../FeathersClient";

export const getTransList = async () => {
  const params = { query: { from: "consumer" } };
  try {
    const transList = await app.service("trans-logs").find(params);
    console.log(transList);
    return transList.data;
  } catch (error) {
    throw error;
  }
};
