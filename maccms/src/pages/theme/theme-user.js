import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useRef, useState } from "react";
import { useRouter } from "next/router";

import { markdownify } from "@/lib/utils/textConverter";
import { Scrollspy } from "@makotot/ghostui";
import ThemeSidebar from "@/layouts/theme/ThemeSidebar";
import ThemeLayout from "@/layouts/theme/ThemeLayout";
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
  ];

  

  return (
    <ThemeLayout title={`${t('theme.s10')} | ${t('seo.t.t0')}`} mobile_title={t("menu.theme")}>
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
                  <h2>{t("theme.s10")}</h2>
                  {markdownify(t('theme.usr.s1'), 'p')}
                  <ul className='list'>
                    {markdownify(t('theme.usr.s2'), 'li')}
                    {markdownify(t('theme.usr.s3'), 'li')}
                    {markdownify(t('theme.usr.s4'), 'li')}
                    {markdownify(t('theme.usr.s5'), 'li')}
                    {markdownify(t('theme.usr.s6'), 'li')}
                  </ul>
                </div>

                <div id={'用户字段'} ref={sectionRefs[1]} className={'w-full'}>
                  <h3>{t("theme.s80")}</h3>
                  <InlineCode type={''} lines={27} code={`{$obj.user_id} 用户id
  {$obj.group_id} 用户组id
  {$obj.group.group_name} 用户组
  {$obj.user_name} 用户名称
  {$obj.user_nick_name} 用户昵称
  {$obj.user_qq} 绑定qq
  {$obj.user_email} 绑定邮箱
  {$obj.user_phone} 绑定手机
  {$obj.user_status} 用户状态
  {$obj.user_portrait} 用户头像
  {$obj.user_portrait_thumb} 小头像
  {$obj.user_openid_qq} 登录qq
  {$obj.user_openid_weixin} 登录微信
  {$obj.user_question} 保密问题
  {$obj.user_answer} 保密答案
  {$obj.user_points} 用户积分
  {$obj.user_points_froze} 冻结积分
  {$obj.user_reg_time} 注册时间
  {$obj.user_reg_ip} 注册IP
  {$obj.user_login_time} 登录时间
  {$obj.user_login_ip} 登录IP
  {$obj.user_last_login_time} 上次登录时间
  {$obj.user_last_login_ip}int(10) 上次登录IP
  {$obj.user_login_num} 登录次数
  {$obj.user_pid} 一级分销
  {$obj.user_pid_2} 二级分销
  {$obj.user_pid_3} 三级分销`}/>
                  <div className='info'>
                    <p className='title'>TIP</p>
                    <p className='message'>{t('theme.usr.s7')}</p>
                  </div>
                </div>

                <div id={'全局调用'} ref={sectionRefs[2]} className={'w-full'}>
                  <h3>{t("theme.s81")}</h3>
                  <InlineCode type={''} lines={18} code={`   {$user.user_id} 用户编号
   {$user.user_name} 登录名
   {$user.user_nick_name} 昵称
   {$user.user_email} 邮箱
   {$user.user_qq}  QQ
   {$user.user_phone} 联系电话
   {$user.user_portrait}  头像
   {$user.user_points} 积分
   {$user.user_reg_time} 注册时间
   {$user.user_reg_ip} 注册ip
   {$user.user_login_time} 登录时间
   {$user.user_login_ip} 登录ip
   {$user.user_last_login_time} 上次登录时间
   {$user.user_last_login_ip} 上次登录ip
   {$user.user_login_num} 登录次数
   {$user.user_end_time} vip截止期限
   {$user.group_id}用户组编号
   ...`}/>
                </div>

                <div id={'用户登录'} ref={sectionRefs[3]} className={'w-full'}>
                  <h3>{t("theme.s82")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s8'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s9')}</h4>
                  <InlineCode type={'html'} lines={54} code={`<!-- 登录表单 -->
<form method="post" id="fm" action="">
   <h4>账户信息</h4>
   <div class="group">
      <label >账号</label>
      <input type="text" id="user_name" name="user_name"  placeholder="请输入您的登录账号">
   </div>
   <div class="group">
      <label>密码</label>
      <input type="password" id="user_pwd" name="user_pwd"  placeholder="请输入您的登录密码">
   </div>
   {if condition="$GLOBALS['config']['user']['login_verify'] eq 1"}
   <div class="group">
      <label>验证码</label>
      <input type="text" id="verify" name="verify" placeholder="请输入验证码">
      <img id="verify_img" src="{:url('verify/index')}" onClick="this.src=this.src+'?'"  alt="单击刷新" />
   </div>
   {/if}
   <input type="button" id="btn_submit"  value="立即登录">
</form>

<script type="text/javascript">
\t$(function(){
\t\t$("body").bind('keyup',function(event) {
\t\t\tif(event.keyCode==13){ $('#btnLogin').click(); }
\t\t});
\t\t$('#btn_submit').click(function() {
\t\t\tif ($('#user_name').val()  == '') { alert('请输入用户！'); $("#user_name").focus(); return false; }
\t\t\tif ($('#user_pwd').val()  == '') { alert('请输入密码！'); $("#user_pwd").focus(); return false; }
\t\t\tif ($('#verify').length> 0 && $('#verify').val()  == '') { alert('请输入验证码！'); $("#verify").focus(); return false; }
\t\t\t$.ajax({
\t\t\t\turl: "{:url('user/login')}",
\t\t\t\ttype: "post",
\t\t\t\tdataType: "json",
\t\t\t\tdata: $('#fm').serialize(),
\t\t\t\tbeforeSend: function () {
\t\t\t\t\t$("#btn_submit").css("background","#fd6a6a").val("loading...");
\t\t\t\t},
\t\t\t\tsuccess: function (r) {
\t\t\t\t\tif(r.code==1){
\t\t\t\t\t\tlocation.href="{:url('user/index')}";
\t\t\t\t\t}
\t\t\t\t\telse{
\t\t\t\t\t\talert(r.msg);
\t\t\t\t\t\t$('#verify_img').click();
\t\t\t\t\t}
\t\t\t\t},
\t\t\t\tcomplete: function () {
\t\t\t\t\t$("#btn_submit").css("background","#fa4646").val("立即登录");
\t\t\t\t}
\t\t\t});
\t\t});
\t});
</script>`}/>
                </div>

                <div id={'用户注册'} ref={sectionRefs[4]} className={'w-full'}>
                  <h3>{t("theme.s83")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s10'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s11')}</h4>
                  <InlineCode type={'html'} lines={141} code={`<form method="post" id="fm" action="">
   <h4>用户注册</h4>
   <div class="reg-group">
      <label>账号</label>
      <input type="text" id="user_name" name="user_name"  placeholder="请输入您的登录账号">
   </div>
   <div class="reg-group">
      <label>密码</label>
      <input type="password" id="user_pwd" name="user_pwd"  placeholder="请输入您的登录密码">
   </div>
   <div class="reg-group">
      <label>确认密码</label>
      <input type="password" id="user_pwd2" name="user_pwd2"  placeholder="请输入您的确认密码">
   </div>
   <!-- 判断后台是否开启手机注册 -->
   {if condition="$user_config.reg_phone_sms neq 0"}
   <input type="hidden" name="ac" value="phone">
   <div class="reg-group">
      <label>手机号码</label>
      <input type="text" id="to" name="to" placeholder="请输入手机号">
      <input type="button" class="fr mr10 mt10" id="btn_send_sms" value="获取验证码"/>
   </div>
   <div class="reg-group">
      <label>手机验证码</label>
      <input type="text" id="code" name="code" placeholder="请输入验证码">
   </div>
   <!-- 判断后台是否开启邮箱注册 -->
   {elseif condition="$user_config.reg_email_sms neq 0"}
   <input type="hidden" name="ac" value="email">
   <div class="reg-group">
      <label>邮箱地址</label>
      <input type="text" id="to" name="to" placeholder="请输入邮箱">
      <input type="button" class="fr mr10 mt10" id="btn_send_sms" value="获取验证码"/>
   </div>
   <div class="reg-group">
      <label>邮箱验证码</label>
      <input type="text" id="code" name="code" placeholder="请输入验证码">
   </div>
   {/if}
   <!-- 判断后台是否开始注册验证码 -->
   {if condition="$user_config.reg_verify neq 0"}
   <div class="reg-group">
      <label>验证码</label>
      <input type="text" id="verify" name="verify" placeholder="请输入验证码">
      <img class="fr mr10 mt10" id="verify_img" src="{:url('verify/index')}" onClick="this.src=this.src+'?'"  alt="单击刷新" />
   </div>
   {/if}
   <input type="button" id="btn_submit" class="btn-brand btn-sub" value="立即注册">
</form>

<script type="text/javascript">
    var countdown=60;
    function settime(val) {
        if (countdown == 0) {
            val.removeAttribute("disabled");
            val.value="获取验证码";
            countdown = 60;
            return true;
        } else {
            val.setAttribute("disabled", true);
            val.value="重新发送(" + countdown + ")";
            countdown--;
        }
        setTimeout(function() {settime(val) },1000)
    }
\t\t$("body").bind('keyup',function(event) {
\t\t\tif(event.keyCode==13){ $('#btnLogin').click(); }
\t\t});

        $('#btn_send_sms').click(function(){
            var ac = $('input[name="ac"]').val();
            var to = $('input[name="to"]').val();
            if(ac=='email') {
                var pattern = /^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$/;
                var ex = pattern.test(to);
                if (!ex) {
                    alert('邮箱格式不正确');
                    return;
                }
            }
            else if(ac=='phone') {
                var pattern=/^[1][0-9]{10}$/;
                var ex = pattern.test(to);
                if (!ex) {
                    alert('手机号格式不正确');
                    return;
                }
            }
            else{
                alert('参数错误');
                return;
            }

            settime(this);
            var data = $("#fm").serialize();

            $.ajax({
                url: "{:url('user/reg_msg')}",
                type: "post",
                dataType: "json",
                data: data,
                beforeSend: function () {
                    //开启loading
                },
                success: function (r) {
                    alert(r.msg);
                },
                complete: function () {
                    //结束loading
                }
            });
        });

\t\t$('#btn_submit').click(function() {
\t\t\tif ($('#user_name').val()  == '') { alert('请输入用户！'); $("#user_name").focus(); return false; }
\t\t\tif ($('#user_pwd').val()  == '') { alert('请输入密码！'); $("#user_pwd").focus(); return false; }
\t\t\tif ($('#verify').val()  == '') { alert('请输入验证码！'); $("#verify").focus(); return false; }

\t\t\t$.ajax({
\t\t\t\turl: "{:url('user/reg')}",
\t\t\t\ttype: "post",
\t\t\t\tdataType: "json",
\t\t\t\tdata: $('#fm').serialize(),
\t\t\t\tbeforeSend: function () {
\t\t\t\t\t$("#btn_submit").css("background","#fd6a6a").val("loading...");
\t\t\t\t},
\t\t\t\tsuccess: function (r) {
\t\t\t\t\talert(r.msg);
\t\t\t\t\tif(r.code==1){
\t\t\t\t\t\t// location.href="{:url('user/login')}";
\t\t\t\t\t}
\t\t\t\t\telse{
\t\t\t\t\t\t$('#verify_img').click();
\t\t\t\t\t}
\t\t\t\t},
\t\t\t\tcomplete: function () {
\t\t\t\t\t$("#btn_submit").css("background","#fa4646").val("立即注册");
\t\t\t\t}
\t\t\t});
\t\t});
</script>`}/>
                </div>

                <div id={'用户中心'} ref={sectionRefs[5]} className={'w-full'}>
                  <h3>{t("theme.s84")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s12'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s13')}</h4>
                  <InlineCode type={'html'} lines={21} code={`<div class="cur">
   <p><span >用户名：</span>{$obj.user_name}</p>
   <p><span >所属会员组：</span>{$obj.group.group_name}</p>
   <p><span >会员期限：</span>{$obj.user_end_time|mac_day}</p>
   <p><span >QQ号码：</span>{$obj.user_qq}</p>
   <p><span >Email地址：</span>{$obj.user_email}</p>
   <p><span >注册时间：</span>{$obj.user_reg_time|mac_day}</p>
   <p><span >登陆IP：</span>{$obj.user_login_ip|long2ip}</p>
   <p><span >登陆时间：</span>{$obj.user_login_time|mac_day}</p>
   <p><span >账户积分：</span>{$obj.user_points}</p>
   {if $GLOBALS['config']['user']['invite_reg_points'] gt 0}
   <p><span >推广注册链接：</span>
      <input id="url"  value="{$maccms.http_type}{$maccms.site_url}{:mac_url('user/reg')}?uid={$obj.user_id}" size="70" style="width:500px;">
   </p>
   {/if}
   {if $GLOBALS['config']['user']['invite_visit_points'] gt 0}
   <p><span >推广访问链接：</span>
      <input id="url2"  value="{$maccms.http_type}{$maccms.site_url}{:mac_url('user/visit')}?uid={$obj.user_id}" size="70" style="width:500px;">
   </p>
   {/if}
</div>`}/>
                </div>

                <div id={'修改信息'} ref={sectionRefs[6]} className={'w-full'}>
                  <h3>{t("theme.s85")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s14'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s15')}</h4>
                  <InlineCode type={'html'} lines={79} code={`<form id="fm" name="fm" method="post" action="" >
   <p><span >用户名：</span>{$obj.user_name}</p>
   <p><span >昵称：</span><input type="text" name="user_nick_name"  value="{$obj.user_nick_name}"></p>
   <p><span >原始密码：</span><input type="password" name="user_pwd" ></p>
   <p><span >新密码：</span><input type="password" name="user_pwd1" ><span class="tishi">不修改请留空</span></p>
   <p><span >重复密码：</span><input type="password" name="user_pwd2" ></p>
   <p><span >QQ号码：</span><input type="text" name="user_qq"  value="{$obj.user_qq}"></p>
   {if condition="$obj.user_email neq ''"}
      <p><span >邮箱：</span><input type="text" name="user_email"  readonly="readonly" value="{$obj.user_email}">[<a class="btn_unbind" ac="email" href="javascript:;">解绑</a>]</p>
   {else/}
      <p><span >邮箱：</span><input type="text" name="user_email"  value="">[<a href="{:url('user/bind')}?ac=email">绑定</a>]</p>
   {/if}

   {if condition="$obj.user_phone neq ''"}
   <p><span >手机：</span><input type="text" name="user_phone"  readonly="readonly" value="{$obj.user_phone}">[<a class="btn_unbind" ac="phone" href="javascript:;">解绑</a>]</p>
   {else/}
   <p><span >手机：</span><input type="text" name="user_phone"  value="">[<a href="{:url('user/bind')}?ac=phone">绑定</a>]</p>
   {/if}

   <p><span >找回密码问题：</span><input type="text" name="user_question"  value="{$obj.user_question}"></p>
   <p><span >找回密码答案：</span><input type="text" name="user_answer"  value="{$obj.user_answer}"></p>
   <p><span ></span><input type="button" id="btn_submit" class="search-button" value="保存">
   <span class="wjmm"><a href="{:url('user/findpass')}">忘记密码了？</a></span></p>
</form>

<script type="text/javascript">
\t$('.btn_unbind').click(function(){
\t\tvar ac = $(this).attr('ac');
\t\tif(ac!='email' && ac!='phone'){
\t\t\talert('参数错误');
\t\t}
\t\tif(confirm('确认解除绑定吗？此操作不可恢复？')) {
\t\t\t$.ajax({
\t\t\t\turl: "{:url('user/unbind')}",
\t\t\t\ttype: "post",
\t\t\t\tdataType: "json",
\t\t\t\tdata: {ac: ac},
\t\t\t\tbeforeSend: function () {
\t\t\t\t\t//开启loading
\t\t\t\t},
\t\t\t\tsuccess: function (r) {
\t\t\t\t\talert(r.msg);
\t\t\t\t\tif(r.code==1){
\t\t\t\t\t\tlocation.href="{:url('user/info')}";
\t\t\t\t\t}
\t\t\t\t},
\t\t\t\tcomplete: function () {
\t\t\t\t\t//结束loading
\t\t\t\t}
\t\t\t});
\t\t}
\t});

\t$("#btn_submit").click(function() {
\t\tvar data = $("#fm").serialize();
\t\t$.ajax({
\t\t\turl: "{:url('user/info')}",
\t\t\ttype: "post",
\t\t\tdataType: "json",
\t\t\tdata: data,
\t\t\tbeforeSend: function () {
\t\t\t\t//开启loading
\t\t\t\t//$(".loading_box").css("display","block");
\t\t\t\t$("#btn_submit").css("background","#fd6a6a").val("loading...");
\t\t\t},
\t\t\tsuccess: function (r) {
\t\t\t\talert(r.msg);
\t\t\t\tif(r.code==1){
\t\t\t\t\tlocation.href="{:url('user/info')}";
\t\t\t\t}
\t\t\t},
\t\t\tcomplete: function () {
\t\t\t\t//结束loading
\t\t\t\t//$(".loading_box").css("display","none");
\t\t\t\t$("#btn_submit").css("background","#fa4646").val("提交");
\t\t\t}
\t\t});
\t});
</script>`}/>
                </div>

                <div id={'用户权限'} ref={sectionRefs[7]} className={'w-full'}>
                  <h3>{t("theme.s86")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s16'), 'li')}
                    {markdownify(t('theme.usr.s17'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s18')}</h4>
                  <InlineCode type={'html'} lines={25} code={`{volist name="type_tree" id="vo"}
   <p>
   <span class="quanxian">{$vo.type_name}</span>
   {foreach name="$vo.popedom" id="v2"}
      {if condition="$v2 eq 1"}
         <span class="you">{$key}</span>
      {else}
         <span class="wu">{$key}</span>
      {/if}
   {/foreach}
   </p>
   <p>
   <!-- 子分类权限 -->
   {volist name="vo.child" id="child"}
      <span class="quanxian">{$child.type_name}</span>
      {foreach name="$child.popedom" id="v2"}
         {if condition="$v2 eq 1"}
            <span class="you">{$key}</span>
         {else}
            <span class="wu">{$key}</span>
         {/if}
      {/foreach}
      </p>
   {/volist}
{/volist}`}/>
                </div>

                <div id={'我的播放'} ref={sectionRefs[8]} className={'w-full'}>
                  <h3>{t("theme.s87")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s19'), 'li')}
                    {markdownify(t('theme.usr.s20'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s21')}</h4>
                  <InlineCode type={'html'} lines={52} code={`<table width="770" border="0" cellspacing="1" cellpadding="0" class="table">
   <tr>
      <td width="66" height="36" align="center" valign="middle" bgcolor="#f7f7f7">选择</td>
      <td width="80" align="center" valign="middle" bgcolor="#f7f7f7">编号</td>
      <td width="317" align="center" valign="middle" bgcolor="#f7f7f7">名称</td>
      <td width="120" align="center" valign="middle" bgcolor="#f7f7f7">进度</td>
      <td width="100" align="center" valign="middle" bgcolor="#f7f7f7">消费积分</td>
      <td width="80" align="center" valign="middle" bgcolor="#f7f7f7">操作</td>
   </tr>
   <form id="form1" name="form1" method="post">
      {volist name="list" id="vo"}
      <tr>
         <td height="36" align="center" valign="middle" bgcolor="#FFFFFF"><input name="ids[]" type="checkbox" value="{$vo.ulog_id}"></td>
         <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.ulog_id}</td>
         <td align="left" valign="middle" bgcolor="#FFFFFF" class="pad">[{$vo.data.type.type_name}] {$vo.data.name} [{$vo.ulog_rid}-{$vo.ulog_sid}-{$vo.ulog_nid}]</td>
         <td align="center" valign="middle" bgcolor="#FFFFFF"><a target="_blank" href="{$vo.data.link}" class="fen">重新观看</a></td>
         <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.ulog_points}</td>
         <td align="center" valign="middle" bgcolor="#FFFFFF"><a href="javascript:;" onclick="delData({$vo.ulog_id})" class="delete">删除</a></td>
      </tr>
      {/volist}
   </form>
</table>
<!-- 删除记录脚本 -->
<script>
\tfunction delData(ids,all){
\t\tvar msg ='删除';
\t\tif(all==1){
\t\t\tmsg='清空';
\t\t}
\t\tif(confirm('确定要'+msg+'记录吗')){
\t\t\t$.post("{:url('user/ulog_del')}",{ids:ids,type:4,all:all},function(data) {
\t\t\t\tif (data.code == '1') {
\t\t\t\t\talert('删除成功');
\t\t\t\t\tlocation.reload();
\t\t\t\t}else {
\t\t\t\t\talert('删除失败：' + data.msg);
\t\t\t\t}
\t\t\t}, 'json')
\t\t}
\t}
\t$("#btnClear").click(function(){
\t\tdelData('',1);
\t});
\t$("#btnDel").click(function(){
\t\tvar ids = MAC.CheckBox.Ids('ids[]');
\t\tif(ids==''){
\t\t\talert("请至少选择一个数据");
\t\t\treturn;
\t\t}
\t\tdelData(ids,0);
\t});
</script>`}/>
                </div>

                <div id={'我的下载'} ref={sectionRefs[9]} className={'w-full'}>
                  <h3>{t("theme.s88")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s22'), 'li')}
                    {markdownify(t('theme.usr.s23'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s24')}</h4>
                  <InlineCode type={'html'} lines={52} code={`<table width="770" border="0" cellspacing="1" cellpadding="0" class="table">
   <tr>
      <td width="66" height="36" align="center" valign="middle" bgcolor="#f7f7f7">选择</td>
      <td width="80" align="center" valign="middle" bgcolor="#f7f7f7">编号</td>
      <td width="317" align="center" valign="middle" bgcolor="#f7f7f7">名称</td>
      <td width="120" align="center" valign="middle" bgcolor="#f7f7f7">进度</td>
      <td width="100" align="center" valign="middle" bgcolor="#f7f7f7">消费积分</td>
      <td width="80" align="center" valign="middle" bgcolor="#f7f7f7">操作</td>
   </tr>
   <form id="form1" name="form1" method="post">
      {volist name="list" id="vo"}
      <tr>
\t\t\t<td height="36" align="center" valign="middle" bgcolor="#FFFFFF"><input name="ids[]" type="checkbox" value="{$vo.ulog_id}"></td>
\t\t\t<td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.ulog_id}</td>
\t\t\t<td align="left" valign="middle" bgcolor="#FFFFFF" class="pad">[{$vo.data.type.type_name}] {$vo.data.name} [{$vo.ulog_rid}-{$vo.ulog_sid}-{$vo.ulog_nid}]</td>
\t\t\t<td align="center" valign="middle" bgcolor="#FFFFFF"><a href="{$vo.data.link}" class="fen">重新下载</a></td>
\t\t\t<td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.ulog_points}</td>
\t\t\t<td align="center" valign="middle" bgcolor="#FFFFFF"><a href="" class="delete">删除</a></td>
\t\t  </tr>
      {/volist}
   </form>
</table>
<!-- 删除记录脚本 -->
<script>
\tfunction delData(ids,all){
\t\tvar msg ='删除';
\t\tif(all==1){
\t\t\tmsg='清空';
\t\t}
\t\tif(confirm('确定要'+msg+'记录吗')){
\t\t\t$.post("{:url('user/ulog_del')}",{ids:ids,type:5,all:all},function(data) {
\t\t\t\tif (data.code == '1') {
\t\t\t\t\talert('删除成功');
\t\t\t\t\tlocation.reload();
\t\t\t\t}else {
\t\t\t\t\talert('删除失败：' + data.msg);
\t\t\t\t}
\t\t\t}, 'json')
\t\t}
\t}
\t$("#btnClear").click(function(){
\t\tdelData('',1);
\t});
\t$("#btnDel").click(function(){
\t\tvar ids = MAC.CheckBox.Ids('ids[]');
\t\tif(ids==''){
\t\t\talert("请至少选择一个数据");
\t\t\treturn;
\t\t}
\t\tdelData(ids,0);
\t});
</script>`}/>
                </div>

                <div id={'我的收藏'} ref={sectionRefs[10]} className={'w-full'}>
                  <h3>{t("theme.s89")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s25'), 'li')}
                    {markdownify(t('theme.usr.s26'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s27')}</h4>
                  <InlineCode type={'html'} lines={61} code={`<table width="770" border="0" cellspacing="1" cellpadding="0" class="table">
   <tr>
      <td width="66" height="36" align="center" valign="middle" bgcolor="#f7f7f7">选择</td>
      <td width="80" align="center" valign="middle" bgcolor="#f7f7f7">编号</td>
      <td width="317" align="center" valign="middle" bgcolor="#f7f7f7">名称</td>
      <td width="120" align="center" valign="middle" bgcolor="#f7f7f7">进度</td>
      <td width="100" align="center" valign="middle" bgcolor="#f7f7f7">消费积分</td>
      <td width="80" align="center" valign="middle" bgcolor="#f7f7f7">操作</td>
   </tr>
   <form id="form1" name="form1" method="post">
      {volist name="list" id="vo"}
      \t{if condition="$vo.ulog_mid eq 1"}
         <tr>
            <td height="36" align="center" valign="middle" bgcolor="#FFFFFF">
            <input type="checkbox" name="ids[]" id="checkbox" value="{$vo.ulog_id}"/></td>
            <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.ulog_id}</td>
            <td align="left" valign="middle" bgcolor="#FFFFFF" class="pad">
               {if condition="$vo.ulog_mid eq 1"}
               <a target="_blank" href="{$vo.data.link}">[{$vo.data.type.type_name}] {$vo.data.name}</a>
               {elseif condition="$vo.ulog_mid eq 2"}
               <a target="_blank" href="{$vo.data.link}">[{$vo.data.type.type_name}] {$vo.data.name}</a>
               {elseif condition="$vo.ulog_mid eq 3"}
               <a target="_blank" href="{$vo.data.link}">{$vo.data.name}</a>
               {/if}
            </td>
            <td align="center" valign="middle" bgcolor="#FFFFFF"><a href="javascript:;" onclick="delData({$vo.ulog_id},0)" class="delete">删除</a></td>
         </tr>
\t\t  {/if}
      {/volist}
   </form>
</table>
<!-- 删除记录脚本 -->
<script>
\tfunction delData(ids,all){
\t\tvar msg ='删除';
\t\tif(all==1){
\t\t\tmsg='清空';
\t\t}
\t\tif(confirm('确定要'+msg+'记录吗')){
\t\t\t$.post("{:url('user/ulog_del')}",{ids:ids,type:2,all:all},function(data) {
\t\t\t\tif (data.code == '1') {
\t\t\t\t\talert('删除成功');
\t\t\t\t\tlocation.reload();
\t\t\t\t}else {
\t\t\t\t\talert('删除失败：' + data.msg);
\t\t\t\t}
\t\t\t}, 'json')
\t\t}
\t}
\t$("#btnClear").click(function(){
\t\tdelData('',1);
\t});
\t$("#btnDel").click(function(){
\t\tvar ids = MAC.CheckBox.Ids('ids[]');
\t\tif(ids==''){
\t\t\talert("请至少选择一个数据");
\t\t\treturn;
\t\t}
\t\tdelData(ids,0);
\t});
</script>`}/>
                </div>

                <div id={'在线充值'} ref={sectionRefs[11]} className={'w-full'}>
                  <h3>{t("theme.s90")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s28'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s29')}</h4>
                  <InlineCode type={'html'} lines={40} code={`<div class="line40">
   <p>充值的金额：<input type="text" name="price" value="{$config.min}" class="jifen-input"></p>
   <p><input type="button" id="btn_submit_pay" class="jifen2-button" value="确认"></p>
   <p class="hui">友情提示：最小充值金额为{$config.min}元，1元可以兑换{$config.scale}个积分</p>
</div>

<script>
   
\t$('#btn_submit_pay').click(function(){
\t\tvar that=$(this);
\t\tvar price = $("input[name='price']").val();
\t\tif(Number(price)<1){
\t\t\treturn;
\t\t}
\t\tif(confirm('确定要在线充值吗')) {
\t\t\t$.ajax({
\t\t\t\turl: "{:url('user/buy')}",
\t\t\t\ttype: "post",
\t\t\t\tdataType: "json",
\t\t\t\tdata: {price: price,flag:'pay'},
\t\t\t\tbeforeSend: function () {
\t\t\t\t\t$("#btn_submit_pay").css("background","#fd6a6a").val("loading...");
\t\t\t\t},
\t\t\t\tsuccess: function (r) {
\t\t\t\t\tif (r.code == 1) {
                  //生成订单后跳转支付页面
\t\t\t\t\t\tlocation.href="{:url('user/pay')}?order_code=" + r.data.order_code;
\t\t\t\t\t}
\t\t\t\t\telse{
\t\t\t\t\t\talert(r.msg);
\t\t\t\t\t}
\t\t\t\t},
\t\t\t\tcomplete: function () {
\t\t\t\t\t$("#btn_submit_pay").css("background","#fa4646").val("提交");
\t\t\t\t}
\t\t\t});
\t\t}
\t});

</script>`}/>
                  <h4>{t('theme.usr.s30')}</h4>
                  <InlineCode type={'html'} lines={39} code={`<div class="line40">
   <p>充值卡号：<input type="text" name="card_no" value="" class="jifen-input">
      {if condition="$GLOBALS['config']['pay']['card']['url'] neq ''"}
      <a target="_blank" href="{$GLOBALS['config']['pay']['card']['url']}">点击购买卡密</a>
      {/if}
   </p>
   <p>充值密码：<input type="text" name="card_pwd" value="" class="jifen-input"></p>
   <p><input type="button" id="btn_submit_card" class="jifen2-button" value="确认"></p>
   <p class="hui">友情提示：请到卡密平台购买充值卡</p>
</div>

<script>
   $('#btn_submit_card').click(function(){
\t\tvar that=$(this);
\t\tvar no = $('input[name="card_no"]').val();
\t\tvar pwd = $('input[name="card_pwd"]').val();
\t\tif(no=='' || pwd==''){
\t\t\talert('请输入充值卡号和密码');
\t\t\treturn;
\t\t}
\t\tif(confirm('确定要使用充值卡充值吗')) {
\t\t\t$.ajax({
\t\t\t\turl: "{:url('user/buy')}",
\t\t\t\ttype: "post",
\t\t\t\tdataType: "json",
\t\t\t\tdata: {card_no: no,card_pwd:pwd,flag:'card'},
\t\t\t\tbeforeSend: function () {
\t\t\t\t\t$("#btn_submit_card").css("background","#fd6a6a").val("loading...");
\t\t\t\t},
\t\t\t\tsuccess: function (r) {
\t\t\t\t\talert(r.msg);
\t\t\t\t},
\t\t\t\tcomplete: function () {
\t\t\t\t\t$("#btn_submit_card").css("background","#fa4646").val("提交");
\t\t\t\t}
\t\t\t});
\t\t}
\t});
</script>`}/>
                </div>

                <div id={'支付页面'} ref={sectionRefs[12]} className={'w-full'}>
                  <h3>{t("theme.s91")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s31'), 'li')}
                  </ul>
                  <p>{t('theme.usr.s32')}</p>
                  <h4>{t('theme.usr.s33')}</h4>
                  <InlineCode type={'html'} lines={51} code={`<form method="post" target="_blank" action="{:url('user/gopay')}">
   <input type="hidden" name="order_id" value="{$info.order_id}">
   <input type="hidden" name="order_code" value="{$info.order_code}">
   <div class="line40">
      <p><span class="xiang">订单编号：</span>{$info.order_code}</p>
      <p><span class="xiang">订单金额：</span>{$info.order_price}元</p>
      <p>
         <span class="xiang">支付方式：</span>
         <select name="payment" id="payment">
            <option value ="">请选择...</option>
            {volist name="ext_list" id="vo"}
            <option value="{$key}">{$vo}支付</option>
            {/volist}
         </select>
      </p>

      <p class="info-item" id="paytype_box" style="display:none;">
         <span class="xiang">支付类型：</span>
         <select class="paytype" id="paytype" name="paytype">
         </select>
      </p>

      <p><input type="submit" id="btn_submit" class="jifen2-button" value="确认"></p>
   </div>
</form>

<script>
\tvar codepay_type = '{maccms:foreach name=":explode(',',$config.codepay.type)"}<option value ="{$vo}">{if condition="$vo==1"}支付宝二维码{elseif condition="$vo==2"/}QQ钱包二维{elseif condition="$vo==3"/}微信二维码{/if}</option>{/maccms:foreach}';
\tvar zhapay_type ='{maccms:foreach name=":explode(',',$config.zhapay.type)"}<option value ="{$vo}">{if condition="$vo==1"}微信{elseif condition="$vo==2"/}支付宝{/if}</option> {/maccms:foreach}';
 
\t$("#payment").change(function() {
\t\t$('#paytype').html('');
\t\tif($("#payment").val()=="codepay" || $("#payment").val()=="zhapay" || $("#payment").val()=="Pkfaka"){
\t\t\tif($("#payment").val()=="codepay") {
\t\t\t\t$('#paytype').html(codepay_type);
\t\t\t}
\t\t\tif($("#payment").val()=="zhapay") {
\t\t\t\t$('#paytype').html(zhapay_type);
\t\t\t}
         
\t\t\t$("#paytype_box").slideDown();
\t\t}
\t\telse{
\t\t\t$("#paytype_box").slideUp();
\t\t}
\t});

\t$(".paytype").change(function() {
\t\t$('#paytype').val( $(this).val() );
\t});
</script>`}/>
                </div>

                <div id={'微信充值'} ref={sectionRefs[13]} className={'w-full'}>
                  <h3>{t("theme.s92")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s34'), 'li')}
                  </ul>
                  <p>{t('theme.usr.s35')}</p>
                  <h4>{t('theme.usr.s36')}</h4>
                  <InlineCode type={'html'} lines={24} code={`<form method="post" target="_blank" action="{:url('user/gopay')}">
   <input type="hidden" name="order_id" value="{$info.order_id}">
   <input type="hidden" name="order_code" value="{$info.order_code}">
   <div class="line40">
      <p><span class="xiang">订单编号：</span>{$order.order_code}</p>
      <p><span class="xiang">订单金额：</span>{$order.order_price}元</p>
      <p><img src="{:url('user/qrcode')}?data={$payment.code_url|urlencode}" width="150" height="150"/></p>
      <p>打开微信，扫码支付</p>
   </div>
</form>

<script>
\tfunction check(){
\t\t$.get("{:url('user/order_info')}" + '?order_id={$order.order_id}', function(data){
\t\t\tif(data.info.order_status == 1){
\t\t\t\talert('支付完成，即将跳转到会员中心');
\t\t\t\twindow.location.href = "{:url('user/index')}";
\t\t\t}
\t\t});
\t}
\t$(function(){
\t\tsetInterval(function(){check()}, 5000);  //5秒查询一次支付是否成功
\t})
</script>`}/>
                </div>

                <div id={'订单记录'} ref={sectionRefs[14]} className={'w-full'}>
                  <h3>{t("theme.s93")}</h3>
                  <p>{t('theme.usr.s37')}</p>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s38'), 'li')}
                    {markdownify(t('theme.usr.s39'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s40')}</h4>
                  <InlineCode type={'html'} lines={24} code={`<table width="870" border="0" cellspacing="1" cellpadding="0" class="table">
   <tr>
   <td width="66" height="36" align="center" valign="middle" bgcolor="#f7f7f7">选择</td>
   <td width="60" align="center" valign="middle" bgcolor="#f7f7f7">编号</td>
   <td width="300" align="center" valign="middle" bgcolor="#f7f7f7">单号</td>
   <td width="60" align="center" valign="middle" bgcolor="#f7f7f7">状态</td>
      <td width="60" align="center" valign="middle" bgcolor="#f7f7f7">金额</td>
      <td width="60" align="center" valign="middle" bgcolor="#f7f7f7">积分</td>
   <td width="150" align="center" valign="middle" bgcolor="#f7f7f7">时间</td>
   <td width="80" align="center" valign="middle" bgcolor="#f7f7f7">操作</td>
   </tr>
   {volist name="list" id="vo"}
   <tr>
      <td height="36" align="center" valign="middle" bgcolor="#FFFFFF"><input name="ids[]" type="checkbox" value="{$vo.order_id}"></td>
      <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.order_id}</td>
      <td align="left" valign="middle" bgcolor="#FFFFFF" class="pad">{$vo.order_code}</td>
      <td align="center" valign="middle" bgcolor="#FFFFFF">{if condition="$vo.order_status eq 1"}已支付{else}未支付{/if}</td>
      <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.order_price}</td>
         <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.order_points}</td>
         <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.order_time|mac_day}</td>
      <td align="center" valign="middle" bgcolor="#FFFFFF">{if condition="$vo.order_status eq 0"}<a href="{:url('user/pay')}?order_code={$vo.order_code}" class="delete">支付</a>{/if}</td>
   </tr>
   {/volist}
</table>`}/>
                </div>

                <div id={'卡密记录'} ref={sectionRefs[15]} className={'w-full'}>
                  <h3>{t("theme.s94")}</h3>
                  <p>{t('theme.usr.s41')}</p>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s42'), 'li')}
                    {markdownify(t('theme.usr.s43'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s44')}</h4>
                  <InlineCode type={'html'} lines={22} code={`<table width="870" border="0" cellspacing="1" cellpadding="0" class="table">
   <tr>
      <td width="66" height="36" align="center" valign="middle" bgcolor="#f7f7f7">选择</td>
      <td width="60" align="center" valign="middle" bgcolor="#f7f7f7">编号</td>
      <td width="300" align="center" valign="middle" bgcolor="#f7f7f7">卡号</td>
      <td width="60" align="center" valign="middle" bgcolor="#f7f7f7">面值</td>
      <td width="60" align="center" valign="middle" bgcolor="#f7f7f7">积分</td>
      <td width="150" align="center" valign="middle" bgcolor="#f7f7f7">使用时间</td>
      <td width="80" align="center" valign="middle" bgcolor="#f7f7f7">操作</td>
   </tr>
   {volist name="list" id="vo"}
   <tr>
      <td height="36" align="center" valign="middle" bgcolor="#FFFFFF"><input name="ids[]" type="checkbox" value="{$vo.card_id}"></td>
      <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.card_id}</td>
      <td align="left" valign="middle" bgcolor="#FFFFFF" class="pad">{$vo.card_no}</td>
      <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.card_money}</td>
      <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.card_points}</td>
      <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.card_use_time|mac_day}</td>
      <td align="center" valign="middle" bgcolor="#FFFFFF"></td>
   </tr>
   {/volist}
</table>`}/>
                </div>

                <div id={'积分记录'} ref={sectionRefs[16]} className={'w-full'}>
                  <h3>{t("theme.s95")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s45'), 'li')}
                    {markdownify(t('theme.usr.s46'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s47')}</h4>
                  <InlineCode type={'html'} lines={23} code={`<table width="770" border="0" cellspacing="1" cellpadding="0" class="table">
   <tr>
      <td width="66" height="36" align="center" valign="middle" bgcolor="#f7f7f7">选择</td>
      <td width="80" align="center" valign="middle" bgcolor="#f7f7f7">编号</td>
      <td width="100" align="center" valign="middle" bgcolor="#f7f7f7">分类</td>
      <td width="100" align="center" valign="middle" bgcolor="#f7f7f7">积分</td>
      <td width="140" align="center" valign="middle" bgcolor="#f7f7f7">时间</td>
      <td width="80" align="center" valign="middle" bgcolor="#f7f7f7">操作</td>
   </tr>
   <form id="form1" name="form1" method="post">
      {volist name="list" id="vo"}
      <tr>
         <td height="36" align="center" valign="middle" bgcolor="#FFFFFF">
         <input type="checkbox" name="ids[]" id="checkbox" value="{$vo.plog_id}"/></td>
         <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.plog_id}</td>
         <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.plog_type|mac_get_plog_type_text}</td>
         <td align="center" valign="middle" bgcolor="#FFFFFF">{if condition="in_array($vo.plog_type,[1,2,3,4])"}+{else/}-{/if}{$vo.plog_points}</td>
            <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.plog_time|mac_day}</td>
         <td align="center" valign="middle" bgcolor="#FFFFFF"><a href="javascript:;" onclick="delData({$vo.plog_id},0)" class="delete">删除</a></td>
      </tr>
      {/volist}
   </form>
</table>`}/>
                </div>

                <div id={'提现记录'} ref={sectionRefs[17]} className={'w-full'}>
                  <h3>{t("theme.s96")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s48'), 'li')}
                    {markdownify(t('theme.usr.s49'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s50')}</h4>
                  <InlineCode type={'html'} lines={58} code={`<form id="fm" name="fm" method="post" action="" >
   <p>1元等于{$GLOBALS['config']['user']['cash_ratio']}积分，最低提现金额：{$GLOBALS['config']['user']['cash_min']}元</p>
   <p>剩余{$GLOBALS['user']['user_points']}积分，相当于{$GLOBALS['user']['user_points']/$GLOBALS['config']['user']['cash_ratio']}元；冻结{$GLOBALS['user']['user_points_froze']}积分，相当于{$GLOBALS['user']['user_points_froze']/$GLOBALS['config']['user']['cash_ratio']}元；</p>

   银行名称：<input type="text" name="cash_bank_name"  placeholder="请输入开户行名称或支付宝微信" value="">
   银行账号：<input type="text" name="cash_bank_no" placeholder="请输入银行卡号或支付宝微信账号"  value="">

   收款姓名：<input type="text" name="cash_payee_name"  placeholder="请输入收款人姓名与上方账户对应"  value="">提现金额：<input type="text" name="cash_money"  placeholder="请输入提现金额"  value="">
   <input type="button" id="btn_submit"  value="提交" style="margin: 5px;">
</form>

<script>
$("#btn_submit").click(function() {
   var cash_bank_name = $('input[name="cash_bank_name"]').val();
   if(cash_bank_name==''){
      alert('请输入银行名称');
      return;
   }
   var cash_bank_no = $('input[name="cash_bank_no"]').val();
   if(cash_bank_no==''){
      alert('请输入银行账户');
      return;
   }
   var cash_payee_name = $('input[name="cash_payee_name"]').val();
   if(cash_payee_name==''){
      alert('请输入收款人姓名');
      return;
   }
   var cash_money = $('input[name="cash_money"]').val();
   if(cash_money==''){
      alert('请输入提现金额');
      return;
   }
   var data = $("#fm").serialize();
   $.ajax({
      url: "{:url('user/cash')}",
      type: "post",
      dataType: "json",
      data: data,
      beforeSend: function () {
            //开启loading
            //$(".loading_box").css("display","block");
            $("#btn_submit").css("background","#fd6a6a").val("loading...");
      },
      success: function (r) {
            alert(r.msg);
            if(r.code==1){
               location.href="{:url('user/cash')}";
            }
      },
      complete: function () {
            //结束loading
            //$(".loading_box").css("display","none");
            $("#btn_submit").css("background","#fa4646").val("提交");
      }
   });
});
</script>`}/>
                  <h4>{t('theme.usr.s51')}</h4>
                  <InlineCode type={'html'} lines={56} code={`
<table width="770" border="0" cellspacing="1" cellpadding="0" class="table">
   <tr>
      <td width="66" height="36" align="center" valign="middle" bgcolor="#f7f7f7">选择</td>
      <td width="80" align="center" valign="middle" bgcolor="#f7f7f7">编号</td>
      <td width="100" align="center" valign="middle" bgcolor="#f7f7f7">提现积分</td>
      <td width="100" align="center" valign="middle" bgcolor="#f7f7f7">提现金额</td>
      <td width="100" align="center" valign="middle" bgcolor="#f7f7f7">状态</td>
      <td width="140" align="center" valign="middle" bgcolor="#f7f7f7">时间</td>
      <td width="80" align="center" valign="middle" bgcolor="#f7f7f7">操作</td>
   </tr>
   <form id="form1" name="form1" method="post">
      {volist name="list" id="vo"}
      <tr>
         <td height="36" align="center" valign="middle" bgcolor="#FFFFFF">
         <input type="checkbox" name="ids[]" id="checkbox" value="{$vo.cash_id}"/></td>
         <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.cash_id}</td>
         <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.cash_points}</td>
         <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.cash_money}</td>
         <td align="center" valign="middle" bgcolor="#FFFFFF">{if condition="$vo.cash_status eq '1'"}已审核{else/}未审核{/if}</td>
         <td align="center" valign="middle" bgcolor="#FFFFFF">{$vo.cash_time|mac_day}</td>
         <td align="center" valign="middle" bgcolor="#FFFFFF"><a href="javascript:;" onclick="delData({$vo.cash_id},0)" class="delete">删除</a></td>
      </tr>
      {/volist}
   </form>
</table>

<script>
   \tfunction delData(ids,all){
\t\tvar msg ='删除';
\t\tif(all==1){
\t\t\tmsg='清空';
\t\t}
\t\tif(confirm('确定要'+msg+'记录吗')){
\t\t\t$.post("{:url('user/cash_del')}",{ids:ids,all:all},function(data) {
\t\t\t\tif (data.code == '1') {
\t\t\t\t\talert('删除成功');
\t\t\t\t\tlocation.reload();
\t\t\t\t}else {
\t\t\t\t\talert('删除失败：' + data.msg);
\t\t\t\t}
\t\t\t}, 'json')
\t\t}
\t}
\t$("#btnClear").click(function(){
\t\tdelData('',1);
\t});
\t$("#btnDel").click(function(){
\t\tvar ids = MAC.CheckBox.Ids('ids[]');
\t\tif(ids==''){
\t\t\talert("请至少选择一个数据");
\t\t\treturn;
\t\t}
\t\tdelData(ids,0);
\t});
</script>`}/>
                </div>

                <div id={'分销记录'} ref={sectionRefs[18]} className={'w-full'}>
                  <h3>{t("theme.s97")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s52'), 'li')}
                    {markdownify(t('theme.usr.s53'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s54')}</h4>
                  <InlineCode type={'html'} lines={52} code={` <!-- BEGIN row -->
{volist name="group_list" id="vo"}
   {if condition="$vo.group_id gt 2 && $vo.group_status eq 1"}
   <div class="huang grade"  data-id="{$vo.group_id}" data-name="{$vo.group_name}" data-points="{$vo.group_points_day}" data-long="day">
      {$vo.group_name}-包天：{$vo.group_points_day}积分
   </div>

   <div class="lan grade"  data-id="{$vo.group_id}" data-name="{$vo.group_name}" data-points="{$vo.group_points_week}" data-long="week">
      {$vo.group_name}-包周：{$vo.group_points_week}积分
   </div>

  <div class="hong grade"  data-id="{$vo.group_id}" data-name="{$vo.group_name}" data-points="{$vo.group_points_month}" data-long="month">
      {$vo.group_name}-包月：{$vo.group_points_month}积分
  </div>

  <div class="zi grade"  data-id="{$vo.group_id}" data-name="{$vo.group_name}" data-points="{$vo.group_points_year}" data-long="year">
      {$vo.group_name}-包年：{$vo.group_points_year}积分
   </div>
{/if}
{/volist}
<!-- END row -->

<script>\t
$('.grade').click(function(){
   var that=$(this);
   var group_id = that.attr('data-id');
   var group_name = that.attr('data-name');
   var long = that.attr('data-long');
   var points = that.attr('data-points');

   if(confirm('确定要升级到【'+group_name+'】吗,需要花费【'+points+'】积分')) {
      $.ajax({
         url: "{:url('user/upgrade')}",
         type: "post",
         dataType: "json",
         data: {group_id: group_id,long:long },
         beforeSend: function () {
            $("#btn_submit").css("background","#fd6a6a").val("loading...");
         },
         success: function (r) {
            alert(r.msg);
            if (r.code == 1) {
               location.reload();
            }
         },
         complete: function () {
            $("#btn_submit").css("background","#fa4646").val("提交");
         }
      });
   }
});
</script>`}/>
                </div>

                <div id={'升级会员'} ref={sectionRefs[19]} className={'w-full'}>
                  <h3>{t("theme.s98")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s58'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s59')}</h4>
                  <InlineCode type={'html'} lines={52} code={`<!-- BEGIN row -->
{volist name="group_list" id="vo"}
   {if condition="$vo.group_id gt 2 && $vo.group_status eq 1"}
   <div class="huang grade"  data-id="{$vo.group_id}" data-name="{$vo.group_name}" data-points="{$vo.group_points_day}" data-long="day">
      {$vo.group_name}-包天：{$vo.group_points_day}积分
   </div>

   <div class="lan grade"  data-id="{$vo.group_id}" data-name="{$vo.group_name}" data-points="{$vo.group_points_week}" data-long="week">
      {$vo.group_name}-包周：{$vo.group_points_week}积分
   </div>

  <div class="hong grade"  data-id="{$vo.group_id}" data-name="{$vo.group_name}" data-points="{$vo.group_points_month}" data-long="month">
      {$vo.group_name}-包月：{$vo.group_points_month}积分
  </div>

  <div class="zi grade"  data-id="{$vo.group_id}" data-name="{$vo.group_name}" data-points="{$vo.group_points_year}" data-long="year">
      {$vo.group_name}-包年：{$vo.group_points_year}积分
   </div>
{/if}
{/volist}
<!-- END row -->

<script>\t
$('.grade').click(function(){
   var that=$(this);
   var group_id = that.attr('data-id');
   var group_name = that.attr('data-name');
   var long = that.attr('data-long');
   var points = that.attr('data-points');

   if(confirm('确定要升级到【'+group_name+'】吗,需要花费【'+points+'】积分')) {
      $.ajax({
         url: "{:url('user/upgrade')}",
         type: "post",
         dataType: "json",
         data: {group_id: group_id,long:long },
         beforeSend: function () {
            $("#btn_submit").css("background","#fd6a6a").val("loading...");
         },
         success: function (r) {
            alert(r.msg);
            if (r.code == 1) {
               location.reload();
            }
         },
         complete: function () {
            $("#btn_submit").css("background","#fa4646").val("提交");
         }
      });
   }
});
</script>`}/>
                </div>

                <div id={'绑定信息'} ref={sectionRefs[19]} className={'w-full'}>
                  <h3>{t("theme.s99")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s55'), 'li')}
                    {markdownify(t('theme.usr.s60'), 'li')}
                  </ul>
                  <h4>{t('theme.usr.s57')}</h4>
                  <InlineCode type={'html'} lines={130} code={`<h1>绑定{if condition="$ac eq 'phone'"}手机{else/}邮箱{/if}</h1>
<form id="fm" name="fm" method="post" action="" >
   <input type="hidden" name="ac" value="{$ac}">
   {if condition="$ac eq 'phone'"}手机{else/}邮箱{/if}：
   <input type="text" name="to" class="member-input" value="">

   <input type="button" id="btn_bind_send" value="获取验证码"/>

   验证码：</span><input type="text" name="code" class="member-input" value="">

   <input type="button" id="btn_submit" class="search-button" value="确认绑定">
</form>
<script type="text/javascript">
\tvar countdown=60;
\tfunction settime(val) {
\t\tif (countdown == 0) {
\t\t\tval.removeAttribute("disabled");
\t\t\tval.value="获取验证码";
\t\t\tcountdown = 60;
\t\t\treturn true;
\t\t} else {
\t\t\tval.setAttribute("disabled", true);
\t\t\tval.value="重新发送(" + countdown + ")";
\t\t\tcountdown--;
\t\t}
\t\tsetTimeout(function() {settime(val) },1000)
\t} 

\t$('#btn_bind_send').click(function(){
\t    var ac = $('input[name="ac"]').val();
\t\tvar to = $('input[name="to"]').val();
\t\tif(ac=='email') {
            var pattern = /^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$/;
            var ex = pattern.test(to);
            if (!ex) {
                alert('邮箱格式不正确');
                return;
            }
        }
        else if(ac=='phone') {
            var pattern=/^[1][0-9]{10}$/;
            var ex = pattern.test(to);
            if (!ex) {
                alert('手机号格式不正确');
                return;
            }
        }
\t\telse{
\t\t    alert('参数错误');
\t\t\treturn;
\t\t}


\t\tsettime(this);
\t\tvar data = $("#fm").serialize();

\t\t$.ajax({
\t\t\turl: "{:url('user/bindmsg')}",
\t\t\ttype: "post",
\t\t\tdataType: "json",
\t\t\tdata: data,
\t\t\tbeforeSend: function () {
\t\t\t\t//开启loading
\t\t\t},
\t\t\tsuccess: function (r) {
\t\t\t\talert(r.msg);
\t\t\t},
\t\t\tcomplete: function () {
\t\t\t\t//结束loading
\t\t\t}
\t\t});
\t});

\t$("#btn_submit").click(function() {
        var ac = $('input[name="ac"]').val();
        var to = $('input[name="to"]').val();

        if(ac=='email') {
            var pattern = /^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$/;
            var ex = pattern.test(to);
            if (!ex) {
                alert('邮箱格式不正确');
                return;
            }
        }
        else if(ac=='phone') {
            var pattern=/^[1][0-9]{10}$/;
            var ex = pattern.test(to);
            if (!ex) {
                alert('手机号格式不正确');
                return;
            }
        }
        else{
            alert('参数错误');
            return;
        }

\t\tvar code = $('input[name="code"]').val();
\t\tif(code==''){
\t\t\talert('请输入验证码');
\t\t\treturn;
\t\t}
\t\tvar data = $("#fm").serialize();

\t\t$.ajax({
\t\t\turl: "{:url('user/bind')}",
\t\t\ttype: "post",
\t\t\tdataType: "json",
\t\t\tdata: data,
\t\t\tbeforeSend: function () {
\t\t\t\t//开启loading
\t\t\t\t//$(".loading_box").css("display","block");
\t\t\t\t$("#btn_submit").css("background","#fd6a6a").val("loading...");
\t\t\t},
\t\t\tsuccess: function (r) {
\t\t\t\talert(r.msg);
\t\t\t\tif(r.code==1){
\t\t\t\t\tlocation.href="{:url('user/info')}";
\t\t\t\t}
\t\t\t},
\t\t\tcomplete: function () {
\t\t\t\t//结束loading
\t\t\t\t//$(".loading_box").css("display","none");
\t\t\t\t$("#btn_submit").css("background","#fa4646").val("提交");
\t\t\t}
\t\t});
\t});

</script>`}/>
                </div>

                <div id={'找回密码'} ref={sectionRefs[20]} className={'w-full'}>
                  <h3>{t("theme.s100")}</h3>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s61'), 'li')}
                    <h4>{t('theme.usr.s62')}</h4>
                    <InlineCode type={'html'} lines={66} code={`<form method="post" id="fm" action="">
   <h4>预留问题找回密码</h4>
   <div class="reg-group">
      <label class="bd-r" >账号</label>
      <input type="text" id="user_name" name="user_name"  placeholder="请输入您的登录账号">
   </div>
   <div class="reg-group">
      <label>找回问题</label>
      <input type="text" id="user_question" name="user_question"  placeholder="请输入您密码找回问题">
   </div>
   <div class="reg-group">
      <label>找回答案</label>
      <input type="text" id="user_answer" name="user_answer"  placeholder="请输入您的密码找回答案">
   </div>
   <div class="reg-group">
      <label>新的密码</label>
      <input type="password" id="user_pwd" name="user_pwd"  placeholder="请输入您的新密码">
   </div>
   <div class="reg-group">
      <label>确认密码</label>
      <input type="password" id="user_pwd2" name="user_pwd2"  placeholder="请输入您的确认密码">
   </div>
   <div class="reg-group">
      <label>验证码</label>
      <input type="text" class="reg-control w150" id="verify" name="verify" placeholder="请输入验证码">
      <img class="fr mr10 mt10" src="{:url('verify/index')}" onClick="this.src=this.src+'?'"  alt="单击刷新" />
   </div>
   <input type="button" id="btn_submit" class="btn-brand btn-sub" value="立即找回">
</form>
<script type="text/javascript">

\t$(function(){
\t\t$("body").bind('keyup',function(event) {
\t\t\tif(event.keyCode==13){ $('#btnLogin').click(); }
\t\t});
\t\t$('#btn_submit').click(function() {
\t\t\tif ($('#user_name').val()  == '') { alert('请输入用户！'); $("#user_name").focus(); return false; }
\t\t\tif ($('#user_pwd').val()  == '') { alert('请输入密码！'); $("#user_pwd").focus(); return false; }
\t\t\tif ($('#verify').val()  == '') { alert('请输入验证码！'); $("#verify").focus(); return false; }

\t\t\t$.ajax({
\t\t\t\turl: "{:url('user/findpass')}",
\t\t\t\ttype: "post",
\t\t\t\tdataType: "json",
\t\t\t\tdata: $('#fm').serialize(),
\t\t\t\tbeforeSend: function () {
\t\t\t\t\t$("#btn_submit").css("background","#fd6a6a").val("loading...");
\t\t\t\t},
\t\t\t\tsuccess: function (r) {
\t\t\t\t\tif(r.code==1){
\t\t\t\t\t\tlocation.href="{:url('user/index')}";
\t\t\t\t\t}
\t\t\t\t\telse{
\t\t\t\t\t\talert(r.msg);
\t\t\t\t\t}
\t\t\t\t},
\t\t\t\tcomplete: function () {
\t\t\t\t\t$('#verify').click();
\t\t\t\t\t$("#btn_submit").css("background","#fa4646").val("立即找回");
\t\t\t\t}
\t\t\t});

\t\t});
\t});

</script>`}/>
                    {markdownify(t('theme.usr.s63'), 'li')}
                    <h4>{t('theme.usr.s64')}</h4>
                    <InlineCode type={'html'} lines={87} code={`<form method="post" id="fm" action="">
   <input type="hidden" name="ac" value="{$param['ac']}">
   <h4>{$param['ac_text']}找回密码</h4>
   <div class="reg-group">
      <label class="bd-r" style="letter-spacing: normal;">{$param['ac_text']}</label>
      <input type="text" id="to" name="to" class="reg-control" placeholder="请输入您绑定的{$param['ac_text']}">
   </div>

   <div class="reg-group">
      <label>验证码</label>
      <input type="text" class="reg-control w150" id="verify" name="verify" placeholder="请输入验证码">
      <img class="fr mr10 mt10" src="{:url('verify/index')}" onClick="this.src=this.src+'?'"  alt="单击刷新" />
   </div>
   <input type="button" id="btn_send" class="btn-brand btn-sub" style="margin-top:5px;" value="发送验证码">
</form>

<form method="post" id="fm2" action="">
   <input type="hidden" name="ac" value="email">
   <h4>验证信息</h4>
   <div class="reg-group">
      <label class="bd-r" style="letter-spacing: normal;">验证码</label>
      <input type="text" id="code" name="code" class="reg-control" placeholder="请输入验证码">
   </div>
   <div class="reg-group">
      <label>新密码</label>
      <input type="password" class="reg-control w150" id="user_pwd" name="user_pwd" placeholder="请输入新密码">
   </div>
   <div class="reg-group">
      <label>确认密码</label>
      <input type="password" class="reg-control w150" id="user_pwd2" name="user_pwd2" placeholder="请输入确认密码">
   </div>
   <input type="button" id="btn_submit" class="btn-brand btn-sub" value="重置密码">
</form>
<script type="text/javascript">

\t$(function(){
\t\t$("body").bind('keyup',function(event) {
\t\t\tif(event.keyCode==13){ $('#btnLogin').click(); }
\t\t});
\t\t$('#btn_send').click(function() {
\t\t\tif ($('#to').val()  == '') { alert('请输入{$param["ac_text"]}！'); $("#to").focus(); return false; }

\t\t\t$.ajax({
\t\t\t\turl: "{:url('user/findpass_msg')}",
\t\t\t\ttype: "post",
\t\t\t\tdataType: "json",
\t\t\t\tdata: $('#fm').serialize(),
\t\t\t\tbeforeSend: function () {
\t\t\t\t\t$("#btn_send").css("background","#fd6a6a").val("loading...");
\t\t\t\t},
\t\t\t\tsuccess: function (r) {
\t\t\t\t\talert(r.msg);
\t\t\t\t},
\t\t\t\tcomplete: function () {
\t\t\t\t\t$('#verify').click();
\t\t\t\t\t$("#btn_send").css("background","#fa4646").val("发送邮件");
\t\t\t\t}
\t\t\t});
\t\t});

\t\t$('#btn_submit').click(function() {
\t\t\tif ($('#to').val()  == '') { alert('请输入{$param["ac_text"]}'); $("#to").focus(); return false; }
\t\t\tif ($('#code').val()  == '') { alert('请输入验证码！'); $("#code").focus(); return false; }
\t\t\tif ($('#user_pwd').val()  == '') { alert('请输入新密码！'); $("#user_pwd").focus(); return false; }
\t\t\tif ($('#user_pwd2').val()  == '') { alert('请输入确认密码！'); $("#user_pwd2").focus(); return false; }
\t\t\tif ($('#user_pwd').val()  != $('#user_pwd2').val() ) { alert('二次密码不一致！'); $("#user_pwd2").focus(); return false; }

\t\t\tvar data= {ac:'{$param["ac"]}',to:$('#to').val(),code:$('#code').val(),user_pwd:$('#user_pwd').val(),user_pwd2:$('#user_pwd2').val()};
\t\t\t$.ajax({
\t\t\t\turl: "{:url('user/findpass_reset')}",
\t\t\t\ttype: "post",
\t\t\t\tdataType: "json",
\t\t\t\tdata: data,
\t\t\t\tbeforeSend: function () {
\t\t\t\t\t$("#btn_submit").css("background","#fd6a6a").val("loading...");
\t\t\t\t},
\t\t\t\tsuccess: function (r) {
\t\t\t\t\talert(r.msg);
\t\t\t\t},
\t\t\t\tcomplete: function () {
\t\t\t\t\t$("#btn_submit").css("background","#fa4646").val("重置密码");
\t\t\t\t}
\t\t\t});
\t\t});
\t});

</script>`} />
                  </ul>
                </div>

                <div id={'弹出层'} ref={sectionRefs[21]} className={'w-full'}>
                  <h3>{t("theme.s101")}</h3>
                  <h4>{t("theme.usr.s65")}</h4>
                  {markdownify(t('theme.usr.s66'))}
                  <ul className='list'>
                    {markdownify(t('theme.usr.s67'), 'li')}
                    <InlineCode type={'html'} lines={26} code={`
<!--登录弹窗开始-->
<div class="mac_login">
    <form class="mac_login_form">
        <div class="login_form_group">
            <input type="text" class="mac_u_name" name="user_name" placeholder="手机/登录账号">
        </div>
        <div class="login_form_group">
            <input type="password" class="mac_u_pwd" name="user_pwd" placeholder="登录密码">
        </div>
        {if condition="$GLOBALS['config']['user']['login_verify'] eq 1"}
        <div class="login_form_group clearfix">
            <input type="text" class="mac_u_verify" name="verify" placeholder="请输入验证码">
            <img class="mac_verify_img" src="{:url('verify/index')}" onclick="this.src = this.src+'?'">
        </div>
        {/if}
        <div class="login_form_link">
            <a href="{:url('user/reg')}">注册</a>
            <a href="{:url('user/findpass')}">忘记密码</a>
        </div>
        <div class="login_form_group">
            <input type="button" class="login_form_submit" value="登录">
        </div>
    </form>
</div>
<!--登录弹窗结束-->`} />
                  </ul>
                  <h4>{t("theme.usr.s66")}</h4>
                  <ul className='list'>
                    {markdownify(t('theme.usr.s67'), 'li')}
                    <InlineCode type={'html'} lines={26} code={`
<!--登录弹窗开始-->
<div class="mac_login">
    <form class="mac_login_form">
        <div class="login_form_group">
            会员名：{$obj.user_name}
        </div>
        <div class="login_form_group">
            会员等级：{$obj.group_name}
        </div>
        <div class="login_form_group">
           剩余积分：{$obj.user_points}
        </div>
        <div class="login_form_group">
            上次登录时间：{$obj.user_last_login_time|mac_day=color}
        </div>
        <div class="login_form_group">
            登录次数：{$obj.user_login_num}
        </div>
        <div class="login_form_link">
            <a href="{:url('user/index')}">进入会员中心</a>
            <a href="{:url('user/logout')}">退出</a>
        </div>
    </form>
</div>
<!--登录弹窗结束-->`} />
                  </ul>
                  <h4>{t('theme.usr.s70')}</h4>
                  <InlineCode type={'html'} lines={7} code={`<!-- 模板需要确保已经引入 \`static\\js\\home.js\` -->
<a class="nav-link" href="javascript:;" id="Login">会员</a>
<script>
   $('body').on('click', '#Login', function(e){              \t
      MAC.User.Login();
   });  
</script>`} />
                </div>

                <div id={'通用分页'} ref={sectionRefs[22]} className={'w-full'}>
                  <h3>{t("theme.s102")}</h3>
                  <p>{t("theme.usr.s71")}</p>
                  <InlineCode type={'html'} lines={17} code={`<div class="member-page">
   <em>共{$__PAGING__.record_total}条</em>
   <a class="page_link" href="{$__PAGING__.page_url|str_replace='PAGELINK',1,###}" title="首页">首页</a>
   <a class="page_link" href="{$__PAGING__.page_url|str_replace='PAGELINK',$__PAGING__.page_prev,###}" title="上一页">上一页</a>
   {volist name="$__PAGING__.page_num" id="num"}
      {if condition="$__PAGING__['page_current'] eq $num"}
         <a class="page_link page_current" href="javascript:;" title="第{$num}页">{$num}</a>
      {else}
         <a class="page_link" href="{$__PAGING__.page_url|str_replace='PAGELINK',$num,###}" title="第{$num}页" >{$num}</a>
      {/if}
   {/volist}
   <a class="page_link" href="{$__PAGING__.page_url|str_replace='PAGELINK',$__PAGING__.page_next,###}" title="下一页">下一页</a>

   <a class="page_link" href="{$__PAGING__.page_url|str_replace='PAGELINK',$__PAGING__.page_total,###}" title="尾页">尾页</a>

   <em>到第</em><input type="text" name="" class="page-input"><em>页</em><input type="submit" class="page-button" value="确定">
</div>`} />
                </div>

                {/* Page */}
                <div className="pager">
                <Link href="/theme/theme-website" className="flex flex-row items-center gap-[6px]">
                  <Image alt="ic-right" src="/images/icons/ic_green_arrow_left.svg" width={20} height={20}/>
                  <span className="text-primary text-[16px]">{t("theme.s9")}</span>
                </Link>
                <div className="hidden md:block bg-[#D9E6E7] min-w-[1px] h-[12px]"/>
                <Link href="/theme/theme-type" className="flex flex-row items-center gap-[6px]">
                  <span className="text-primary text-[16px] text-right">{t("theme.s11")}</span>
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