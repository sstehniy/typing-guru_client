import React from "react";
import styled from "styled-components";

type FormLabelProps = {
  children: string;
};

const StyledFormLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ theme }) => theme.black};
  text-transform: capitalize;
  padding-left: 3px;
  margin-bottom:10px !important;
`;

const FormLabel: React.FC<FormLabelProps> = ({ children: value }) => {
  return <StyledFormLabel htmlFor={value}>{value}</StyledFormLabel>;
};

export default FormLabel;
