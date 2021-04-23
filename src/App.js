import React, { useEffect, Fragment } from "react";
import { useAppState } from "./providers/appState";
import { isMobile } from "react-device-detect";
import axios from "axios";
import update from "immutability-helper";
import styled from "styled-components";

import "@patternfly/react-core/dist/styles/base.css";
import { Button, Title } from "@patternfly/react-core";

import PhotosUploader from "./components/imageUpload";
import PreviewContainer from "./components/previewContainer";

const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const InnerContainer = styled.div`
  width: 100%;

  @media (min-width: 1280px) {
    width: 1280px;
  }
`;

const Wrapper = styled.div`
  background-color: #ededed;
  width: 100%;
  padding: 2rem 3rem 2rem 3rem;
  position: relative;
  overflow: hidden;
  border-radius: 0;
  height: 90vh;
  display: flex;

  @media (min-width: 500px) {
    padding: 2rem 8rem 2rem 8rem;
  }

  @media (min-width: 700px) {
    padding: 2rem 13rem 2rem 13rem;
    height: 75vh;
  }

  @media (min-width: 900px) {
    padding: 2rem;
    height: auto;
  }

  @media (min-width: 1200px) {
    padding: 2rem;
  }
`;

const OverlaySection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) =>
    props.imageUrl ? "transparent" : "rgba(210, 210, 210, 0.8)"};
  z-index: 1;
  pointer-events: ${(props) => (props.imageUrl ? "none" : "all")};
`;

const Header = styled.header`
  margin-bottom: 1.5rem;
  margin-left: 1.5rem;
  margin-top: 1.5rem;
`;

const StartAgainButton = styled(Button)`
  font-size: 1rem;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  margin: 1rem;
  opacity: 0.4;

  @media (min-width: 900px) {
    margin: 2rem;
    top: 0;
    bottom: initial;
  }
`;

function App() {
  const {
    imageUrl,
    setImageUrl,
    setProgress,
    setIsGenerating,
    setGeneratedAvatars,
  } = useAppState();

  const imagePosition = (size, url) => {
    const pathnameArray = new URL(url).href.split("/");
    const uploadPath = pathnameArray[5];

    const transformations =
      size === "square"
        ? "/c_crop,g_faces,h_691,w_1320"
        : "/w_1200,h_1200,c_thumb,g_face/w_1200";

    const newPathArray = update(pathnameArray, {
      5: { $set: uploadPath + transformations },
    });

    return newPathArray.join("/");
  };

  const startAgain = () => {
    setImageUrl(null);
    setProgress(null);
    setGeneratedAvatars(null);
  };

  useEffect(() => {
    if (imageUrl !== null) {
      const generateAvatar = () => {
        setIsGenerating(true);

        const reqUrl =
          "https://api.make.cm/make/t/2ea51661-0fc5-4baf-9298-cc420ec7b4aa/sync";

        const headers = {
          'Content-Type': 'application/json',
          'X-MAKE-API-KEY': '075ccd51938692039b7295922117ca5fc49ebf0c'
        }

        const rectData = {
          customSize: {
            width: 1320,
            height: 691,
            unit: "px"
          },
          format: "png",
          fileName: "rectangle",
          contentDisposition: isMobile ? "inline" : "attachment",
          data: {
            avatar: imagePosition("rect", imageUrl),
          }
        };

        const squareData = {
          customSize: {
            width: 1200,
            height: 1200,
            unit: "px"
          },
          format: "png",
          fileName: "square",
          contentDisposition: isMobile ? "inline" : "attachment",
          data: {
            avatar: imagePosition("square", imageUrl),
          }
        };

        const rectRequest = (data, url, headers) => {
          return axios.post(url, data, {
            headers: headers
          });
        };

        const squareRequest = (data, url, headers) => {
          return axios.post(url, data, {
            headers: headers
          });
        };

        axios
          .all([
            rectRequest(rectData, reqUrl, headers),
            squareRequest(squareData, reqUrl, headers),
          ])
          .then((response) => {
            console.log(response)
            const generatedAvatars = {
              rect: response[0].data.resultUrl,
              square: response[1].data.resultUrl,
            };
            setGeneratedAvatars(generatedAvatars);
            setIsGenerating(false);
          })
          .catch((error) => {
            console.log(error);
            setIsGenerating(false);
          });
      };
      generateAvatar();
    }
  }, [imageUrl, setGeneratedAvatars, setIsGenerating]);

  return (
    <Fragment>
      <Container className="pf-m-redhat-font">
        <InnerContainer>
          <Header>
            <Title headingLevel="h2" size="3xl">
              Create your own
            </Title>
          </Header>

          <Wrapper>
            <OverlaySection imageUrl={imageUrl}>
              <PhotosUploader label="Upload your Photo" />
            </OverlaySection>

            <PreviewContainer imagePosition={imagePosition} />

            {imageUrl && (
              <StartAgainButton
                variant="tertiary"
                onClick={function () {
                  startAgain();
                }}>
                Try Again
              </StartAgainButton>
            )}
          </Wrapper>
        </InnerContainer>
      </Container>
    </Fragment>
  );
}

export default App;
