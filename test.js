// ==UserScript==
// @name         天才们的邀约 正确答案高亮助手
// @namespace    https://starrailawards.com/
// @version      0
// @description  适用于⌈天才们的邀约⌋小游戏
// @match        *://geniuses.starrailawards.com/*
// @grant        none
// @icon         https://static.appoint.icu/QA/img/geniuses.ico
// ==/UserScript==
(function(){
'use strict';
let DB={};
fetch("https://gh-proxy.org/https://raw.githubusercontent.com/89156/userjs/refs/heads/main/quiz_db.json")
.then(r=>r.json())
.then(j=>{DB=j});

const buildOptKey=o=>{
    let k=o.innerText.trim();
    const img=o.querySelector('img'),aud=o.querySelector('audio');
    if(img)k+=`|img:${img.src}`;
    if(aud)k+=`|audio:${aud.src}`;
    return k;
};

const highlight=()=>{
    const q=document.querySelector('.question-text');
    if(!q)return;
    let key=q.innerText.trim();
    const box=q.closest('.question-container');
    if(box){
        const s=box.querySelector('audio source'),i=box.querySelector('img');
        if(s)key+=`|audio:${s.src}`;
        if(i)key+=`|img:${i.src}`;
    }
    if(key.includes('请找出与题目语音同角色的选项'))return;
    const ops=[...document.querySelectorAll('.option')];
    ops.forEach(o=>{o.style.border=''});
    const match=DB[key];
    if(match){
        const hit=ops.find(o=>buildOptKey(o)===match);
        if(hit)hit.style.border='5px solid lime';
    }
};

new MutationObserver(highlight).observe(document.body,{childList:true,subtree:true});
highlight();
})();
