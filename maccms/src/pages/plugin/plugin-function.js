import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
import Sidebar from "@/layouts/plugin/Sidebar";
import PluginLayout from "@/layouts/plugin/PluginLayout";
import CodeLineNumbers from "@/layouts/components/CodeLineNumbers";
import InlineCode from "@/layouts/components/InlineCode";

export default function DocPage() {

  const { t } = useTranslation();
  const router = useRouter();

  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  

  return (
    <PluginLayout title={`${t('plugin.s26')} | ${t('seo.t.t0')}`} mobile_title={t("menu.plugin")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
              <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
                {/* Desktop sidebar */}
                <div
                    className={'doc-sidebar h-full overflow-y-auto pt-[20px] md:pt-[65px] hidden md:flex flex-col min-w-[200px] xl:min-w-[230px]'}>
                  <Sidebar currentElementIndexInViewport={currentElementIndexInViewport}/>
                </div>
                {/* Content */}
                <article className="doc pt-[10px] md:pt-[35px] grow">
                  <div ref={sectionRefs[0]} className="w-full">
                    <h2>{t("plugin.s26")}</h2>
                    <p>{t("plugin.s122")}</p>
                  </div>
                  <div id={'addon_url'} ref={sectionRefs[1]} className={'w-full'}>
                    <h3>{`addon_url`}</h3>
                    <p>{t('plugin.s123')}</p>
                    <h4>{t('plugin.s124')}</h4>
                    <p>{t('plugin.s125')}</p>
                    <h4>{t('plugin.s126')}</h4>
                    <InlineCode type={'php'} lines={3} code={`$url1 = addon_url('mydemo/index/index');
$url2 = addon_url('mydemo/index/index', [':name'=>'myname', 'id'=>123]);
$url3 = addon_url('mydemo/index/index', [':name'=>'myname', 'id'=>123], true, true);`} />
                    <ul className={'list'}>
                      <li>{t('plugin.s127')}</li>
                    </ul>
                    <h4>{t('plugin.s128')}</h4>
                    <p>{t('plugin.s129')}</p>
                    <InlineCode type={''} lines={3} code={`/addons/mydemo/index/index
/addons/mydemo/index/index.html?id=123&name=myname
http://www.fa.com/addons/mydemo/index/index.html?id=123&name=myname`} />
                  </div>

                  <div id={'get_addon_list'} ref={sectionRefs[2]} className={'w-full'}>
                    <h3>{`get_addon_list`}</h3>
                    <p>{t('plugin.s130')}</p>
                    <h4>{t('plugin.s126')}</h4>
                    <InlineCode type={'php'} lines={1} code={`$addonList = get_addon_list();`} />
                    <h4>{t('plugin.s128')}</h4>
                    <p>{t('plugin.s131')}</p>

                  </div>

                  <div id={'get_addon_info'} ref={sectionRefs[3]} className={'w-full'}>
                    <h3>{`get_addon_info`}</h3>
                    <p>{t('plugin.s132')}</p>
                    <h4>{t('plugin.s124')}</h4>
                    <p>{t('plugin.s133')}</p>
                    <h4>{t('plugin.s126')}</h4>
                    <InlineCode type={'php'} lines={1} code={`$addonInfo = get_addon_info('mydemo');`} />
                    <h4>{t('plugin.s128')}</h4>
                    <p>{t('plugin.s134')}</p>
                    <InlineCode type={''} lines={11} code={`Array
(
    [name] => mydemo
    [title] => 插件名称mydemo
    [intro] => FastAdmin插件
    [author] => yourname
    [website] => https://www.fastadmin.net
    [version] => 1.0.0
    [state] => 1
    [url] => /addons/mydemo.html
)`} />
                  </div>

                  <div id={'get_addon_fullconfig'} ref={sectionRefs[4]} className={'w-full'}>
                    <h3>{`get_addon_fullconfig`}</h3>
                    <p>{t('plugin.s135')}</p>
                    <h4>{t('plugin.s124')}</h4>
                    <p>{t('plugin.s136')}</p>
                    <h4>{t('plugin.s126')}</h4>
                    <InlineCode type={'php'} lines={1} code={`$addonConfigList = get_addon_fullconfig('mydemo');`} />
                    <h4>{t('plugin.s128')}</h4>
                    <InlineCode type={''} lines={36} code={`Array
(
    [0] => Array
        (
            [name] => usernmae
            [title] => 用户名
            [type] => string
            [content] => Array
                (
                )

            [value] => test
            [rule] => required
            [msg] => 
            [tip] => 
            [ok] => 
            [extend] => 
        )

    [1] => Array
        (
            [name] => password
            [title] => 密码
            [type] => string
            [content] => Array
                (
                )

            [value] => 123456
            [rule] => required
            [msg] => 
            [tip] => 
            [ok] => 
            [extend] => 
        )
)`} />
                  </div>

                  <div id={'get_addon_config'} ref={sectionRefs[5]} className={'w-full'}>
                    <h3>{`get_addon_config`}</h3>
                    <p>{t('plugin.s137')}</p>
                    <h4>{t('plugin.s124')}</h4>
                    <p>{t('plugin.s136')}</p>
                    <h4>{t('plugin.s126')}</h4>
                    <InlineCode type={'php'} lines={1} code={`$addonConfigList = get_addon_config('mydemo');`} />
                    <h4>{t('plugin.s128')}</h4>
                    <InlineCode type={''} lines={5} code={`Array
(
    [usernmae] => test
    [password] => 123456
)`} />
                  </div>

                  <div id={'get_addon_instance'} ref={sectionRefs[6]} className={'w-full'}>
                    <h3>{`get_addon_instance`}</h3>
                    <p>{t('plugin.s138')}</p>
                    <h4>{t('plugin.s124')}</h4>
                    <p>{t('plugin.s136')}</p>
                    <h4>{t('plugin.s126')}</h4>
                    <InlineCode type={'php'} lines={1} code={`$addonInstance = get_addon_instance('mydemo');`} />
                    <h4>{t('plugin.s128')}</h4>
                    <InlineCode type={''} lines={1} code={`addons\\mydemo\\Mydemo Object`} />
                  </div>

                  <div id={'set_addon_info'} ref={sectionRefs[7]} className={'w-full'}>
                    <h3>{`set_addon_info`}</h3>
                    <p>{t('plugin.s139')}</p>
                    <h4>{t('plugin.s124')}</h4>
                    <p>{t('plugin.s140')}</p>
                    <h4>{t('plugin.s126')}</h4>
                    <InlineCode type={'php'} lines={1} code={`$result = set_addon_info('mydemo', ['title'=>'标题一']);`} />
                    <h4>{t('plugin.s128')}</h4>
                    <div className="inline-code">
                    <pre>
                      <code>{`bool`}</code>
                    </pre>
                      <CodeLineNumbers lines={1}/>
                      <div className={'code-type'}></div>
                    </div>
                  </div>

                  <div id={'set_addon_config'} ref={sectionRefs[8]} className={'w-full'}>
                    <h3>{`set_addon_config`}</h3>
                    <p>{t('plugin.s141')}</p>
                    <h4>{t('plugin.s124')}</h4>
                    <p>{t('plugin.s142')}</p>
                    <h4>{t('plugin.s126')}</h4>
                    <InlineCode type={'php'} lines={2} code={`$result = set_addon_config('mydemo', ['username'=>'testname']);
$result = set_addon_config('mydemo', ['username'=>'testname'], true);`} />
                    <h4>{t('plugin.s128')}</h4>
                    <div className="inline-code">
                    <pre>
                      <code>{`bool`}</code>
                    </pre>
                      <CodeLineNumbers lines={1}/>
                      <div className={'code-type'}></div>
                    </div>
                  </div>

                  <div id={'set_addon_fullconfig'} ref={sectionRefs[9]} className={'w-full'}>
                    <h3>{`set_addon_fullconfig`}</h3>
                    <p>{t('plugin.s143')}</p>
                    <h4>{t('plugin.s124')}</h4>
                    <p>{t('plugin.s144')}</p>
                    <h4>{t('plugin.s126')}</h4>
                    <InlineCode type={'php'} lines={1} code={`$result = set_addon_fullconfig('mydemo', [['username'=>'testname', 'type'=>'string', ...]]);`} />
                    <h4>{t('plugin.s128')}</h4>
                    <div className="inline-code">
                    <pre>
                      <code>{`bool`}</code>
                    </pre>
                      <CodeLineNumbers lines={1}/>
                      <div className={'code-type'}></div>
                    </div>
                  </div>


                  {/* Page */}
                  <div className="pager">
                    <Link href="/plugin/plugin-extend" className="flex flex-row items-center gap-[6px]">
                      <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                      <span className="text-primary text-[16px]">{t("plugin.s21")}</span>
                    </Link>
                    <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                    <Link href="/plugin/plugin-ppvod-maccms" className="flex flex-row items-center gap-[6px]">
                      <span className="text-primary text-[16px] text-right">{t("plugin.s28")}</span>
                      <Image alt="ic-right" src="/images/icons/ic_green_arrow_right.svg" width={20} height={20}/>
                    </Link>
                  </div>
                  {/* End of Page */}

                </article>
              </div>
          )}
        </Scrollspy>

      </div>
    </PluginLayout>
  );
}