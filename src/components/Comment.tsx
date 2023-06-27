import React, {
  useEffect,
  useState,
  useRef,
  AnimationEventHandler,
} from 'react';
import './Comment.css';
const Comment = ({
  chatId,
  text,
  onAnimationEnd,
}: {
  chatId: string;
  text: string;
  onAnimationEnd: (id: string) => void;
}) => {
  console.log(`new comment chatId:${chatId} text:${text}`);

  const commentRef = useRef(null);
  const [commentStyle, setCommentStyle] = useState({});

  useEffect(() => {
    const calculateRandomHeight = () => {
      const windowHeight = window.innerHeight;
      const randomHeight = Math.floor(Math.random() * windowHeight);
      return {
        top: `${randomHeight}px`,
      };
    };

    setCommentStyle(calculateRandomHeight());
  }, []);
  useEffect(() => {
    const commentElement: HTMLElement = commentRef.current!;
    const handleAnimationEnd = () => {
      console.log('handle animation end');
      console.log(chatId);
      commentElement.style.display = 'none';
      onAnimationEnd(chatId);
    };

    commentElement.addEventListener('animationend', handleAnimationEnd);

    return () => {
      commentElement.removeEventListener('animationend', handleAnimationEnd);
    };
  });

  return (
    <div className="comment" style={commentStyle} ref={commentRef}>
      {text}
    </div>
  );
};

export default Comment;
