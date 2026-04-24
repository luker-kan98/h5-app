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
  ];

  

  return (
    <PluginLayout title={`${t('plugin.s7')} | ${t('seo.t.t0')}`} mobile_title={t("menu.plugin")}>
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
                    <h2>{t("plugin.s7")}</h2>
                    <div className='info'>
                      <p className='title'>{t('plugin.s51')}</p>
                      <p className='message'>{t('plugin.s52')}</p>
                    </div>
                  </div>
                  <div id={'创建插件'} ref={sectionRefs[1]} className={'w-full'}>
                    <h3>{t("plugin.s8")}</h3>
                    {markdownify(t('plugin.s53'), 'p')}
                    <ul className='list'>
                      {markdownify(t('plugin.s54'), 'li')}
                      {markdownify(t('plugin.s55'), 'li')}
                      {markdownify(t('plugin.s56'), 'li')}
                      {markdownify(t('plugin.s57'), 'li')}
                    </ul>
                    <InlineCode type={'php'} lines={52} code={`<?php
namespace addons\\mydemo;\t// 注意命名空间规范
use thinkAddons;
/**
 * 插件测试
 * @author byron sampson
 */
class Mydemo extends Addons\t// 需继承thinkaddonsAddons类
{
\t// 该插件的基础信息
    public $info = [
        'name' => 'mydemo',\t// 插件标识
        'title' => '插件测试',\t// 插件名称
        'description' => 'thinkph5插件测试',\t// 插件简介
        'status' => 0,\t// 状态
        'author' => 'byron sampson',
        'version' => '0.1'
    ];

    /**
     * 插件安装方法
     * @return bool
     */
    public function install()
    {
        return true;
    }

    /**
     * 插件卸载方法
     * @return bool
     */
    public function uninstall()
    {
        return true;
    }

    /**
     * 实现的mydemohook钩子方法
     * @return mixed
     */
    public function mydemohook($param)
    {
\t\t// 调用钩子时候的参数信息
        print_r($param);
\t\t// 当前插件的配置信息，配置信息存在当前目录的config.php文件中，见下方
        print_r($this->getConfig());
\t\t// 可以返回模板，模板文件默认读取的为插件目录中的文件。模板名不能为空！
        return $this->fetch('info');
    }

}`} />
                  </div>

                  <div id={'创建插件配置文件'} ref={sectionRefs[2]} className={'w-full'}>
                    <h3>{t("plugin.s9")}</h3>
                    {markdownify(t('plugin.s58'), 'p')}
                    {markdownify(t('plugin.s59'), 'p', 'text-black text-[16px] font-[500]')}
                    <InlineCode type={'php'} lines={136} code={`<?php
return array (
   0 => array (
       'name' => 'rewrite', # 伪静态,在苹果cms开启路由模式后可在rewrite数组下的 value 添加路由规则
       'title' => '伪静态',
       'type' => 'array', # 数组类型
       'content' => array (),
       'value' => array (
          'index' => '/mydemo$',
          'api/index' => '/api$'
       ),
       'rule' => 'required',
       'msg' => '',
       'tip' => '',
       'ok' => '',
       'extend' => '',
   ),
   1 => array (
       'name' => 'open',
       'title' => '多选框',
       'type' => 'radio', # radio 多选框类型
       'content' => array (
          'on' => '启用',
          'off' => '关闭',
       ),
       'value' => 'off',
       'rule' => 'required',
       'msg' => '',
       'tip' => '',
       'ok' => '',
       'extend' => '',
   ),
   2 => array (
       'name' => 'open',
       'title' => '复选框',
       'type' => 'checkbox', # 复选框 类型
       'content' => array (
          'on' => '启用',
          'off' => '关闭',
       ),
       'value' => 'off',
       'rule' => 'required',
       'msg' => '',
       'tip' => '',
       'ok' => '',
       'extend' => '',
   ),
   3 => array (
       'name' => 'menu',
       'title' => '输入框',
       'type' => 'string', # 字符串 输入框类型
       'content' => array (),
       'value' => '1,2,3,4',
       'rule' => 'required',
       'msg' => '',
       'tip' => '备注文字',
       'ok' => '',
       'extend' => '', #string 类型支持 extend参数，如：style="line-height: 1.8;"
   ),
   4 => array (
       'name' => 'hot_banner',
       'title' => '下拉菜单',
       'type' => 'selects', # 下拉菜单类型
       'content' => array (
          0 => '小图风格',
          1 => '巨幕风格',
       ),
       'value' => '1',
       'rule' => 'required',
       'msg' => '',
       'tip' => '',
       'ok' => '',
       'extend' => '',
   ),
   5 => array (
       'name' => 'tiptext',
       'title' => '文本框',
       'type' => 'text', # textarea 文本框类型
       'content' => array (),
       'value' => '大家好我是老王，建站就用苹果cms',
       'rule' => 'required',
       'msg' => '',
       'tip' => '',
       'ok' => '',
       'extend' => 'style="height: 150px;"', # text 类型支持 extend参数，如：style="line-height: 1.8;"
   ),
   6 => array (
       'name' => 'go_time',
       'title' => '日期选择',
       'type' => 'datetime', # 日期选择器 类型
       'content' => array (),
       'value' => '1629560562',
       'rule' => 'required',
       'msg' => '',
       'tip' => '',
       'ok' => '',
       'extend' => '',
   ),
   7 => array (
       'name' => 'go_pic',
       'title' => '上传图片',
       'type' => 'images', # 上传图片表单类型
       'content' => array (),
       'value' => '',
       'rule' => 'required',
       'msg' => '',
       'tip' => '',
       'ok' => '',
       'extend' => '', 
   ),
   8 => array (
       'name' => 'go_file',
       'title' => '上传文件',
       'type' => 'files', # 上传文件表单类型
       'content' => array (),
       'value' => '',
       'rule' => 'required',
       'msg' => '',
       'tip' => '',
       'ok' => '',
       'extend' => '', 
   ),
   9 => array (
       'name' => 'go_bool',
       'title' => '双选表单',
       'type' => 'bool', # 双选表单类型
       'content' => array (),
       'value' => '',
       'rule' => 'required',
       'msg' => '',
       'tip' => '',
       'ok' => '',
       'extend' => '', 
   ),
 );
 `} />
                  </div>

                  <div id={'创建钩子模板文件'} ref={sectionRefs[3]} className={'w-full'}>
                    <h3>{t("plugin.s10")}</h3>
                    {markdownify(t('plugin.s60'), 'p')}
                    <InlineCode type={'html'} lines={1} code={`<h1>hello tpl</h1>`} />
                    <ul className='list'>
                      <li>{t('plugin.s61')}</li>
                      <li>{t('plugin.s62')}</li>
                      <li>{t('plugin.s63')}</li>
                    </ul>
                    <InlineCode type={'html'} lines={1} code={`<a href="{:addon_url('mydemo://Action/link')}">link mydemo</a>`} />
                    <ul className='list'>
                      {markdownify(t('plugin.s64'), 'li')}
                      {markdownify(t('plugin.s65'), 'li')}
                      {markdownify(t('plugin.s66'), 'li')}
                      {markdownify(t('plugin.s67'), 'li')}
                    </ul>
                    <InlineCode type={'php'} lines={10} code={`<?php
namespace addons\\mydemo\\Controller;

class Action
{
    public function link()
    {
        echo 'hello link';
    }
}`}/>
                    <p>{t('plugin.s68')}</p>
                    <InlineCode type={'php'} lines={12} code={`<?php
namespace addons\\mydemo\\Controller;

use think\\addons\\Controller;

class Action extends Controller
{
    public function link()
    {
        return $this->fetch();
    }
}`} />
                  </div>

                  <div id={'行为事件'} ref={sectionRefs[4]} className={'w-full'}>
                    <h3>{t("plugin.s11")}</h3>
                    {markdownify(t('plugin.s69'), 'p')}
                    <div className='table-wrapper'>
                      <table>
                        <thead className='thead'>
                        <tr>
                          <th>标签位</th>
                          <th>描述</th>
                          <th>类型说明</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td>app_init</td>
                          <td>应用初始化标签位</td>
                          <td>系统</td>
                        </tr>
                        <tr>
                          <td>app_begin</td>
                          <td>应用开始标签位</td>
                          <td>系统</td>
                        </tr>
                        <tr>
                          <td>module_init</td>
                          <td>模块初始化标签位</td>
                          <td>系统</td>
                        </tr>
                        <tr>
                          <td>action_begin</td>
                          <td>控制器开始标签位</td>
                          <td>系统</td>
                        </tr>
                        <tr>
                          <td>view_filter</td>
                          <td>视图输出过滤标签位</td>
                          <td>系统</td>
                        </tr>
                        <tr>
                          <td>app_end</td>
                          <td>应用结束标签位</td>
                          <td>系统</td>
                        </tr>
                        <tr>
                          <td>log_write</td>
                          <td>日志write方法标签位</td>
                          <td>系统</td>
                        </tr>
                        <tr>
                          <td>log_write_done</td>
                          <td>日志写入完成标签位</td>
                          <td>系统</td>
                        </tr>
                        <tr>
                          <td>response_end</td>
                          <td>输出结束标签位</td>
                          <td>系统</td>
                        </tr>
                        <tr>
                          <td>{`response_send<img width="200/" className="medium-zoom-image"/>`}</td>
                          <td>{`响应发送标签位 <img width="200/" className="medium-zoom-image"/>`}
                          </td>
                          <td>{`系统<img width="200/" className="medium-zoom-image"/>`}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className='info'>
                      <p className='title'>TIP</p>
                      {markdownify(t('plugin.s69'), 'p', 'message')}
                    </div>
                    <p className='text-black font-[500] text-[16px]'>{t('plugin.s71')}</p>
                    <ul className={'list'}>
                      {markdownify(t('plugin.s72'), 'li')}
                    </ul>
                    <InlineCode type={'php'} lines={14} code={`public function viewFilter(&$request)
    {
      if(ENTRANCE == "index"){ # 使用 ENTRANCE 判断是否为前台
         $isMobile = 0;
         $ua = strtolower($_SERVER['HTTP_USER_AGENT']);
         $uachar = "/(nokia|sony|ericsson|mot|samsung|sgh|lg|philips|panasonic|alcatel|lenovo|meizu|cldc|midp|iphone|wap|mobile|android)/i";
         if((preg_match($uachar, $ua))) {
            $isMobile = 1;
            echo '手机端';
         }else{
            echo '电脑端';   
         }
      } 
    }`} />
                    <p className='text-black font-[500] text-[16px]'>{t('plugin.s73')}</p>
                    <InlineCode type={'html'} lines={1} code={`<div>{:hook('mydemohook', ['id'=>1])}</div>`} />
                    {markdownify(t('plugin.s74'), 'p',)}
                    <InlineCode type={'php'} lines={1} code={`hook('mydemohook', ['id'=>1])`} />
                    <p>{t('plugin.s75')}</p>
                    <div className="inline-code">
                    <pre>
                      <code>{`maccms
 └─ addons
 │   └─mydemo
 │      └─controller
 │      │   └─Action.php
 │      │─view
 │      │   └─action
 │      │       └─link.html
 │      │─config.php
 │      │─info.ini
 │      │─Mydemo.php
 │─application
 │─thinkphp
 │─extend
 │─vendor`}</code>
                    </pre>
                      <CodeLineNumbers lines={15}/>
                      <div className="code-type"></div>
                    </div>
                  </div>

                  {/* Page */}
                  <div className="pager">
                    <Link href="/plugin/plugin-dir" className="flex flex-row items-center gap-[6px]">
                      <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                      <span className="text-primary text-[16px]">{t("plugin.s4")}</span>
                    </Link>
                    <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                    <Link href="/plugin/plugin-model" className="flex flex-row items-center gap-[6px]">
                      <span className="text-primary text-[16px] text-right">{t("plugin.s12")}</span>
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