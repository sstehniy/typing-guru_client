import React from "react";
import styled from "styled-components";

type BackdropProps = {
  render: () => React.ReactNode;
  inProp: boolean;
  onClickOutside: () => void;
  className?: string;
  style?: Object;
};

const StyledBackdrop = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 100vh;
  top: -100%;
  opacity: 0.5;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.7);
  animation: dropAnimation 0.5s forwards ease;

  @keyframes dropAnimation {
    from {
      opacity: 0.5;
      top: -100%;
    }
    to {
      opacity: 1;
      top: 0%;
    }
  }
`;
const Backdrop = ({
  render,
  inProp,
  onClickOutside,
  className = "",
  style = {},
}: BackdropProps) => {
  const handleClickOutside = (e: any) => {
    if (e.target.id === "backdrop") onClickOutside();
  };

  return inProp ? (
    <StyledBackdrop id="backdrop" onClick={handleClickOutside} className={className} style={style}>
      {render && render()}
    </StyledBackdrop>
  ) : null
};

export default Backdrop;
