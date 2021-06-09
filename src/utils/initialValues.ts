export const filterInitialValues: any = {
  showOnlyAvailable: false,
  category: ["障害馬", "馬場馬", "総合馬", "レクレーション"],
  priceMin: 0,
  priceMax: 99999999999999,
  ageMin: 0,
  ageMax: 100,
  heightMin: 0,
  heightMax: 1000,
  breed: [
    "サラブレッド",
    "アラブ",
    "アングロアラブ",
    "アパルーサ",
    "アンダルシアン",
    "アングロノルマン",
    "ウェストファーレン",
    "オルデンブルグ",
    "KWPN",
    "クォーターホース",
    "クリオージョ",
    "クリーブランド・ ベイ",
    "ザンガーシェイド",
    "セルフランセ",
    "トラケナー",
    "トロッター",
    "ハクニー",
    "ハノーバー",
    "パロミノ",
    "ハンター",
    "フリージアン",
    "ペイントホース",
    "ホルスタイン",
    "モルガン",
    "リピッツァナー",
    "ウォームブラッド",
    "スポーツホース",
    "日本乗系種",
    "半血種",
    "日本在来種",
    "ポニー",
    "重種馬",
    "その他",
  ],
  color: [
    "鹿毛",
    "黒鹿毛",
    "青毛",
    "青鹿毛",
    "栗毛",
    "栃栗毛",
    "芦毛",
    "白毛",
    "その他",
  ],
  area: [
    "北海道",
    "青森県",
    "秋田県",
    "福島県",
    "岩手県",
    "山形県",
    "宮城県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "愛知県",
    "岐阜県",
    "福井県",
    "山梨県",
    "石川県",
    "新潟県",
    "富山県",
    "長野県",
    "静岡県",
    "三重県",
    "大阪府",
    "京都府",
    "兵庫県",
    "奈良県",
    "滋賀県",
    "和歌山県",
    "岡山県",
    "広島県",
    "鳥取県",
    "島根県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "大分県",
    "佐賀県",
    "長崎県",
    "宮崎県",
    "熊本県",
    "鹿児島県",
    "沖縄県",
  ],

  features: [
    "おとなしい",
    "120cm以上飛べます",
    "噛み癖なし",
    "蹴り癖なし",
    "初心者OK",
    "empty",
  ],
};

export const userInitialValues = {
  id: "",
  username: "",
  avatar: "",
  cover: "",
  profileText: "",
  good: 0,
  bad: 0,
  likePostIDs: [],
  deletedAccount: false,
};

export const postInitialValues = {
  postID: "",
  userID: "",
  username: "",
  avatar: "",
  images: [],
  title: "",
  postText: "",
  horseName: "",
  category: "",
  breed: "",
  color: "",
  birth: { year: null, month: null, day: null },
  age: null,
  height: null,
  area: "",
  features: ["empty"],
  price: null,
  createdAt: "",
  updatedAt: "",
  likeUserIDs: [],
  isAvairable: false,
  pv: null,
  sendMessageUserIDs: [],
  messageUpdatedAt: "",
  latestMessage: "",
  clientUserID: "",
  ratingCompleted: false,
  deletedAccount: false,
};

export const chatroomInitialValues = {
  sendUserID: "",
  sendUserName: "",
  sendUserAvatar: "",
  postUserID: "",
  postID: "",
  postImage: "",
  postTitle: "",
  latestMessage: "",
  messageCount: null,
  createdAt: "",
  messageUpdatedAt: "",
  deletedAccount: false,
};

export const messageInitialValues = {
  userID: "",
  username: "",
  avatar: "",
  messageReceiverID: "",
  messageReceiverName: "",
  postID: "",
  postTitle: "",
  image: "",
  messageText: "",
  createdAt: "",
  firstOnDate: false,
  clientDecision: false,
  dealInterruption: false,
  dealCompleted: false,
  pleaseRate: false,
  rateCompleted: false,
  deletedAccount: false,
};

export const reviewInitialValues = {
  postID: "",
  postUserID: "",
  postTitle: "",
  postImage: "",
  reviewerID: "",
  reviewerName: "",
  reviewerAvatar: "",
  rating: "",
  reviewText: "",
  createdAt: "",
  deletedAccount: false,
};

export const notificationInitialValues = {
  postID: "",
  postUserID: "",
  sendUserID: "",
  receiveUserID: "",
  sendMessageUserID: "",
  image: "",
  avatar: "",
  text: "",
  createdAt: "",
  checked: false,
  toMessage: false,
  toProfile: false,
  noLink: false,
}
