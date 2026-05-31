import { memo, useCallback } from 'react';
import PropTypes from "prop-types";

const Button = memo(({ className="" }) => {

  const onStartNowTextClick = useCallback((e) => {
   // Call API login
  }, []);

  return (
    <div className={`relative text-14xl leading-[16px] font-elsie-swash-caps text-dodgerblue text-left cursor-pointer z-[1] ${className}`} onClick={onStartNowTextClick}>Start Now</div>);
});

Button.propTypes = {
  className: PropTypes.string
};

export default Button;
