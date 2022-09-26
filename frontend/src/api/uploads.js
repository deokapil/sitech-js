import app from "../FeathersClient";

export const getDataFile = async (image_id) => {
  const uploadService = app.service("uploads");
  uploadService.timeout = 20000;
  try {
    const upload = await uploadService.get(image_id);
    return upload;
  } catch (err) {
    throw err;
  }
};
