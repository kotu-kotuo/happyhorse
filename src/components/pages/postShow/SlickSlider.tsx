import Slider from "react-slick";
import {
  IoChevronBackCircleOutline,
  IoChevronForwardCircleOutline,
} from "react-icons/io5";

const SlickSlider = (props) => {
  const { currentUser, post, toPostEdit } = props;

  const setting1 = {
    customPaging: function (i) {
      return (
        <a>
          <img
            className="max-w-1600 w-full max-h-900 h-full"
            src={post.images[i]}
          />
        </a>
      );
    },
    dotsClass: "slick-dots",
    dots: true,
    arrows: true,
    fade: true,
    speed: 250,
    prevArrow: <IoChevronBackCircleOutline />,
    nextArrow: <IoChevronForwardCircleOutline />,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    adaptiveHeight: true,
  };

  const setting2 = {
    dots: true,
    arrows: true,
    dotsClass: "slick-dots",
    speed: 250,
    prevArrow: <IoChevronBackCircleOutline />,
    nextArrow: <IoChevronForwardCircleOutline />,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    adaptiveHeight: true,
  };

  return (
    <>
      <div className="hidden md:block">
        <Slider {...setting1}>
          {post.images.map((image, index) => (
            <div
              key={index}
              className="mt-10 outline-none pb-image w-full h-0 relative"
            >
              {currentUser &&
                currentUser.uid === post.userID &&
                post.isAvairable && (
                  <div
                    className="absolute top-3 right-4 z-50 bg-white px-3.5 py-1.5 rounded opacity-50 cursor-pointer hover:bg-mainGreen hover:text-white hover:opacity-90 ease-in-out duration-300"
                    onClick={() => toPostEdit(post)}
                  >
                    編集
                  </div>
                )}
              <img
                src={image}
                className="object-cover outline-none border-0 w-full h-full absolute"
              />
            </div>
          ))}
        </Slider>
      </div>
      <div className="block md:hidden">
        <Slider {...setting2}>
          {post.images.map((image, index) => (
            <div
              key={index}
              className="mt-10 outline-none pb-image w-full h-0 relative"
            >
              {currentUser &&
                currentUser.uid === post.userID &&
                post.isAvairable && (
                  <div
                    className="absolute top-3 right-4 z-50 bg-white px-3.5 py-1.5 rounded opacity-50 cursor-pointer hover:bg-mainGreen hover:text-white hover:opacity-90 ease-in-out duration-300"
                    onClick={() => toPostEdit(post)}
                  >
                    編集
                  </div>
                )}
              <img
                src={image}
                className="object-cover outline-none border-0 w-full h-full absolute"
              />
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default SlickSlider;