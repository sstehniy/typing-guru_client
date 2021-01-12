import React from "react";
import styled from "styled-components";
import { ReactComponent as RetryIcon } from "../../assets/retry-icon.svg";

type RetryButtonProps = {
  onClick: () => void;
  loading: boolean;
};

const StyledRetryButton = styled.div`
  position: absolute;
  z-index: 100;
  right: 10px;
  top: 10px;
  height: 28px;
  padding: 8px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.blue};
  border-radius: 14px;
  cursor: pointer;
  font-size: 0.9rem;
  box-shadow: ${({ theme }) => theme.box_shadow_sm};
  transition: all 0.15s ease-in-out;

  &:hover {
    box-shadow: ${({ theme }) => theme.box_shadow_st};
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.8;
    cursor: not-allowed;
  }

  & svg#retry {
    display: inline-block;
    height: 13px;
    width: 13px;
    margin-bottom: 1px;
  }
`;

const RetryButton: React.FC<RetryButtonProps> = ({ onClick, loading }) => {
  return (
    <StyledRetryButton onClick={onClick} className={loading ? "disabled" : ""}>
      <RetryIcon id="retry" />
    </StyledRetryButton>
  );
};

export default RetryButton;
