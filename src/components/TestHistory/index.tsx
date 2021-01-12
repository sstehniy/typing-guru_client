/* eslint-disable consistent-return */
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useAuthContext } from "../../context/userContext";
import { useFetchData } from "../../hooks/useFetchResource";
import { ColumnSize, TableCol, TestItem } from "../../types";
import ResultTable from "../Shared/ResultsTable";
import Rating from "../Rating";
import { ReactComponent as DateIcon } from "../../assets/calendar.svg";
import { ReactComponent as SpeedIcon } from "../../assets/fast.svg";
import { ReactComponent as AccuracyIcon } from "../../assets/seo-and-web.svg";
import { ReactComponent as ScoreIcon } from "../../assets/ranking.svg";
import Chart from "../Shared/Chart";

const StyledTestHistory = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  margin-top: 25px;
`;

const TestHistory = () => {
  const { user } = useAuthContext();
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const history = useHistory();
  const { loading, data: tests, error } = useFetchData<TestItem>(
    user ? `/api/tests/user/${user.id}` : "",
    null
  );
  const [chartYAxis, setChartYAxis] = useState<"wpm" | "cpm" | "acc">("acc");

  useEffect(() => {
    if (user && location.pathname === "/history") {
      history.replace(`/history/${user.username}`);
    } else if (!user) {
      history.replace("/history");
    }
  }, [history, location.pathname, user]);

  const columns: TableCol[] = [
    {
      title: "Score",
      icon: <ScoreIcon />,
      objPropName: "score",
      propRender: (score: number) => (
        <Rating
          animated={false}
          rating={score as 1 | 2 | 3}
          size={{ height: 25, width: 25 }}
        />
      ),
      size: ColumnSize.SMALL,
      prior: true,
      filterable: true
    },
    {
      title: "Date",
      icon: <DateIcon />,
      objPropName: "createdAt",
      propRender: (date: string) =>
        new Intl.DateTimeFormat("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }).format(new Date(date)),
      size: ColumnSize.MIDDLE,
      prior: false,
      defaultFilter: true,
      sortHoc: (date: string) => new Date(date),
      filterable: true
    },
    {
      title: "WPM",
      icon: <SpeedIcon />,
      objPropName: "wpm",
      size: ColumnSize.SMALL,
      prior: true,
      filterable: true
    },
    {
      title: "CPM",
      icon: <SpeedIcon />,
      objPropName: "cpm",
      size: ColumnSize.SMALL,
      prior: false,
      filterable: true
    },
    {
      title: "ACC",
      icon: <AccuracyIcon />,
      objPropName: "acc",
      size: ColumnSize.SMALL,
      prior: false,
      filterable: true
    }
  ];

  const config = useMemo(() => {
    if (!tests.length) return;
    const date = new Date();
    const labelDates = [0, 1, 2, 3, 4, 5]
      .map((_, idx) => {
        if (idx === 0) {
          return new Intl.DateTimeFormat("en-GB", {
            month: "long",
            year: "numeric"
          }).format(date);
        }
        date.setMonth(date.getMonth() - 1);
        return new Intl.DateTimeFormat("en-GB", {
          month: "long",
          year: "numeric"
        }).format(date);
      })
      .reverse();
    const scoreData: number[] = labelDates.map((month, idx, arr) => {
      const avgScore = +tests
        .filter(
          t =>
            new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(
              new Date(t.createdAt)
            ) === month
        )
        .reduce((acc, curr, i) => (acc + curr[chartYAxis]) / (i + 1), 0)
        .toFixed();
      return avgScore;
    });

    return {
      labels: labelDates.map(d => d.split(" ")[0]),
      datasets: [
        {
          label: chartYAxis as string,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data: scoreData
        }
      ]
    };
  }, [chartYAxis, tests]);

  return (
    <StyledTestHistory>
      {(!user || !username) && (
        <p style={{ fontSize: "calc(16px + 1vw)" }}>
          Please signup/login to see your test history
        </p>
      )}
      {!!loading && <p>Loading test history...</p>}
      {!!error && (
        <p style={{ fontSize: "calc(16px + 1vw)" }}>
          Error while fetching test history 😟
        </p>
      )}
      {!!(!loading && tests.length && user) && (
        <>
          <p style={{ fontSize: "calc(16px + 1vw)", marginTop: 20, marginBottom: 40 }}>
            <strong>@{user.username}</strong> typing tests history
          </p>
          {config && <Chart config={config} />}
          <ResultTable items={tests} columns={columns} />
        </>
      )}
    </StyledTestHistory>
  );
};

export default TestHistory;
