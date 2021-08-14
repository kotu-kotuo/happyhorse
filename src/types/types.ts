export type User = {
  id: string;
  username: string;
  avatar: string;
  cover: string;
  profileText: string;
  good?: number;
  bad?: number;
  likePostIDs?: string[];
  deletedAccount: boolean;
};

export type Post = {
  postID: string;
  userID: string;
  username: string;
  avatar: string;
  images: Array<string>;
  title: string;
  postText: string;
  video1URL?: string;
  video1Title?: string;
  video2URL?: string;
  video2Title?: string;
  video3URL?: string;
  video3Title?: string;
  horseName: string;
  category: string;
  breed: string;
  gender: string;
  color: string;
  birth: { year: number; month: number; day: number };
  height: number;
  area: string;
  features: Array<string>;
  price: number;
  createdAt: string | any;
  updatedAt?: string | any;
  likeUserIDs: Array<string>;
  isAvairable: boolean;
  pv: number;
  sendMessageUserIDs?: Array<string>;
  messageUpdatedAt?: string;
  latestMessage?: string;
  clientUserID?: string;
  ratingCompleted: boolean;
  deletedAccount: boolean;
};

export type Chatroom = {
  sendUserID: string;
  sendUserName: string;
  sendUserAvatar: string;
  postUserID: string;
  postID: string;
  postImage: string;
  postTitle: string;
  latestMessage: string;
  messageCount: number;
  createdAt: string | any;
  messageUpdatedAt: string | any;
  deletedAccount: boolean;
};

export type Message = {
  userID: string;
  username: string;
  avatar: string;
  messageReceiverID: string;
  messageReceiverName: string;
  postID: string;
  postTitle: string;
  image: string;
  messageText: string;
  createdAt: string | any;
  firstOnDate: boolean;
  clientDecision: boolean;
  dealInterruption: boolean;
  dealCompleted: boolean;
  pleaseRate: boolean;
  rateCompleted: boolean;
  deletedAccount: boolean;
};

export type Review = {
  postID: string;
  postUserID: string;
  postTitle: string;
  postImage: string;
  reviewerID: string;
  reviewerName: string;
  reviewerAvatar: string;
  receiverID: string;
  rating: string;
  reviewText: string;
  createdAt: string | any;
  deletedAccount: boolean;
};

export type Notification = {
  postID: string;
  postUserID: string;
  sendUserID: string;
  receiveUserID: string;
  sendMessageUserID: string;
  image: string;
  avatar: string;
  text: string;
  createdAt: string | any;
  checked: boolean;
  toMessage: boolean;
  toProfile: boolean;
  noLink: boolean;
};
