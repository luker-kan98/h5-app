import Image from "next/image";

export default function Loading () {
    return(
        <div className="relative w-[calc(100vw-18px)] h-[100vh] z-100">
          {/* top-right */}
          <div className="absolute w-full md:h-[60.7%] aspect-[1.113] md:aspect-[1.402] top-0 right-0 bg-contain bg-no-repeat bg-right-top bg-[url('/images/v2/loading/bg_1.png')] md:bg-[url('/images/v2/loading/md/bg_1.png')]" />
          <div className="absolute w-full md:h-[74.5%] aspect-[1.106] md:aspect-[1.24] bottom-0 left-0 bg-contain bg-no-repeat bg-left-bottom bg-[url('/images/v2/loading/bg_2.png')] md:bg-[url('/images/v2/loading/md/bg_2.png')]" />
          <div className="w-full h-full flex items-center justify-center ">
          <Image
            alt="loading"
            src="/images/v2/loading-glasses.png"
            width={300}
            height={180}
            className="loading-glass"
          />
          </div>
        </div>
    );
}