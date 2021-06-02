import Notification from "../molecules/Notification";

const NotificationList = (props) => {
  const { notifications, currentUser } = props;
  return (
    <div>
      {notifications.map((notification, index) => (
        <div key={index}>
          {notification.toMessage ? (
            <Notification
              notification={notification}
              href={{
                pathname: "/message/messages",
                query: {
                  uid: notification.postUserID,
                  pid: notification.postID,
                  cid: notification.sendMessageUserID,
                },
              }}
            />
          ) : notification.toProfile ? (
            <Notification
              notification={notification}
              href={{
                pathname: "/profile",
                query: {
                  uid: currentUser?.uid,
                },
              }}
            />
          ) : (
            <Notification
              notification={notification}
              href={{
                pathname: `/post/postShow/${notification.postID}`,
                query: {
                  pid: notification.postID,
                },
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
