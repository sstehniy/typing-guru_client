import React from "react";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import Notification from "../../components/Shared/UI/Notification";

const StyledNotifications = styled.div`
  position: fixed;
  top: 100px;

  z-index: 1000;
  left: 0px;
`;
const Notifications = () => {
  const notifications = useSelector(({ ui }) => ui.notifications);
  return (
    <StyledNotifications>
      {notifications.length
        ? notifications.map(n => (
            <Notification
              key={n.id}
              id={n.id}
              header={n.header}
              body={n.body}
            />
          ))
        : null}
    </StyledNotifications>
  );
};

export default Notifications;
