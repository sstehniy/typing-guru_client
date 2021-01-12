export type TableCol = {
  title: string;
  icon: JSX.Element;
  objPropName: string;
  propRender?: (props: any) => any;
  size: ColumnSize;
  prior: boolean;
  defaultFilter?: boolean;
  sortHoc?: (prop: any) => any;
  filterable: boolean;
};

export type TestItem = {
  wpm: number;
  cpm: number;
  acc: number;
  user: { username: string; id: string };
  score: number;
  createdAt: string;
};

export enum ColumnSize {
  SMALL = 1,
  MIDDLE = 1.75,
  LARGE = 3,
  XXL = 4
}
