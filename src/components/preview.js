import React, { Fragment } from "react";
import styled from "styled-components";
import SquareOverlay from "../template/src/assets/SquareOverlay.png";
import CoverOverlay from "../template/src/assets/CoverOverlay.png";

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  padding: 1rem 0 1rem 0;

  @media (min-width: 900px) {
    padding: 2rem;
  }
`;

const Square = styled.div`
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
  border-radius: 0.33rem;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);

  @media (max-width: 900px) {
    width: 100%;
  }

  & > div:first-child {
    top: 0%;
    bottom: 0%;
    height: 100%;
  }
`;

const Rect = styled.div`
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  padding-bottom: 52.2%;
  overflow: hidden;
  border-radius: 0.33rem;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);

  @media (max-width: 900px) {
    width: 100%;
  }

  & > div:first-child {
    right: 0%;
    left: unset;
    width: 100%;
  }
`;

const Img = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: ${(props) => `url(${props.imageSrc})`};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

const Overlay = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
`;

export default function Preview({ size, imageUrl }) {
  return (
    <Fragment>
      {size === "square" ? (
        <PreviewContainer>
          <Square>
            {imageUrl && <Img imageSrc={imageUrl} />}
            <Overlay src={SquareOverlay} />
          </Square>
        </PreviewContainer>
      ) : (
        <PreviewContainer>
          <Rect>
            {imageUrl && <Img imageSrc={imageUrl} />}
            <Overlay src={CoverOverlay} />
          </Rect>
        </PreviewContainer>
      )}
    </Fragment>
  );
}
