import React from "react";
import styled, { keyframes } from "styled-components";
import { useAppState } from "../providers/appState";
import { ReactComponent as Tick } from "../assets/tick.svg";
import { Spinner, Text, TextVariants } from "@patternfly/react-core";

const TickIcon = styled(Tick)`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const FadeOutText = styled(Text)`
  animation: 0.5s ${fadeOut} ease-out 3s forwards;
`;

export default function GeneratingTag() {
  const { isGenerating } = useAppState();

  if (isGenerating === true) {
    return (
      <Text
        component={TextVariants.p}
        style={{ opacity: "0.6", paddingRight: "2rem" }}>
        <Spinner
          size="md"
          style={{
            marginRight: "0.5rem",
            marginTop: "-0.3rem",
            verticalAlign: "middle",
            "--pf-c-spinner--Color": "rgb(21,21,21)",
          }}
        />
        Generating
      </Text>
    );
  } else {
    return (
      <FadeOutText
        component={TextVariants.p}
        style={{
          opacity: "1",
          paddingRight: "2rem",
          display: "flex",
          alignItems: "center",
          marginBottom: "var(--pf-c-content--MarginBottom)",
          color: "var(--pf-global--primary-color--100)",
        }}>
        <TickIcon />
        Generated
      </FadeOutText>
    );
  }
}
