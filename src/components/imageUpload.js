import React, { Fragment } from "react";
import styled from "styled-components";
import axios from "axios";
import { Spinner } from "@patternfly/react-core";
import { useAppState } from "../providers/appState";

const Uploader = styled.div`
  display: flex;
  justify-content: center;

  input {
    height: 0;
    overflow: hidden;
    width: 0;
  }

  input + label {
    position: relative;
    transition: 0.3s ease background-color;
    text-align: center;
    font-size: 1.5rem;
    width: 16rem;
    justify-content: center;
    font-weight: 500;
    padding: 0.4em 1em;
    color: #fff;
    background-color: ${(props) => (props.disabled ? "#c80000" : "#ee0000")};
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: inline-block;
    border-radius: 0.33rem;
    border: 1px solid transparent;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    font-family: var(--pf-global--FontFamily--redhatfont--heading--sans-serif);
    overflow: hidden;

    span.upload {
      display: inline-block;
      height: 100%;
      transition: all 0.3s;
      width: 100%;
      transform: ${(props) => props.disabled && "translateY(300%)"};
    }

    span.uploading {
      height: 100%;
      left: 0;
      position: absolute;
      line-height: 3.5rem;
      top: ${(props) => (props.disabled ? "0" : "-180%")};
      transition: all 0.3s;
      width: 100%;

      @media (min-width: 900px) {
        line-height: 4.4rem;
      }
    }

    @media (min-width: 900px) {
      font-size: 2rem;
      width: 22rem;
    }

    &:hover {
      background-color: ${(props) => (props.disabled ? "#e00" : "#c80000")};
      color: #fff;
      border: 1px solid ${(props) => (props.disabled ? "#e00" : "#c80000")};

      /* span {
        transform: translateY(300%);
      }

      &::before {
        top: 0;
      } */
    }
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${(props) => props.progressIncrement}%;
  transition: all ease 0.8s;
  background-color: ${(props) =>
    props.imageUrl ? "transparent" : "rgba(0, 0, 0, 0.2)"};
  z-index: -1;
  pointer-events: none;
`;

export default function PhotosUploader({ label }) {
  const {
    imageUrl,
    setImageUrl,
    isUploading,
    setIsUploading,
    progressIncrement,
    setProgress,
  } = useAppState();

  const getBase64Image = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      let width = "";
      let height = "";

      const MAX_WIDTH = 1600;
      const MAX_HEIGHT = 1600;

      const img = new Image();

      img.style.imageOrientation = "from-image";

      img.src = event.target.result;

      img.onload = () => {
        width = img.width;
        height = img.height;

        if (width / MAX_WIDTH > height / MAX_HEIGHT) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        canvas.style.imageOrientation = "from-image";
        ctx.fillStyle = "rgba(255,255,255,0.0)";
        ctx.fillRect(0, 0, 700, 600);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(img, 0, 0, width, height);

        const data = ctx.canvas.toDataURL("image/jpeg");
        callback(data);
      };
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  const onInputChange = (event) => {
    setIsUploading(true);

    for (const file of event.target.files) {
      const uploadPreset = "xdyw6p6r";
      const cloudName = "duynlpdrb";
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

      getBase64Image(file, (base64Value) => {
        const data = {
          upload_preset: uploadPreset,
          file: base64Value,
        };

        const config = {
          onUploadProgress: function (progressEvent) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(progress);
          },
        };

        axios
          .post(url, data, config)
          .then((response) => {
            setIsUploading(false);
            setImageUrl(response.data.url);
          })

          .catch((error) => {
            console.log(error);
            setIsUploading(false);
          });
      });
    }
  };

  return (
    <Fragment>
      {!imageUrl && (
        <Uploader isUploading={isUploading} disabled={isUploading}>
          <input
            type="file"
            id="fileupload"
            accept="image/*"
            onChange={onInputChange}
            title="Upload your Photo"
            disabled={isUploading}
          />
          <label htmlFor="fileupload">
            <span className="upload">{label}</span>
            <span className="uploading">
              Uploading{" "}
              <Spinner
                size="lg"
                style={{
                  marginLeft: "1rem",
                  marginTop: "-0.3rem",
                  verticalAlign: "middle",
                  "--pf-c-spinner--Color": "#fff",
                  "-pf-c-spinner--diameter": "2rem",
                }}
              />
            </span>
          </label>
        </Uploader>
      )}

      {progressIncrement && (
        <ProgressBar
          imageUrl={imageUrl}
          progressIncrement={progressIncrement}></ProgressBar>
      )}
    </Fragment>
  );
}
