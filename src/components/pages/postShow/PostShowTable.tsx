import React, { FC } from "react";
import { Post, User } from "../../../types/types";
import Category from "../../atoms/Category";
import PublisherValue from "../../molecules/PublisherValue";
import TableListItem from "./TableListItem";

type Props = {
  post: Post;
  postUser: User;
};

const PostShowTable: FC<Props> = (props) => {
  const { post, postUser } = props;
  return (
    <div>
      <div className="tableListItem-margin">
        <TableListItem label={"名前"} value={post.horseName} />
      </div>

      <div className="tableListItem-margin">
        <TableListItem
          label={"カテゴリ"}
          value={<Category category={post.category} />}
        />
      </div>

      <div className="tableListItem-margin">
        <TableListItem label={"値段"} value={`${post.price}円`} />
      </div>

      <div className="tableListItem-margin">
        <TableListItem label={"品種"} value={post.breed} />
      </div>

      <div className="tableListItem-margin">
        <TableListItem label={"性別"} value={post.gender} />
      </div>

      <div className="tableListItem-margin">
        <TableListItem label={"毛色"} value={post.color} />
      </div>

      <div className="tableListItem-margin">
        <TableListItem label={"年齢"} value={`${post.age}歳`} />
      </div>

      <div className="tableListItem-margin">
        <TableListItem
          label={"生年月日"}
          value={`${post.birth?.year} / ${post.birth?.month} / ${post.birth?.day}`}
        />
      </div>

      <div className="tableListItem-margin">
        <TableListItem label={"身長"} value={`${post.height}cm`} />
      </div>
      <div className="tableListItem-margin">
        <TableListItem
          label={"特徴"}
          value={
            <div className="flex flex-wrap">
              {post.features
                ?.sort((a, b) => {
                  //逆順に並べ替え
                  if (a < b) {
                    return 1;
                  } else {
                    return -1;
                  }
                })
                .map(
                  (feature, index) =>
                    feature !== "empty" && (
                      <div key={index} className="mr-5">
                        {feature}
                      </div>
                    )
                )}
            </div>
          }
        />
      </div>

      <div className="tableListItem-margin">
        <TableListItem label={"地域"} value={post.area} />
      </div>
      <div className="tableListItem-margin">
        <TableListItem
          label={"掲載者"}
          value={<PublisherValue post={post} postUser={postUser} />}
        />
      </div>
    </div>
  );
};

export default PostShowTable;
