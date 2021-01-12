import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import styled from "styled-components";
import { TableCol } from "../../../types";
import TableRow from "./TableRow";
import { ReactComponent as AscIcon } from "../../../assets/ascending-sort.svg";
import { ReactComponent as DescIcon } from "../../../assets/descending-sort.svg";
import { ReactComponent as FilterIcon } from "../../../assets/big-funnel.svg";

type ResultTableProps = {
  items: any[];
  columns: TableCol[];
};

const StyledResultTable = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 55%;
  min-width: 400px;
  max-width: 1200px;
`;

const StyledTableHead = styled.div`
  width: 100%;
  height: 50px;
  padding: 0 5px;
  display: flex;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.box_shadow_sm};
  background-color: rgb(230, 230, 230);
  margin-bottom: 25px;
`;

const StyledTableHeaderCell = styled.div<{ flex: number; withBorder: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: ${({ flex }) => flex};
  letter-spacing: 1px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;

  & > svg {
    position: absolute;
    top: 52%;
    transform: translateY(-50%);
    right: 5%;
    width: 14px;
    height: auto;
  }
`;

const StyledTableBody = styled.div`
  width: 100%;
  max-height: 700px;
`;

const IconWrapper = styled.span`
  & > svg {
    width: 23px;
    height: auto;
    margin-top: 3px;
    margin-right: 10px;
  }
`;

const ResultTable = ({ items, columns }: ResultTableProps) => {
  const [filterProp, setFilterProp] = useState<{
    value: string;
    order: "asc" | "desc" | "default" | null;
  }>({ value: "", order: null });
  const [colRefs, setColRefs] = useState<HTMLDivElement[]>([]);
  const [colToFilter, setColToFilter] = useState<{
    prop: string;
    order: "asc" | "desc" | "default" | null;
  } | null>(null);
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current === true && columns.length) {
      columns.forEach(col => {
        if (col.defaultFilter) {
          setFilterProp({ value: col.objPropName, order: "desc" });
          initialRender.current = false;
        }
      });
    }
  }, [columns, initialRender]);

  useEffect(() => {
    if (!colRefs.length) return;
    const handleColMouseEnter = (e: MouseEvent) => {
      e.stopPropagation();
      if (!(e.target instanceof HTMLDivElement)) return;
      const { prop } = e.target.dataset;
      if (!prop) return;
      if (prop === filterProp.value) {
        setColToFilter({
          prop,
          order:
            filterProp.order === "asc"
              ? "desc"
              : filterProp.order === "desc"
              ? "asc"
              : null
        });
      } else setColToFilter({ prop, order: "default" });
    };
    const handleColMouseLeave = () => {
      setColToFilter(null);
    };
    colRefs.forEach(node => {
      node.addEventListener("mouseenter", handleColMouseEnter);
      node.addEventListener("mouseleave", handleColMouseLeave);
    });
    // eslint-disable-next-line consistent-return
    return () => {
      colRefs.forEach(node => {
        node.removeEventListener("mouseenter", handleColMouseEnter);
        node.removeEventListener("mouseleave", handleColMouseLeave);
      });
    };
  }, [colRefs, filterProp.order, filterProp.value]);

  const setRef = useCallback((node: HTMLDivElement) => {
    setColRefs(prev => [...prev, node]);
  }, []);

  const changeFilter = (prop: string) => {
    if (prop === filterProp.value) {
      switch (filterProp.order) {
        case "asc":
          setFilterProp({ ...filterProp, order: "desc" });
          break;
        case "desc":
          setFilterProp({ ...filterProp, order: "asc" });
          break;
        default:
          setFilterProp({ ...filterProp, order: "desc" });
      }
    } else {
      const foundColumn = columns.find(col => col.objPropName === prop && col.filterable);
      if (foundColumn && foundColumn.filterable) {
        setFilterProp({ value: prop, order: "desc" });
      }
    }
  };

  const rowCells = columns.reduce(
    (
      acc: { prop: string; propRender?: (props: any) => JSX.Element; size: number }[],
      curr
    ) => {
      return curr.propRender
        ? [
            ...acc,
            {
              prop: curr.objPropName,
              size: curr.size,
              propRender: curr.propRender
            }
          ]
        : [
            ...acc,
            {
              prop: curr.objPropName,
              size: curr.size
            }
          ];
    },
    []
  );

  const filteredItems = useMemo(
    () =>
      items.sort((a, b) => {
        if (filterProp.value !== "" && filterProp.value in a && filterProp.value in b) {
          const colWithSortHoc = columns.find(
            c => c.objPropName === filterProp.value && c.filterable && c.sortHoc
          );
          if (filterProp.order === "asc") {
            if (colWithSortHoc && colWithSortHoc.sortHoc) {
              return (
                colWithSortHoc.sortHoc(a[filterProp.value]) -
                colWithSortHoc.sortHoc(b[filterProp.value])
              );
            }
            return a[filterProp.value] - b[filterProp.value];
          }
          if (filterProp.order === "desc") {
            if (colWithSortHoc && colWithSortHoc.sortHoc) {
              return (
                colWithSortHoc.sortHoc(b[filterProp.value]) -
                colWithSortHoc.sortHoc(a[filterProp.value])
              );
            }
            return b[filterProp.value] - a[filterProp.value];
          }
          return 0;
        }
        return 0;
      }),
    [items, filterProp.value, filterProp.order, columns]
  );

  return (
    <StyledResultTable>
      <StyledTableHead>
        {columns.map((col, i) => (
          <StyledTableHeaderCell
            key={i}
            ref={setRef}
            data-prop={col.objPropName}
            flex={col.size}
            className={colToFilter?.prop === col.objPropName ? "hovered" : ""}
            withBorder={i !== columns.length - 1}
            onClick={() => changeFilter(col.objPropName)}
          >
            {col.icon ? <IconWrapper>{col.icon}</IconWrapper> : null}
            <span>{col.title}</span>
            {col.filterable && colToFilter?.prop === col.objPropName ? (
              colToFilter.order === "asc" ? (
                <DescIcon />
              ) : colToFilter.order === "desc" ? (
                <AscIcon />
              ) : colToFilter.order === "default" ? (
                <FilterIcon />
              ) : null
            ) : col.filterable && filterProp.value === col.objPropName ? (
              filterProp.order === "asc" ? (
                <DescIcon />
              ) : (
                <AscIcon />
              )
            ) : null}
          </StyledTableHeaderCell>
        ))}
      </StyledTableHead>
      <StyledTableBody>
        {filteredItems.map((item, idx) => (
          <TableRow key={idx} item={item} cells={rowCells} />
        ))}
      </StyledTableBody>
    </StyledResultTable>
  );
};

export default ResultTable;
