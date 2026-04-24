import Link from "next/link";
import Image from "next/image";

export const Ads = () => {
  return (
    <div className="mt-[50px] md:mt-[90px] w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[10px] md:gap-[20px]">
      <Link href={"https://cdn1.com/"} target={"_blank"}>
        <div className="w-full rounded-[10px] h-[55px] md:h-[90px] bg-[#f2f2f2] overflow-clip">
          <Image
            alt="cdn1"
            src="/images/ads/cdn1.com.gif"
            width={270}
            height={90}
            className={"w-full h-full"}
          />
        </div>
      </Link>
      <Link href={"https://histat.com"} target={"_blank"}>
        <div className="w-full rounded-[10px] h-[55px] md:h-[90px] bg-[#f2f2f2] overflow-clip">
          <Image
            alt="histat"
            src="/images/ads/www.histat.com.gif"
            width={270}
            height={80}
            className={"w-full h-full"}
          />
        </div>
      </Link>
      <Link href={"https://www.appvue.net"} target={"_blank"}>
        <div className="w-full rounded-[10px] h-[55px] md:h-[90px] bg-[#f2f2f2] overflow-clip">
          <Image
            alt="appvue"
            src="/images/ads/itdog_270x80.gif"
            width={270}
            height={80}
            className={"w-full h-full"}
          />
        </div>
      </Link>
      <Link href={"https://cloudie.hk/"} target={"_blank"}>
        <div className="w-full rounded-[10px] h-[55px] md:h-[90px] bg-[#f2f2f2] overflow-clip">
          <Image
            alt="cloudie"
            src="/images/ads/cloudie.hk.gif"
            width={270}
            height={90}
            className={"w-full h-full"}
          />
        </div>
      </Link>
      <Link href={"https://cdn1.ai/"} target={"_blank"}>
        <div className="w-full rounded-[10px] h-[55px] md:h-[90px] bg-[#f2f2f2] overflow-clip">
          <Image
            alt="cdn1"
            src="/images/ads/cdn1.ai.gif"
            width={270}
            height={90}
            className={"w-full h-full"}
          />
        </div>
      </Link>
      <Link href={"https://kuaidun.ai/"} target={"_blank"}>
        <div className="w-full rounded-[10px] h-[55px] md:h-[90px] bg-[#f2f2f2] overflow-clip">
          <Image
            alt="Kuaidun"
            src="/images/ads/kuaidun.ai.gif"
            width={270}
            height={90}
            className={"w-full h-full"}
          />
        </div>
      </Link>
      <Link href={"https://yunray.ai/"} target={"_blank"}>
        <div className="w-full rounded-[10px] h-[55px] md:h-[90px] bg-[#f2f2f2] overflow-clip">
          <Image
            alt="Yunray"
            src="/images/ads/yunray.ai.gif"
            width={270}
            height={90}
            className={"w-full h-full"}
          />
        </div>
      </Link>
      <Link href={"https://gostat.com/?maccms"} target={"_blank"}>
        <div className="w-full rounded-[10px] h-[55px] md:h-[90px] bg-[#f2f2f2] overflow-clip">
          <Image
            alt="Maccms"
            src="/images/ads/gostat.gif"
            width={270}
            height={80}
            className={"w-full h-full"}
          />
        </div>
      </Link>
      <Link href={"https://cdn.cloud"} target={"_blank"}>
        <div className="w-full rounded-[10px] h-[55px] md:h-[90px] bg-[#f2f2f2] overflow-clip">
          <Image
            alt="Cdn.cloud"
            src="/images/ads/cdn.cloud.gif"
            width={270}
            height={80}
            className={"w-full h-full"}
          />
        </div>
      </Link>
    </div>
  );
};
