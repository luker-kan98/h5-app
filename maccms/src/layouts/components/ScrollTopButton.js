import clsx from "clsx";
import {useEffect, useState} from "react";
import Image from "next/image";

const ScrollTopButton = () => {

  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return(
    <div onClick={scrollToTop} className={clsx("scroll-top", !isVisible && "bottom-[-60px] opacity-0", isVisible && "bottom-[30px] opacity-100")}>
      <Image src={"/images/icons/ic_scrolltop.png"} alt={"Scroll Top"} width={20} height={20} />
    </div>
  );
}

export default ScrollTopButton;