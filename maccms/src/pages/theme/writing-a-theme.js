import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
import ThemeSidebar from "@/layouts/theme/ThemeSidebar";
import ThemeLayout from "@/layouts/theme/ThemeLayout";
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
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  

  return (
    <ThemeLayout title={`${t('theme.s3')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
      <div className="doc container mb-[60px] md:mb-[90px]">
        <Scrollspy sectionRefs={sectionRefs} offset={-150}>
          {({ currentElementIndexInViewport }) => (
            <div className="flex justify-between w-full md:gap-[30px] xl:gap-[50px]">
              {/* Desktop sidebar */}
              <div className={'doc-sidebar h-full overflow-y-auto pt-[20px] md:pt-[65px] hidden md:flex flex-col min-w-[200px] xl:min-w-[230px]'}>
                <ThemeSidebar currentElementIndexInViewport={currentElementIndexInViewport} />
              </div>
              {/* Content */}
              <article className="doc pt-[10px] md:pt-[35px] grow">
                <div ref={sectionRefs[0]} className="w-full">
                  <h2>{t("theme.s3")}</h2>
                  {markdownify(t('theme.t12'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`└─ template
   └─ \`theme_tpl\`
       ├─ css
       ├─ js
       └─ html`}</code>
                    </pre>
                    <CodeLineNumbers lines={5}/>
                    <div className={'code-type'}></div>
                  </div>
                  <div className={'info'}>
                    <p className={'title'}>TIP</p>
                    {markdownify(t('theme.t13'), 'p', 'message')}
                  </div>
                  <h4>{t('theme.t14')}</h4>
                  {markdownify(t('theme.t15'), 'p')}
                  <InlineCode type={'html'} lines={4} code={`<script src="{$maccms.path}static/js/jquery.js"></script>
<script>var maccms={"path":"__ROOT__","mid":"{$maccms['mid']}","url":"{$maccms['site_url']}","wapurl":"{$maccms['site_wapurl']}","mob_status":"{$maccms['mob_status']}"};
</script>
<script src="{$maccms.path}static/js/home.js"></script>`} />
                </div>

                <div id={'使用标签'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("theme.s19")}</h3>
                  {markdownify(t('theme.t16'), 'p')}
                </div>

                <div id={'使用函数'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("theme.s20")}</h3>
                  <p>{t("theme.t17")}</p>
                  <InlineCode type={'html'} lines={1} code={`{$data.name|md5} `} />
                  <ul className={'list'}>
                    <li>{t('theme.t18')}</li>
                    <InlineCode type={'php'} lines={1} code={`<?php echo (md5($data['name'])); ?>`} />
                    <li>{t('theme.t19')}</li>
                    <InlineCode type={'html'} lines={1} code={`{$create_time|date="y-m-d",###}`} />
                    {markdownify(t('theme.t20'), 'p')}
                  </ul>
                  <InlineCode type={'php'} lines={2} code={`<?php echo (date("y-m-d",$create_time)); ?>`} />
                  <p>{t("theme.t21")}</p>
                  <InlineCode type={'html'} lines={1} code={`{$data.name|substr=0,3}`} />
                  <p>{t("theme.t22")}</p>
                  <InlineCode type={'php'} lines={1} code={`<?php echo (substr($data['name'],0,3)); ?>`} />
                  <p>{t("theme.t23")}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{$data.name|substr=###,0,3}`}</code>
                    </pre>
                    <CodeLineNumbers lines={1}/>
                    <div className={'code-type'}></div>
                  </div>
                  <p>{t("theme.t24")}</p>
                  <InlineCode type={''} lines={1} code={`{$name|md5|strtoupper|substr=0,3}`} />
                  <p>{t("theme.t25")}</p>
                  <InlineCode type={'php'} lines={1} code={`<?php echo (substr(strtoupper(md5($name)),0,3)); ?>`} />
                  <p>{t("theme.t26")}</p>
                  <InlineCode type={'html'} lines={1} code={`{:substr(strtoupper(md5($name)),0,3)}`} />
                  <div className='info'>
                    <p className='title'>TIP</p>
                    <p className='message'>{t('theme.t27')}</p>
                  </div>
                </div>

                <div id={'常用处理函数'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("theme.s21")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.t28'), 'li')}
                    {markdownify(t('theme.t29'), 'li')}
                    {markdownify(t('theme.t30'), 'li')}
                    {markdownify(t('theme.t31'), 'li')}
                    {markdownify(t('theme.t32'), 'li')}
                    {markdownify(t('theme.t33'), 'li')}
                    {markdownify(t('theme.t34'), 'li')}
                    {markdownify(t('theme.t35'), 'li')}
                    {markdownify(t('theme.t36'), 'li')}
                    {markdownify(t('theme.t37'), 'li')}
                    {markdownify(t('theme.t38'), 'li')}
                    {markdownify(t('theme.t39'), 'li')}
                    {markdownify(t('theme.t40'), 'li')}
                    {markdownify(t('theme.t41'), 'li')}
                    {markdownify(t('theme.t42'), 'li')}
                    {markdownify(t('theme.t43'), 'li')}
                    {markdownify(t('theme.t44'), 'li')}
                    {markdownify(t('theme.t45'), 'li')}
                    {markdownify(t('theme.t46'), 'li')}
                    {markdownify(t('theme.t47'), 'li')}
                  </ul>
                </div>

                <div id={'常用JS处理函数'} ref={sectionRefs[4]} className={'w-full'}>
                  <h3>{t("theme.s22")}</h3>
                  <p>{t("theme.t48")}</p>
                  <ul className='list'>
                    <li>{t('theme.t49')}</li>
                    <InlineCode type={'html'} lines={1} code={`<a href="javascript:;" class="mac_ulog" data-type="2" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}">我要收藏</a>`} />
                    <li>{t('theme.t50')}</li>
                    <InlineCode type={'html'} lines={1} code={`<a href="javascript:;" class="mac_ulog" data-type="2" data-mid="{$maccms.mid}" data-id="{$obj.art_id}">我要收藏</a>`} />
                    <li>{t('theme.t51')}</li>
                    <InlineCode type={'html'} lines={1} code={`<a href="javascript:;" class="mac_ulog" data-type="2" data-mid="{$maccms.mid}" data-id="{$obj.topic_id}">我要收藏</a>`} />
                    <p>{t('theme.t52')}</p>
                    <li>{t('theme.t53')}</li>
                    <InlineCode type={'html'} lines={1} code={`<span style="display:none" class="mac_ulog_set" alt="设置文章内容页浏览记录" data-type="1" data-mid="{$maccms.mid}" data-id="{$obj.art_id}" data-sid="{$param.sid}" data-nid="{$param.nid}"></span>`} />
                    <li>{t('theme.t54')}</li>
                    <InlineCode type={'html'} lines={1} code={`<span style="display:none" class="mac_ulog_set" alt="设置专题内容页浏览记录" data-type="1" data-mid="{$maccms.mid}" data-id="{$obj.topic_id}" data-sid="{$param.sid}" data-nid="{$param.nid}"></span>`} />
                    <li>{t('theme.t55')}</li>
                    <InlineCode type={'html'} lines={1} code={`<span style="display:none" class="mac_ulog_set" alt="设置内容页浏览记录" data-type="1" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}" data-sid="{$param.sid}" data-nid="{$param.nid}"></span>`} />
                    <li>{t('theme.t56')}</li>
                    <InlineCode type={'html'} lines={1} code={`<span style="display:none" class="mac_ulog_set" alt="设置视频播放记录" data-type="4" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}" data-sid="{$param.sid}" data-nid="{$param.nid}"></span>`} />
                    <li>{t('theme.t57')}</li>
                    <InlineCode type={'html'} lines={1} code={`<span style="display:none" class="mac_ulog_set" alt="设置视频播放记录" data-type="5" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}" data-sid="{$param.sid}" data-nid="{$param.nid}"></span>`} />
                    <li>{t('theme.t58')}</li>
                    <InlineCode type={'html'} lines={6} code={`<a class="digg_link" data-id="{$obj.vod_id}{$obj.art_id}{$obj.topic_id}" data-mid="{$maccms.mid}" data-type="up" href="javascript:;">
  顶<em class="digg_num">{$obj.vod_up}{$obj.art_up}{$obj.topic_up}</em>
</a>
<a class="digg_link" data-id="{$vod_id}{$art_id}{$topic_id}" data-mid="{$maccms.mid}" data-type="down" href="javascript:;">
  踩<em class="digg_num">{$obj.vod_down}{$obj.art_down}{$obj.topic_down}</em>
</a>`} />
                  </ul>

                  <h4>{t('theme.t59')}</h4>
                  <p>{t('theme.t60')}</p>
                  <InlineCode type={'html'} lines={1} code={`<span class="mac_hits hits" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}{$obj.art_id}{$obj.topic_id}" data-type="hits"></span>`} />
                  <ul className='list'>
                    <li>{t('theme.t61')}</li>
                    <InlineCode type={'html'} lines={1} code={`<span class=\"mac_hits hits_day\" data-mid=\"{$maccms.mid}\" data-id=\"{$obj.vod_id}{$obj.art_id}{$obj.topic_id}\" data-type=\"hits_day\"></span>`} />
                    <li>{t('theme.t62')}</li>
                    <InlineCode type={'html'} lines={1} code={`<span class="mac_hits hits_week" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}{$obj.art_id}{$obj.topic_id}"  data-type="hits_week"></span>`} />
                    <li>{t('theme.t62')}</li>
                    <InlineCode type={'html'} lines={1} code={`<span class="mac_hits hits_week" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}{$obj.art_id}{$obj.topic_id}"  data-type="hits_week"></span>`} />
                    <li>{t('theme.t63')}</li>
                    <InlineCode type={'html'} lines={1} code={`<span class="mac_hits hits_month" data-mid="{$maccms.mid}" data-id="{$obj.vod_id}{$obj.art_id}{$obj.topic_id}" data-type="hits_month"></span>`} />
                    <li>{t('theme.t64')}</li>
                    <InlineCode type={'html'} lines={1} code={`<a href="javascript:;" class="mac_history">历史记录</a>`} />
                    <h4>{t('theme.t65')}</h4>
                    <InlineCode type={'html'} lines={3} code={`<span style="display:none" class="mac_history_set" alt="设置视频历史记录" data-name="[{$obj.type.type_name}]{$obj.vod_name}" data-pic="{$obj.vod_pic|mac_url_img}"></span>
<span style="display:none" class="mac_history_set" alt="设置文章历史记录" data-name="[{$obj.type.type_name}]{$obj.art_name}" data-pic="{$obj.art_pic|mac_url_img}"></span>
<span style="display:none" class="mac_history_set" alt="设置专题历史记录" data-name="{$obj.topic_name}" data-pic="{$obj.topic_pic|mac_url_img}"></span>`} />
                    <li>{t('theme.t66')}</li>
                    <InlineCode type={'html'} lines={1} code={`<span style="display: none;" class="mac_timming" data-file="" ></span>`} />
                    <li>{t('theme.67')}</li>
                    <InlineCode type={'html'} lines={1} code={`<span style="display: none;" class="mac_referer" data-file="" ></span>`} />
                    <li>{t('theme.68')}</li>
                    <InlineCode type={'html'} lines={1} code={`<input type="text" name="shorten" class="mac_shorten" />`} />
                    <li>{t('theme.68')}</li>
                    <InlineCode type={'html'} lines={1} code={`<input type="text" name="shorten" class="mac_shorten" />`} />
                    <li>{t('theme.69')}</li>
                    <InlineCode type={'html'} lines={5} code={`<script>
    MAC.Shorten.Get("http://www.baidu.com/",function(r){
        alert(r.data.url_short);
    });
</script>`} />
                    <li>{t('theme.70')}</li>
                    {markdownify(t('theme.t71'), 'li')}
                    <InlineCode type={'html'} lines={11} code={`<script>
    MAC.Ulog.Get(0,1,999,function(r){
        if(r.code == 1){
            $.each(r['list'],function(index,row){
                console.log(row['data']['id'] + '--' + row['data']['name'] + '--' + row['data']['pic'] + '--' + row['data']['link'] + '--' + row['data']['type']['type_name'] + '--' + row['data']['type']['link'] + '--'  );
            });
        }else{
\t\t\tconsole.log('获取失败');
        }
\t});
</script>`} />
                  </ul>
                </div>

                <div id={'使用默认值'} ref={sectionRefs[5]} className={'w-full'}>
                  <h3>{t("theme.s23")}</h3>
                  <p>{t("theme.t72")}</p>
                  <InlineCode type={'html'} lines={1} code={`{$obj.user_nickname|default="这个人没有昵称"}`} />
                  <p>{t("theme.t73")}</p>
                  <InlineCode type={'html'} lines={1} code={`{$obj.vod_actor|default="演员为空"}`} />
                  <p>{t("theme.t74")}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{$Think.get.name|getName|default="名称为空"}`}</code>
                    </pre>
                    <CodeLineNumbers lines={1}/>
                    <div className={'code-type'}></div>
                  </div>
                </div>


                <div id={'使用运算符'} ref={sectionRefs[6]} className={'w-full'}>
                  <h3>{t("theme.s24")}</h3>
                  <p>{t("theme.t75")}</p>
                  <div className='table-wrapper'>
                    <table>
                      <thead className='thead'>
                      <tr>
                        <th>运算符</th>
                        <th>使用示例</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>+</td>
                        <td>{`{$a + $b}`}</td>
                      </tr>
                      <tr>
                        <td>-</td>
                        <td>{`{$a - $b}`}</td>
                      </tr>
                      <tr>
                        <td>*</td>
                        <td>{`{$a * $b}`}</td>
                      </tr>
                      <tr>
                        <td>/</td>
                        <td>{`{$a / $b}`}</td>
                      </tr>
                      <tr>
                        <td>%</td>
                        <td>{`{$a % $b}`}</td>
                      </tr>
                      <tr>
                        <td>++</td>
                        <td>{`{$a++} 或 {++$a}`}</td>
                      </tr>
                      <tr>
                        <td>--</td>
                        <td>{`{$a--} 或 {--$a}`}</td>
                      </tr>
                      <tr>
                        <td>综合判断</td>
                        <td>{`{$a + $b * 10 + $c}`}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>{t('theme.t76')}</p>
                  <InlineCode type={'html'} lines={5} code={`{$user.score+10} //正确的
{$user['score']+10} //正确的
{$user['score']*$user['level']} //正确的
{$user['score']|myFun*10} //错误的
{$user['score']+myFun($user['level'])} //正确的`} />
                </div>

                <div id={'三元运算'} ref={sectionRefs[7]} className={'w-full'}>
                  <h3>{t("theme.s25")}</h3>
                  <p>{t("theme.t77")}</p>
                  <InlineCode type={'html'} lines={3} code={`{$status? '正常' : '错误'}
{$info['status']? $info['msg'] : $info['error']}
{$info.status? $info.msg : $info.error }`} />
                  <p>{t("theme.t78")}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{$varname.aa ?? 'xxx'}`}</code>
                    </pre>
                    <CodeLineNumbers lines={1}/>
                    <div className={'code-type'}>html</div>
                  </div>

                  <p>{t("theme.t79")}</p>
                  <InlineCode type={'php'} lines={1} code={`<?php echo isset($varname['aa']) ? $varname['aa'] : '默认值'; ?>`} />
                  <div className="inline-code">
                    <pre>
                      <code>{`{$varname?='xxx'} `}</code>
                    </pre>
                    <CodeLineNumbers lines={1}/>
                    <div className={'code-type'}>html</div>
                  </div>

                  <p>{t("theme.t80")}</p>
                  <InlineCode type={'php'} lines={1} code={`<?php if(!empty($name)) echo 'xxx'; ?>`} />
                  <InlineCode type={'html'} lines={1} code={`{$varname ?: 'no'}`} />
                  <p>{t("theme.t81")}</p>
                  <InlineCode type={'php'} lines={1} code={`<?php echo $varname ? $varname : 'no'; ?>`} />
                  <InlineCode type={'html'} lines={1} code={`{$a==$b ? 'yes' : 'no'}`} />
                  <p>{t("theme.t82")}</p>

                </div>

                <div id={'模板继承'} ref={sectionRefs[8]} className={'w-full'}>
                  <h3>{t("theme.s26")}</h3>
                  {markdownify(t('theme.t83'), 'p')}
                  {markdownify(t('theme.t84'), 'p')}
                  {markdownify(t('theme.t85'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{block name="title"}<title>网站标题</title>{/block}`}</code>
                    </pre>
                    <CodeLineNumbers lines={1}/>
                    <div className={'code-type'}>html</div>
                  </div>
                  <p>{t("theme.t86")}</p>
                  <InlineCode type={'html'} lines={1} code={`{block name="title"}<title>{$web_title}</title>{/block}`} />
                  <p>{t("theme.t87")}</p>
                  <InlineCode type={'html'} lines={1} code={`{block name="include"}{include file="Public:header" /}{/block}`} />

                  <p>{t("theme.t88")}</p>
                  <InlineCode type={'html'} lines={13} code={`<html>
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <title>{block name="title"}标题{/block}</title>
   </head>
   <body>
      {block name="menu"}菜单{/block}
      {block name="left"}左边分栏{/block}
      {block name="main"}主内容{/block}
      {block name="right"}右边分栏{/block}
      {block name="footer"}底部{/block}
   </body>
</html>`} />
                  <p>{t("theme.t89")}</p>
                  <InlineCode type={'html'} lines={24} code={`{extend name="base" /}
{block name="title"}{$title}{/block}
{block name="menu"}
<a href="/" >首页</a>
<a href="/info/" >资讯</a>
<a href="/bbs/" >论坛</a>
{/block}
{block name="left"}{/block}
{block name="main"}
{volist name="list" id="vo"}
<a href="/new/{$vo.id}">{$vo.title}</a><br/>
 {$vo.content}
{/volist}
{/block}
{block name="right"}
 最新资讯：
{volist name="news" id="new"}
<a href="/new/{$new.id}">{$new.title}</a><br/>
{/volist}
{/block}
{block name="footer"}
{__block__}
 @ThinkPHP 版权所有
{/block}`} />
                  <p>{t("theme.t90")}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{block name="footer"}
{__block__}@大图模板datll.com 版权所有
{/block}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  {markdownify(t('theme.t91'), 'p')}
                  <InlineCode type={'html'} lines={1} code={`{extend name="Public:base" /}`} />
                  <p>{t("theme.t92")}</p>
                  <InlineCode type={'html'} lines={1} code={`{extend name="./Template/Public/base.html" /}`} />
                  <p>{t("theme.t93")}</p>
                  <InlineCode type={'html'} lines={4} code={`{block name="title"}<title>{$title}</title>{/block}
<a href="/" >首页</a>
<a href="/art/index" >资讯</a>
<a href="/actor/" >明星</a>`} />
                  <p>{t("theme.t94")}</p>
                </div>

                <div id={'比较标签'} ref={sectionRefs[9]} className={'w-full'}>
                  <h3>{t("theme.s27")}</h3>
                  <p>{t("theme.t95")}</p>
                  <div className='table-wrapper'>
                    <table>
                      <thead className='thead'>
                      <tr>
                        <th>标签</th>
                        <th>含义</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>eq或者 equal</td>
                        <td>等于</td>
                      </tr>
                      <tr>
                        <td>neq 或者notequal</td>
                        <td>不等于</td>
                      </tr>
                      <tr>
                        <td>gt</td>
                        <td>大于</td>
                      </tr>
                      <tr>
                        <td>egt</td>
                        <td>大于等于</td>
                      </tr>
                      <tr>
                        <td>lt</td>
                        <td>小于</td>
                      </tr>
                      <tr>
                        <td>elt</td>
                        <td>小于等于</td>
                      </tr>
                      <tr>
                        <td>heq</td>
                        <td>恒等于</td>
                      </tr>
                      <tr>
                        <td>nheq</td>
                        <td>不恒等于</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>{t('theme.t96')}</p>
                  <InlineCode type={'html'} lines={1} code={`{eq name="name" value="value"}value{/eq}`} />
                  <p>或者</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{equal name="name" value="value"}value{/equal}`}</code>
                    </pre>
                    <CodeLineNumbers lines={1}/>
                    <div className={'code-type'}></div>
                  </div>
                  <p>{t('theme.t97')}</p>
                  <InlineCode type={'html'} lines={5} code={`{eq name="name" value="value"}
相等
{else/}
不相等
{/eq}`} />
                  <p>{t('theme.t98')}</p>
                  <InlineCode type={'html'} lines={1} code={`{gt name="vod_name" value="5"}value{/gt}`} />
                  <p>{t('theme.t99')}</p>
                  <InlineCode type={'html'} lines={1} code={`{egt name="name" value="5"}value{/egt}`} />
                  <p>{t('theme.t100')}</p>
                  <InlineCode type={''} lines={3} code={`{eq name="vo.vod_name" value="5"}
{$vo.vod_name}
{/eq}`} />
                  {markdownify(t('theme.t101'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{eq name="vo:vod_name" value="5"}
{$vo.vod_name}
{/eq}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>
                  {markdownify(t('theme.t102'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{eq name="vo['vod_name']" value="5"}
{$vo.name}
{/eq}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>
                  {markdownify(t('theme.t103'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{eq name="vo:name|strlen" value="5"}{$vo.name}{/eq}`}</code>
                    </pre>
                    <CodeLineNumbers lines={1}/>
                    <div className={'code-type'}></div>
                  </div>
                  <p>{t('theme.t104')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{eq name="Think.get.name" value="value"}相等{else/}不相等{/eq}`}</code>
                    </pre>
                    <CodeLineNumbers lines={1}/>
                    <div className={'code-type'}></div>
                  </div>
                  <p>{t('theme.t105')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{eq name="vo:vod_name" value="$a"}{$vo.vod_name}{/eq}`}</code>
                    </pre>
                    <CodeLineNumbers lines={1}/>
                    <div className={'code-type'}></div>
                  </div>
                  {markdownify(t('theme.t106'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{compare name="name" value="5" type="eq"}value{/compare}`}</code>
                    </pre>
                    <CodeLineNumbers lines={1}/>
                    <div className={'code-type'}>html</div>
                  </div>
                  <p>等效于</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{eq name="name" value="5" }value{/eq}`}</code>
                    </pre>
                    <CodeLineNumbers lines={1}/>
                    <div className={'code-type'}>html</div>
                  </div>
                  <p>{t('theme.t107')}</p>
                </div>

                <div id={'条件判断'} ref={sectionRefs[10]} className={'w-full'}>
                  <h3>{t("theme.s28")}</h3>
                  <h4>{t("theme.t108")}</h4>
                  <p>用法：</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{switch name="变量" }
    {case value="值1" break="0或1"}输出内容1{/case}
    {case value="值2"}输出内容2{/case}
    {default /}默认情况
{/switch}`}</code>
                    </pre>
                    <CodeLineNumbers lines={5}/>
                    <div className={'code-type'}>html</div>
                  </div>
                  <p>{t('theme.t109')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{switch name="User.level"}
    {case value="1"}value1{/case}
    {case value="2"}value2{/case}
    {default /}default
{/switch}`}</code>
                    </pre>
                    <CodeLineNumbers lines={5}/>
                    <div className={'code-type'}>html</div>
                  </div>
                  <p>{t('theme.t110')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{switch name="Think.get.userId|abs"}
    {case value="1"}admin{/case}
    {default /}default
{/switch}`}</code>
                    </pre>
                    <CodeLineNumbers lines={4}/>
                    <div className={'code-type'}>html</div>
                  </div>
                  <p>{t('theme.t111')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{switch name="Think.get.type"}
    {case value="gif|png|jpg"}图像格式{/case}
    {default /}其他格式
{/switch}`}</code>
                    </pre>
                    <CodeLineNumbers lines={4}/>
                    <div className={'code-type'}>html</div>
                  </div>
                  {markdownify(t('theme.t112'), 'p')}
                  {markdownify(t('theme.t113'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{switch name="Think.get.userId|abs"}
    {case value="1" break="0"}admin{/case}
    {case value="2"}admin{/case}
    {default /}default
{/switch}`}</code>
                    </pre>
                    <CodeLineNumbers lines={5}/>
                    <div className={'code-type'}>html</div>
                  </div>
                  <p>{t('theme.t114')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{switch name="User.userId"}
    {case value="$adminId"}admin{/case}
    {case value="$memberId"}member{/case}
    {default /}default
{/switch}`}</code>
                    </pre>
                    <CodeLineNumbers lines={5}/>
                    <div className={'code-type'}>html</div>
                  </div>
                  <div className='info'>
                    <p className='title'>TIP</p>
                    <p className='message'>{t('theme.t115')}</p>
                  </div>
                  <p>{t('theme.t116')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{switch $User.userId}
    {case $adminId}admin{/case}
    {case $memberId}member{/case}
{/switch}`}</code>
                    </pre>
                    <CodeLineNumbers lines={4}/>
                    <div className={'code-type'}></div>
                  </div>
                  <h4>{t('theme.t117')}</h4>
                  <p>{t('theme.t118')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{if condition="($name == 1) OR ($name > 100) "} value1
{elseif condition="$name eq 2"/}value2
{else /} value3
{/if}`}</code>
                    </pre>
                    <CodeLineNumbers lines={4}/>
                    <div className={'code-type'}></div>
                  </div>
                  <p>{t('theme.t119')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{if condition="strtoupper($user['name']) neq 'THINKPHP'"}ThinkPHP
{else /} other Framework
{/if}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  <p>{t('theme.t120')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{if condition="$user.name neq 'ThinkPHP'"}ThinkPHP
{else /} other Framework
{/if}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  <p>{t('theme.t121')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{if condition="$user:name neq 'ThinkPHP'"}ThinkPHP
{else /} other Framework
{/if}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  <p>{t('theme.t122')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{if condition="表达式"}
{if (表达式)}
{if 表达式}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>
                  <p>{t('theme.t123')}</p>
                  <h4>{t('theme.t124')}</h4>
                  {markdownify(t('theme.t125'), 'p')}
                  <p className='text-black font-medium'>N和NOTIN</p>
                  <p>{t('theme.t126')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`$id =    1;
$this->assign('id',$id);`}</code>
                    </pre>
                    <CodeLineNumbers lines={2}/>
                    <div className={'code-type'}></div>
                  </div>

                  <p>{t('theme.t127')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{in name="id" value="1,2,3"}
id在范围内
{/in}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  <p>{t('theme.t128')}</p>
                  <div className="inline-code">
                    <pre>
                      <code>{`{in name="id" value="1,2,3"}
id在范围内
{/in}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>
                  {markdownify(t('theme.t128'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{notin name="id" value="1,2,3"}
id不在范围内
{/notin}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  {markdownify(t('theme.t129'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{in name="id" value="1,2,3"}
id在范围内
{else/}
id不在范围内
{/in}`}</code>
                    </pre>
                    <CodeLineNumbers lines={5}/>
                    <div className={'code-type'}></div>
                  </div>
                  {markdownify(t('theme.t130'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{in name="Think.get.id" value="1,2,3"}
$_GET['id'] 在范围内
{/in}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>
                  <div className='info'>
                    <p className='title'>TIP</p>
                    <p className='message'>{t('theme.t131')}</p>
                  </div>
                  {markdownify(t('theme.t132'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{in name="id" value="$range"}
id在范围内
{/in}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>
                  {markdownify(t('theme.t133'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{in name="id" value="$Think.post.ids"}
id在范围内
{/in}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  <p className='text-black font-medium'>{`BETWEEN 和 NOTBETWEEN`}</p>
                  {markdownify(t('theme.t134'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{between name="id" value="1,10"}
输出内容1
{/between}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>
                  {markdownify(t('theme.t135'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{notbetween name="id" value="1,10"}
输出内容2
{/notbetween}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  {markdownify(t('theme.t136'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{between name="id" value="1,10"}
输出内容1
{else/}
输出内容2
{/between}`}</code>
                    </pre>
                    <CodeLineNumbers lines={5}/>
                    <div className={'code-type'}></div>
                  </div>

                  {markdownify(t('theme.t137'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{between name="id" value="1,3,10"}
输出内容1
{/between}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  {markdownify(t('theme.t138'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{between name="id" value="A,Z"}
输出内容1
{/between}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  {markdownify(t('theme.t139'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{between name="Think.post.id" value="1,5"}
输出内容1
{/between}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  {markdownify(t('theme.t140'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{between name="id" value="$range"}
输出内容1
{/between}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  {markdownify(t('theme.t141'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{between name="id" value="$Think.get.range"}
输出内容1
{/between}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  <p className='text-black font-medium'>{`RANGE`}</p>

                  {markdownify(t('theme.t142'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{range name="id" value="1,2,3" type="in"}
输出内容1
{/range}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>
                  {markdownify(t('theme.t143'), 'p')}

                  <p className='text-black font-medium'>{`PRESENT NOTPRESENT标签`}</p>

                  {markdownify(t('theme.t144'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{present name="name"}
name已经赋值
{/present}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  {markdownify(t('theme.t145'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{notpresent name="name"}
name还没有赋值
{/notpresent}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  {markdownify(t('theme.t146'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{present name="name"}
name已经赋值
{else /}
name还没有赋值
{/present}`}</code>
                    </pre>
                    <CodeLineNumbers lines={5}/>
                    <div className={'code-type'}></div>
                  </div>

                  {markdownify(t('theme.t147'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{present name="Think.get.name"}
$_GET['name']已经赋值
{/present}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  <p className='text-black font-medium'>{`EMPTY NOTEMPTY 标签`}</p>

                  {markdownify(t('theme.t148'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{empty name="name"}
name为空值
{/empty}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  {markdownify(t('theme.t149'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{notempty name="name"}
name不为空
{/notempty}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  {markdownify(t('theme.t150'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{empty name="name"}
name为空
{else /}
name不为空
{/empty}`}</code>
                    </pre>
                    <CodeLineNumbers lines={5}/>
                    <div className={'code-type'}></div>
                  </div>

                  {markdownify(t('theme.t151'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{empty name="Think.get.name"}
$_GET['name']为空值
{/empty}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  <p className='text-black font-medium'>{`DEFINED 标签`}</p>

                  {markdownify(t('theme.t152'), 'p')}
                  <div className="inline-code">
                    <pre>
                      <code>{`{defined name="NAME"}
NAME常量已经定义
{/defined}`}</code>
                    </pre>
                    <CodeLineNumbers lines={3}/>
                    <div className={'code-type'}></div>
                  </div>

                  <div className='info'>
                    <p className='title'>TIP</p>
                    <p className='message'>{t('theme.t153')}</p>
                  </div>

                  {markdownify(t('theme.t154'), 'p')}
                  <InlineCode type={''} lines={3} code={`{notdefined name="NAME"}
NAME常量未定义
{/notdefined}`} />

                  {markdownify(t('theme.t155'), 'p')}
                  <InlineCode type={''} lines={5} code={`{defined name="NAME"}
NAME常量已经定义
{else /}
NAME常量未定义
{/defined}`} />

                </div>

                <div id={'标签嵌套'} ref={sectionRefs[11]} className={'w-full'}>
                  <h3>{t("theme.s29")}</h3>
                  {markdownify(t('theme.t156'), 'p')}
                  <InlineCode type={''} lines={5} code={`{volist name="list" id="vo"}
    {volist name="vo['sub']" id="sub"}
        {$sub.name}
    {/volist}
{/volist}`} />
                  <ul className='list'>
                    <li>{t('theme.t157')}</li>
                    <InlineCode type={''} lines={5} code={`{maccms:type ids="1,2,3,4" order="asc" by="sort" id="vo1" key="key1"}
    {maccms:vod num="10" type="'.$vo1['type_id'].'" order="desc" by="time" id="vo2" key="key2"}
        {$vo1.type_name}:{$vo2.vod_name}；
    {/maccms:vod}
{/maccms:type}`}/>

                    <li>{t('theme.t158')}</li>
                    <InlineCode type={''} lines={5} code={`{maccms:type ids="1,2,3,4,5" order="asc" by="sort" id="vo" key="key"} \t\t\t\t  
\t{maccms:type parent="'.$vo['type_id'].'" order="asc" by="sort" id="vo2" key="key2"} 
\t\t<li><a href=":mac_url_type($vo2)}">{$vo2.type_name}</a></li>
\t{/maccms:type}
{/maccms:type}`}/>

                  </ul>
                </div>

                <div id={'使用PHP'} ref={sectionRefs[12]} className={'w-full'}>
                  <h3>{t("theme.s30")}</h3>
                  <p>{t('theme.t159')}</p>
                  <h4>{t('theme.t160')}</h4>
                  <InlineCode type={''} lines={1} code={`{php}echo 'Hello,world!';{/php}`}/>
                  <p>{t('theme.t161')}</p>
                  <h4>{t('theme.t162')}</h4>
                  <InlineCode type={'php'} lines={1} code={`<?php echo 'Hello,world!'; ?>`}/>
                  <div className='info'>
                    <p className='title'>TIP</p>
                    <p className='message'>{t('theme.t163')}</p>
                  </div>
                  <InlineCode type={''} lines={1} code={`{php}{eq name='name'value='value'}value{/eq}{/php}`}/>
                  {markdownify(t('theme.t164'), 'p')}
                  <InlineCode type={''} lines={1} code={`{php}if( {$user} != 'ThinkPHP' ) echo  'ThinkPHP' ;{/php}`}/>
                  {markdownify(t('theme.t165'), 'p')}
                  <InlineCode type={''} lines={1}
                              code={`{php}if( $user.name != 'ThinkPHP' ) echo  'ThinkPHP' ;{/php}`}/>
                  {markdownify(t('theme.t166'), 'p')}
                  <div className='info'>
                    <p className='title'>TIP</p>
                    <p className='message'>{t('theme.t167')}</p>
                  </div>
                  {markdownify(t('theme.t168'), 'p')}
                  <h4>{t('theme.t169')}</h4>
                  {markdownify(t('theme.t170'), 'p')}
                  <InlineCode type={''} lines={1}
                              code={`{assign name="var" value="123" /}`}/>
                  {markdownify(t('theme.t171'), 'p')}
                  {markdownify(t('theme.t172'), 'p',  'mt-3')}
                  <InlineCode type={''} lines={1}
                              code={`{assign name="var" value="$val" /}`}/>
                  {markdownify(t('theme.t173'), 'p')}
                  <InlineCode type={''} lines={1}
                              code={`{assign name="var" value="$Think.get.name" /}`}/>
                  {markdownify(t('theme.t174'), 'p')}
                  {markdownify(t('theme.t175'), 'p')}

                  <InlineCode type={''} lines={1}
                              code={`{define name="MY_DEFINE_NAME" value="3" /}`}/>
                  {markdownify(t('theme.t176'), 'p')}
                  {markdownify(t('theme.t177'), 'p')}
                  <InlineCode type={''} lines={1}
                              code={`{define name="MY_DEFINE_NAME" value="$name" /}`}/>
                  <p>或者</p>
                  <InlineCode type={''} lines={1}
                              code={`{define name="MY_DEFINE_NAME" value="$Think.get.name" /}`}/>
                </div>


                {/* Page */}
                <div className="pager">
                  <Link href="/theme/using-a-theme" className="flex flex-row items-center gap-[6px]">
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                    <span className="text-primary text-[16px]">{t("theme.s2")}</span>
                  </Link>
                  <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                  <Link href="/theme/structure" className="flex flex-row items-center gap-[6px]">
                    <span className="text-primary text-[16px] text-right">{t("theme.s4")}</span>
                    <Image alt="ic-right" src="/images/icons/ic_green_arrow_right.svg" width={20} height={20}/>
                  </Link>
                </div>
                {/* End of Page*/}
              </article>
            </div>
          )}
        </Scrollspy>

      </div>
    </ThemeLayout>
  );
}