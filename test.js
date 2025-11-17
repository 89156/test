// ==UserScript==
// @name         天才们的邀约 正确答案高亮助手
// @namespace    https://starrailawards.com/
// @version      1
// @description  适用于⌈天才们的邀约⌋小游戏，题目提示在完成后消失
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

let lastQuestionKey = null; // 用来追踪当前题目

const highlightAndHint=()=>{
    const q=document.querySelector('.question-text');
    if(!q) return;

    // 当前题目key
    let key=q.innerText.trim();
    const box=q.closest('.question-container');
    if(box){
        const s=box.querySelector('audio source'), i=box.querySelector('img');
        if(s) key+=`|audio:${s.src}`;
        if(i) key+=`|img:${i.src}`;
    }

    // 如果题目换了，移除上一个提示
    if(lastQuestionKey && lastQuestionKey !== key){
        const oldHints=document.querySelectorAll('.hint-lime');
        oldHints.forEach(h=>h.remove());
    }
    lastQuestionKey = key;

    // 语音题提示逻辑
    if(key==="这段声音是来自谁的？请找出与题目语音同角色的选项"){
        if(!document.querySelector('.hint-lime')){
            const hint=document.createElement('div');
            hint.style.color='lime';
            hint.className='hint-lime';
            hint.innerText='提示:选择 这里有什么值得你好奇的?不会是我吧';
            q.insertAdjacentElement('afterend',hint);
        }
    }

    // 普通题高亮答案
    if(!key.includes('请找出与题目语音同角色的选项')){
        const ops=[...document.querySelectorAll('.option')];
        ops.forEach(o=>{o.style.border=''});
        const match=DB[key];
        if(match){
            const hit=ops.find(o=>buildOptKey(o)===match);
            if(hit) hit.style.border='5px solid lime';
        }
    }
};

// 观察整个页面变化，自动更新高亮和提示
new MutationObserver(highlightAndHint).observe(document.body,{childList:true,subtree:true});
highlightAndHint();

})();
