import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

type TooltipContainerProps = {
  text: string;
  render: (ref: any) => React.ReactNode;
  position: "bottom" | "top" | "left" | "right";
  style?: React.CSSProperties;
};

const StyledTooltipContainer = styled.div`
  position: relative;
`;

const TooltipContainer: React.FC<TooltipContainerProps> = ({
  text,
  render,
  position = "bottom",
  style = {}
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const parentRef = useRef<any>(null);

  useEffect(() => {
    if (!parentRef.current) return;

    const handleMouseOver = () => {
      setShowTooltip(true);
    };
    const handleMouseLeave = () => {
      setShowTooltip(false);
    };

    parentRef.current.addEventListener("click", handleMouseLeave);
    parentRef.current.addEventListener("mouseover", handleMouseOver);
    parentRef.current.addEventListener("mouseleave", handleMouseLeave);

    // eslint-disable-next-line
    return () => {
      parentRef.current?.removeEventListener("click", handleMouseLeave); // eslint-disable-line
      parentRef.current?.removeEventListener("mouseover", handleMouseOver); // eslint-disable-line
      parentRef.current?.removeEventListener("mouseleave", handleMouseLeave); // eslint-disable-line
    };
  }, [parentRef]);

  return (
    <StyledTooltipContainer style={{ ...style }}>
      {render(parentRef)}
      {showTooltip && <Tooltip text={text} position={position} />}
    </StyledTooltipContainer>
  );
};

type TooltipProps = Pick<TooltipContainerProps, "text" | "position">;

const StyledTooltip = styled.div<{ height: number | null; width: number | null }>`
  position: absolute;
  padding: 5px 8px;
  opacity: 0;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s forwards 0.2s ease-in-out;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  & span {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.main_bg};
  }

  &.position-left {
    left: calc(100% + 7px);
    top: 50%;
    transform: translateY(-50%);
  }
  &.position-right {
    right: calc(100% + 7px);
    top: 50%;
    transform: translateY(-50%);
  }

  &.position-top {
    left: 50%;
    top: -7px;
    transform: translateX(-50%);
  }

  &.position-bottom {
    left: 50%;
    top: calc(100% + 7px);
    transform: translateX(-50%);

    &:before {
      content: "";
      position: absolute;
      top: -3px;
      left: 50%;
      transform: translateX(calc(-50% + 1px)) rotate(-45deg);
      z-index: -10;
      background-color: rgba(0, 0, 0, 0.9);
      height: 12px;
      width: 12px;
    }
  }
`;

const Tooltip = ({ text, position }: TooltipProps) => {
  const [height, setHeight] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    setHeight(ref.current.getBoundingClientRect().height);
    setWidth(ref.current.getBoundingClientRect().width);
  }, [ref]);

  return (
    <StyledTooltip
      height={height}
      width={width}
      className={`position-${position}`}
      ref={ref}
    >
      <span>{text}</span>
    </StyledTooltip>
  );
};

export default TooltipContainer;
