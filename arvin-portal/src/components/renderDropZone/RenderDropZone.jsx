import { Typography, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Dropzone from "react-dropzone";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import configure from "../../apps/configure/configure.json";
const renderEqualProps = (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
};

const RenderDropZone = ({
  input: { value: omitValue, onChange, onBlur, ...inputProps },
  handleOnDrop,
  attachedFile,
  placeholder,
  label,
  type,
  required,
  accept,
  size_lg = 9,
  size_xl = 6,
  ...props
}) => {
  return (
    <Dropzone onDrop={(file) => handleOnDrop(file, onChange)} accept={accept}>
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps({
            className: "dropzone dropzone-default dropzone-success",
          })}
        >
          <input {...getInputProps()} {...props.input} />
          <Typography className="dropzone-msg-title">
            Drag'n'drop files, or click to select files
          </Typography>
          <Box>
            <Typography>Files:</Typography>
            <ul>
              {attachedFile.map((file) => (
                <li key={file.name}>{file.name}</li>
              ))}
            </ul>
          </Box>
        </div>
      )}
    </Dropzone>
  );
};

export default React.memo(RenderDropZone, renderEqualProps);
