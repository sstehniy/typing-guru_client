import React from "react";
import styled from "styled-components";
import { TestItem } from "../../../types";

type TableRowProps = {
  cells: { prop: string; propRender?: (props: any) => JSX.Element; size: number }[];
  item: TestItem;
};

const StyledTableRow = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: rgb(230, 230, 230);
`;

const StyledCell = styled.div<{ flex: number; withBorder: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: ${({ flex }) => flex};
`;

const TableRow = ({ cells, item }: TableRowProps) => {
  return (
    <StyledTableRow>
      {cells.map((cell, idx) => (
        <StyledCell key={idx} flex={cell.size} withBorder={idx !== cells.length - 1}>
          {cell.prop in item
            ? cell.propRender
              ? // @ts-ignore
                cell.propRender(item[cell.prop])
              : // @ts-ignore
                item[cell.prop]
            : null}
        </StyledCell>
      ))}
    </StyledTableRow>
  );
};

export default TableRow;
