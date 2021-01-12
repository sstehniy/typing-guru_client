import styled, { css } from "styled-components";

export const Button = styled.button<{
  primary?: boolean;
  secondary?: boolean;
  danger?: boolean;
}>`
  border-radius: 7px;
  margin: 10px;
  padding: 5px 10px;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: 600;
  outline: none;
  border-width: 1px;
  border-style: solid;
  background-color: transparent;
  transition: background-color 0.3s ease, color 0.2s ease;

  ${({ primary }) =>
    primary &&
    css`
      color: ${({ theme }) => theme.green};
      border-color: ${({ theme }) => theme.green};
      &:hover {
        background-color: ${({ theme }) => theme.green};
        color: ${({ theme }) => theme.black};
      }
    `}
  ${({ danger }) =>
    danger &&
    css`
      color: ${({ theme }) => theme.lightpink};
      border-color: ${({ theme }) => theme.lightpink};
      &:hover {
        background-color: ${({ theme }) => theme.lightpink};
        color: ${({ theme }) => theme.black};
      }
    `}
`;
