import { Button } from "@mui/material";
import React from "react";
import { getDataFile } from "../api/uploads";
import { parseDataUri } from "../hooks/uriUtils";

const S3DownloadButton = ({ params }) => {
  const { key } = params.row;
  const handleOnClick = async (evt) => {
    evt.preventDefault();
    const result = await getDataFile(key);
    let { mimeType, bData } = parseDataUri(result.uri);
    let csvBlob = new Blob([bData], {
      type: `${mimeType};charset=utf-8;`,
    });
    let fileName = key.split("/").at(-1);

    const blobUrl = URL.createObjectURL(csvBlob);
    // Create a link element
    const link = document.createElement("a");
    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    link.download = fileName;
    // Append link to the body
    document.body.appendChild(link);
    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );

    // Remove link from body
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="contained"
      component="button"
      size="small"
      onClick={handleOnClick}
    >
      Download
    </Button>
  );
};

export default S3DownloadButton;
