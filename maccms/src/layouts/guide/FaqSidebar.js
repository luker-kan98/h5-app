
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const FaqSidebar = ({ currentElementIndexInViewport}) => {

  const { t } = useTranslation();
  const asPath = useRouter();

  return (
    <div className="doc-sidebar pt-[20px] md:pt-[65px] hidden md:flex flex-col min-w-[200px] xl:min-w-[230px] max-h-[calc(100vh-300px)]">
      <div className="flex flex-row items-center justify-between w-full">
      <label className="text-black text-[20px] font-primary">{t("guide.s13")}</label>
      <Link href={"/guide/help"}>
        <Image alt="alt" src="/images/icons/ic_back.png" width={20} height={20} />
      </Link>
      </div>
      
      <ul className="doc-menu">
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 1 && "active")}>
          <Link href={`/guide/faq#开启假墙防御后搜索页筛选页的选项参数如何高亮展示`}>{t("guide.s142")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 2 && "active")}>
          <Link href={`/guide/faq#为什么无法在线播放`}>{t("guide.s143")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 3 && "active")}>
          <Link href={`/guide/faq#上传失败常见问题`}>{t("guide.s144")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 4 && "active")}>
          <Link href={`/guide/faq#运行安装页面出现空白页面`}>{t("guide.s145")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 5 && "active")}>
          <Link href={`/guide/faq#提示_SQLSTATE_22001`}>{t("guide.s146")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 6 && "active")}>
          <Link href={`/guide/faq#数据库连接配置文件`}>{t("guide.s147")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 7 && "active")}>
          <Link href={`/guide/faq#如何重装苹果cms`}>{t("guide.s148")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 8 && "active")}>
          <Link href={`/guide/faq#采集资源为何播放不了`}>{t("guide.s149")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 9 && "active")}>
          <Link href={`/guide/faq#宝塔Nginx环境404`}>{t("guide.s150")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 10 && "active")}>
          <Link href={`/guide/faq#采集完数据后为何无法播放`}>{t("guide.s151")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 11 && "active")}>
          <Link href={`/guide/faq#为何新增加了分类，前台页面进入提示没有权限`}>{t("guide.s152")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 12 && "active")}>
          <Link href={`/guide/faq#改乱了怎么办`}>{t("guide.s153")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 13 && "active")}>
          <Link href={`/guide/faq#nginx下除了首页其他都是404怎么办`}>{t("guide.s154")}</Link>
        </li>
        <li className={clsx("doc-menu-item group", currentElementIndexInViewport == 14 && "active")}>
          <Link href={`/guide/faq#页面提交数据后过段时间才生效`}>{t("guide.s155")}</Link>
        </li>
      </ul>
    </div>
  );
}

export default FaqSidebar;