export const setPostStates = (data) => {
  if (data)
    return {
      postID: data.postID,
      userID: data.userID,
      username: data.username,
      avatar: data.avatar,
      images: data.images,
      title: data.title,
      postText: data.postText,
      video1URL: data.video1URL,
      video1Title: data.video1Title,
      video2URL: data.video2URL,
      video2Title: data.video2Title,
      video3URL: data.video3URL,
      video3Title: data.video3Title,
      horseName: data.horseName,
      category: data.category,
      breed: data.breed,
      gender: data.gender,
      color: data.color,
      birth: {
        year: data.birth.year,
        month: data.birth.month,
        day: data.birth.day,
      },
      height: data.height,
      area: data.area,
      features: data.features,
      price: data.price,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      likeUserIDs: data.likeUserIDs,
      isAvairable: data.isAvairable,
      pv: data.pv,
      sendMessageUserIDs: data.sendMessageUserIDs,
      messageUpdatedAt: data.messageUpdatedAt,
      latestMessage: data.latestMessage,
      clientUserID: data.clientUserID,
      ratingCompleted: data.ratingCompleted,
      deletedAccount: data.deletedAccount,
    };
};

export const setChatroomStates = (data) => ({
  sendUserID: data.sendUserID,
  sendUserName: data.sendUserName,
  sendUserAvatar: data.sendUserAvatar,
  postUserID: data.postUserID,
  postID: data.postID,
  postImage: data.postImage,
  postTitle: data.postTitle,
  latestMessage: data.latestMessage,
  messageCount: data.messageCount,
  createdAt: data.createdAt,
  messageUpdatedAt: data.messageUpdatedAt,
  deletedAccount: data.deletedAccount,
});

export const setMessageStates = (data) => ({
  userID: data.userID,
  username: data.username,
  avatar: data.avatar,
  messageReceiverID: data.messageReceiverID,
  messageReceiverName: data.messageReceiverName,
  postID: data.postID,
  postTitle: data.postTitle,
  image: data.image,
  messageText: data.messageText,
  createdAt: data.createdAt,
  firstOnDate: data.firstOnDate,
  clientDecision: data.clientDecision,
  dealInterruption: data.dealInterruption,
  dealCompleted: data.dealCompleted,
  pleaseRate: data.pleaseRate,
  rateCompleted: data.rateCompleted,
  deletedAccount: data.deletedAccount,
});

export const setReviewStates = (data) => ({
  postID: data.postID,
  postUserID: data.postUserID,
  postTitle: data.postTitle,
  postImage: data.postImage,
  reviewerID: data.reviewerID,
  reviewerName: data.reviewerName,
  reviewerAvatar: data.reviewerAvatar,
  receiverID: data.receiverID,
  rating: data.rating,
  reviewText: data.reviewText,
  createdAt: data.createdAt,
  deletedAccount: data.deletedAccount,
});

export const setNotificationStates = (data) => ({
  postID: data.postID,
  postUserID: data.postUserID,
  sendUserID: data.sendUserID,
  receiveUserID: data.receiveUserID,
  sendMessageUserID: data.sendMessageUserID,
  image: data.image,
  avatar: data.avatar,
  text: data.text,
  createdAt: data.createdAt,
  checked: data.checked,
  toMessage: data.toMessage,
  toProfile: data.toProfile,
  noLink: data.noLink,
});

export const setUserState = (data) => {
  if (data)
    return {
      id: data.id,
      username: data.username,
      avatar: data.avatar,
      cover: data.cover,
      profileText: data.profileText,
      good: data.good,
      bad: data.bad,
      likePostIDs: data.likePostIDs,
      deletedAccount: data.deletedAccount,
    };
};
