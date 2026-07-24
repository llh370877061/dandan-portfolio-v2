// ===== APP STATE =====
var STATE = {
  currentPage: 'home',
  currentModule: null,
  currentEpisode: null,
  completedEpisodes: {},
  quizStates: {},
  practiceStates: {},
  activeVideo: {}
};
try { var s = localStorage.getItem('ai-course-progress'); if (s) STATE.completedEpisodes = JSON.parse(s); } catch(e) {}

function saveProgress() { try { localStorage.setItem('ai-course-progress', JSON.stringify(STATE.completedEpisodes)); } catch(e) {} }

function toggleComplete(id) {
  if (STATE.completedEpisodes[id]) delete STATE.completedEpisodes[id];
  else {
    STATE.completedEpisodes[id] = Date.now();
    // Celebration for completing a lesson
    SoundEngine.playLevelUp();
    Confetti.burst(window.innerWidth/2, window.innerHeight/2, 40);
    // Gamification: XP for completing lesson
    GamificationStore.addXP(20);
    GamificationStore.updateStreak();
    // Check badges
    var completedCount = Object.keys(STATE.completedEpisodes).length;
    if (completedCount === 1) GamificationStore.addBadge('first_lesson');
    if (completedCount === 40) GamificationStore.addBadge('master');
    // Check module completion
    COURSE_DATA.modules.forEach(function(mod) {
      var allDone = mod.episodes.every(function(e) { return STATE.completedEpisodes[e.id]; });
      if (allDone) {
        var moduleBadges = ['explorer', 'scientist', 'engineer', 'creator', 'master', 'master'];
        GamificationStore.addBadge(moduleBadges[mod.id - 1] || 'explorer');
      }
    });
  }
  saveProgress(); renderCurrentPage();
}

function getModuleProgress(mid) {
  var m = COURSE_DATA.modules.find(function(x){return x.id===mid;});
  if(!m) return 0;
  var d = m.episodes.filter(function(e){return STATE.completedEpisodes[e.id];}).length;
  return Math.round((d/m.episodes.length)*100);
}
function getOverallProgress() {
  var t = COURSE_DATA.modules.reduce(function(s,m){return s+m.episodes.length;},0);
  var d = Object.keys(STATE.completedEpisodes).length;
  return t>0?Math.round((d/t)*100):0;
}

// ===== ROUTING =====
function navigateTo(p, mid, eid) {
  STATE.currentPage=p; STATE.currentModule=mid||null; STATE.currentEpisode=eid||null;
  renderCurrentPage(); window.scrollTo({top:0,behavior:'smooth'});
}

function renderCurrentPage() {
  var app = document.getElementById('app'); if(!app) return;
  var op = getOverallProgress();
  var nh = document.getElementById('nav-home'); if(nh) nh.className=(STATE.currentPage==='home'||STATE.currentPage==='about')?'active':'';
  var pd = document.getElementById('nav-progress-display'); if(pd) pd.textContent=op>0?('进度 '+op+'%'):'';
  var pb = document.getElementById('progressBarTop');
  if(pb){if(STATE.currentPage==='lesson'){pb.style.display='block';var pf=document.getElementById('progressBarTopFill');if(pf)pf.style.width=op+'%';}else{pb.style.display='none';}}
  try{
    switch(STATE.currentPage){
      case 'home':app.innerHTML=renderHome();break;
      case 'about':app.innerHTML=renderAbout();break;
      case 'module':app.innerHTML=renderModule(STATE.currentModule);break;
      case 'lesson':app.innerHTML=renderLesson(STATE.currentModule,STATE.currentEpisode);break;
      default:app.innerHTML=renderHome();
    }
  }catch(e){app.innerHTML='<div class="section"><h2>页面加载出错</h2><p>'+e.message+'</p></div>';}
}

// ===== HOME =====
function renderHome() {
  var cc = Object.keys(STATE.completedEpisodes).length;
  var op = getOverallProgress();
  var gameData = GamificationStore.load();

  var mh = COURSE_DATA.modules.map(function(mod,i){
    var p=getModuleProgress(mod.id);
    var dc=mod.episodes.filter(function(e){return STATE.completedEpisodes[e.id];}).length;
    return '<div class="module-card fade-in" style="animation-delay:'+(i*0.1)+'s" onclick="navigateTo(\'module\','+mod.id+')">'+
      '<div class="module-card-header"><div class="module-number">'+mod.icon+' 模块 '+mod.id+'</div>'+
      '<div class="module-card-title">'+mod.title+'</div><div class="module-card-desc">'+mod.description+'</div></div>'+
      '<div class="module-card-footer"><span class="module-episodes">'+dc+'/'+mod.episodes.length+' 集完成</span>'+
      '<div class="module-progress"><div class="module-progress-bar" style="width:'+p+'%"></div></div></div></div>';
  }).join('');

  var ph = COURSE_DATA.modules.map(function(m,i){
    var st=m.title.split('与')[0].split('、')[0];
    var ar=i<5?'<div style="display:flex;align-items:center;color:var(--border);font-size:1.2rem">→</div>':'';
    return '<div style="text-align:center;min-width:100px"><div style="width:48px;height:48px;border-radius:50%;background:'+m.color+';display:flex;align-items:center;justify-content:center;margin:0 auto .5rem;font-size:1.2rem">'+m.icon+'</div>'+
      '<div style="font-size:.8rem;color:var(--text-muted)">第'+(i+1)+'步</div><div style="font-size:.85rem;font-weight:600;max-width:100px">'+st+'</div></div>'+ar;
  }).join('');

  // Gamification bar
  var gameBar = '<div class="gamification-bar fade-in">'+
    '<div class="gamification-item"><span class="gamification-icon">⚡</span><div><div class="gamification-value">'+gameData.xp+'</div><div class="gamification-label">经验值</div></div></div>'+
    '<div class="gamification-item"><span class="gamification-icon">🏆</span><div><div class="gamification-value">Lv.'+gameData.level+'</div><div class="gamification-label">等级</div></div></div>'+
    '<div class="gamification-item"><span class="gamification-icon">🔥</span><div><div class="gamification-value">'+gameData.streak.current+'</div><div class="gamification-label">连续学习</div></div></div>'+
    '<div class="gamification-item"><span class="gamification-icon">🎖️</span><div><div class="gamification-value">'+gameData.badges.length+'/'+Object.keys(BADGES).length+'</div><div class="gamification-label">徽章</div></div></div>'+
    '</div>';

  return '<div class="hero"><h1>青少年 AI 科普 40 集</h1>'+
    '<p>从 AI 通识到动手创造，一条适合 8-14 岁孩子的学习路线。<br>先好奇，再理解，再看见榜样，最后动手创造。</p>'+
    '<div class="hero-stats"><div class="hero-stat"><div class="num">40</div><div class="label">集课程</div></div>'+
    '<div class="hero-stat"><div class="num">6</div><div class="label">大模块</div></div>'+
    '<div class="hero-stat"><div class="num">'+cc+'</div><div class="label">已完成</div></div>'+
    '<div class="hero-stat"><div class="num">'+op+'%</div><div class="label">总进度</div></div></div></div>'+
    '<div class="section">'+gameBar+'</div>'+
    '<div class="section" style="padding-top:0"><div class="section-title">学习路径</div><div class="section-subtitle">好奇 → 理解 → 看见 → 创造</div>'+
    '<div style="display:flex;gap:1rem;overflow-x:auto;padding:1rem 0;margin-bottom:2rem;flex-wrap:wrap;justify-content:center">'+ph+'</div></div>'+
    '<div class="section" style="padding-top:0"><div class="section-title">课程模块</div><div class="section-subtitle">点击进入每个模块，开始学习</div>'+
    '<div class="modules-grid">'+mh+'</div></div>';
}

// ===== MODULE =====
function renderModule(mid) {
  var mod=COURSE_DATA.modules.find(function(m){return m.id===mid;}); if(!mod) return renderHome();
  var p=getModuleProgress(mod.id);
  var eh=mod.episodes.map(function(ep){
    var ic=STATE.completedEpisodes[ep.id];
    return '<li class="episode-item '+(ic?'completed':'')+'" onclick="navigateTo(\'lesson\','+mod.id+','+ep.id+')">'+
      '<div class="episode-num">'+(ic?'✓':ep.number)+'</div>'+
      '<div class="episode-info"><div class="episode-title">'+ep.title+'</div>'+
      '<div class="episode-meta">'+ep.duration+' · '+ep.objective.substring(0,25)+'...</div></div>'+
      '<span class="completion-badge '+(ic?'done':'pending')+'">'+(ic?'已完成':'待学习')+'</span></li>';
  }).join('');
  return '<div class="section"><div class="lesson-breadcrumb"><a href="#" onclick="navigateTo(\'home\');return false">课程首页</a> <span>›</span> <span>模块 '+mod.id+'</span></div>'+
    '<div style="display:flex;align-items:center;gap:1rem;margin-bottom:.5rem"><div style="width:48px;height:48px;border-radius:12px;background:'+mod.color+';display:flex;align-items:center;justify-content:center;font-size:1.5rem">'+mod.icon+'</div>'+
    '<div><h1 style="font-size:1.8rem;font-weight:800">模块 '+mod.id+'：'+mod.title+'</h1><p style="color:var(--text-muted)">'+mod.description+'</p></div></div>'+
    '<div style="display:flex;align-items:center;gap:1rem;margin:1.5rem 0"><div style="flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden"><div style="height:100%;width:'+p+'%;background:linear-gradient(90deg,'+mod.color+','+mod.color+'aa);border-radius:4px;transition:width .5s"></div></div>'+
    '<span style="font-size:.9rem;color:var(--text-muted);white-space:nowrap">'+p+'% 完成</span></div>'+
    '<ul class="episode-list">'+eh+'</ul></div>';
}

// ===== LESSON =====
function renderLesson(mid, eid) {
  try {
    var mod=COURSE_DATA.modules.find(function(m){return m.id===mid;}); if(!mod) return renderHome();
    var ep=mod.episodes.find(function(e){return e.id===eid;}); if(!ep) return renderModule(mid);
    var ic=!!STATE.completedEpisodes[ep.id];
    var mi=COURSE_DATA.modules.indexOf(mod), ei=mod.episodes.indexOf(ep);
    var ps = STATE.practiceStates[ep.id] || {};

    // Sidebar
    var sh=mod.episodes.map(function(e){
      var d=STATE.completedEpisodes[e.id], a=e.id===ep.id;
      return '<li class="episode-item '+(d?'completed':'')+' '+(a?'active':'')+'" onclick="navigateTo(\'lesson\','+mod.id+','+e.id+')" style="padding:.6rem .75rem">'+
        '<div class="episode-num" style="width:28px;height:28px;font-size:.75rem">'+(d?'✓':e.number)+'</div>'+
        '<div class="episode-info"><div class="episode-title" style="font-size:.85rem">'+e.title+'</div></div></li>';
    }).join('');

    // Content
    _imgIdx = {};
    var ch=ep.sections.map(function(s){return renderSection(s,ep);}).join('');

    // Video section
    var vh=renderVideoSection(ep);

    // Quiz
    var qh='';
    if(ep.quiz&&ep.quiz.length>0){var qs=STATE.quizStates[ep.id]||{current:0,answers:{}};qh=renderQuiz(ep,qs);}

    // Practice
    var prh=renderPractice(ep);

    // Discussion
    var dh='';
    if(ep.discussion&&ep.discussion.length>0){
      var di=ep.discussion.map(function(q,i){
        var guide=(ep.guides&&ep.guides[i])?ep.guides[i]:'';
        return '<li><span class="q-num">'+(i+1)+'</span><div><span>'+q+'</span>'+
          (guide?'<button class="btn btn-secondary btn-sm" style="margin-top:.5rem;font-size:.8rem;padding:.3rem .7rem" onclick="event.stopPropagation();var el=document.getElementById(\'guide_'+ep.id+'_'+i+'\');el.style.display=el.style.display===\'none\'?\'block\':\'none\'">💡 查看引导</button>'+
          '<div id="guide_'+ep.id+'_'+i+'" style="display:none;margin-top:.5rem;padding:.75rem 1rem;background:rgba(99,102,241,.08);border-left:3px solid var(--primary);border-radius:0 6px 6px 0;font-size:.85rem;color:var(--text-muted);line-height:1.6">'+guide+'</div>':'')+
          '</div></li>';
      }).join('');
      dh='<div class="discussion-box"><h3>💬 讨论话题</h3><ul class="discussion-questions">'+di+'</ul></div>';
    }

    // Activity
    var ah='';
    if(ep.activity){
      var steps=ep.activity.steps.map(function(s){return '<li style="margin-bottom:.35rem">'+s+'</li>';}).join('');
      var resourceHtml='';
      if(ep.activity.resources&&ep.activity.resources.length>0){
        resourceHtml='<div class="activity-resources"><div class="activity-resources-title">📎 参考模板</div><div class="activity-resources-grid">'+
          ep.activity.resources.map(function(r,i){
            var isOpen=ps['res_'+ep.id+'_'+i];
            return '<div class="activity-resource-card">'+
              '<button class="activity-resource-btn" onclick="toggleResource('+ep.id+','+i+')">'+r.icon+' '+r.title+' <span class="toggle-arrow">'+(isOpen?'▾':'▸')+'</span></button>'+
              '<div class="activity-resource-body" style="display:'+(isOpen?'block':'none')+'">'+r.content+'</div>'+
            '</div>';
          }).join('')+'</div></div>';
      }
      ah='<div class="activity-box"><h3>🎯 动手活动：'+ep.activity.title+'</h3><p style="margin-bottom:.75rem">'+ep.activity.description+'</p>'+
        '<ol style="padding-left:1.25rem;color:var(--text-muted)">'+steps+'</ol>'+
        resourceHtml+'</div>';
    }

    // Nav
    var pl='',nl='';
    if(ei>0){var pv=mod.episodes[ei-1];pl='<button class="btn btn-secondary" onclick="navigateTo(\'lesson\','+mod.id+','+pv.id+')">← '+pv.title+'</button>';}
    else if(mi>0){var pm=COURSE_DATA.modules[mi-1],pe=pm.episodes[pm.episodes.length-1];pl='<button class="btn btn-secondary" onclick="navigateTo(\'lesson\','+pm.id+','+pe.id+')">← '+pe.title+'</button>';}
    if(ei<mod.episodes.length-1){var nx=mod.episodes[ei+1];nl='<button class="btn btn-primary" onclick="navigateTo(\'lesson\','+mod.id+','+nx.id+')">'+nx.title+' →</button>';}
    else if(mi<COURSE_DATA.modules.length-1){var nm=COURSE_DATA.modules[mi+1],ne=nm.episodes[0];nl='<button class="btn btn-primary" onclick="navigateTo(\'lesson\','+nm.id+','+ne.id+')">'+ne.title+' →</button>';}

    return '<div class="lesson-layout"><aside class="lesson-sidebar"><div style="padding:.5rem .75rem;margin-bottom:.5rem;font-weight:700;font-size:.85rem;color:'+mod.color+'">'+mod.icon+' 模块 '+mod.id+'：'+mod.title+'</div>'+
      '<ul class="episode-list">'+sh+'</ul></aside>'+
      '<div class="lesson-content"><div class="lesson-header fade-in"><div class="lesson-breadcrumb">'+
      '<a href="#" onclick="navigateTo(\'home\');return false">首页</a> <span>›</span> '+
      '<a href="#" onclick="navigateTo(\'module\','+mod.id+');return false">模块 '+mod.id+'</a> <span>›</span> <span>第'+ep.number+'集</span></div>'+
      '<h1>'+ep.title+'</h1><div class="meta"><span>⏱ '+ep.duration+'</span><span>🎯 '+ep.objective+'</span><span style="color:'+mod.color+'">📦 模块 '+mod.id+'</span></div></div>'+
      vh+ch+qh+prh+dh+ah+
      '<div style="margin:2rem 0;text-align:center"><button class="btn '+(ic?'btn-secondary':'btn-success')+'" onclick="toggleComplete('+ep.id+')" style="min-width:200px">'+
      (ic?'✓ 已完成（点击取消）':'✅ 标记为已完成')+'</button></div>'+
      '<div class="lesson-nav">'+(pl||'<div></div>')+(nl||'<div></div>')+'</div></div></div>';
  } catch(e) {
    return '<div class="section"><h2>课程加载出错</h2><p>'+e.message+'</p></div>';
  }
}

// ===== VIDEO SECTION =====
function renderVideoSection(ep) {
  var videos = (typeof VIDEO_DATA !== 'undefined' && VIDEO_DATA[ep.id]) ? VIDEO_DATA[ep.id].videos : null;
  if (!videos || videos.length === 0) {
    videos = getDefaultVideos(ep);
  }
  if (!videos || videos.length === 0) return '';

  // Generate embed URLs from B站 BV IDs if not already set
  videos = videos.map(function(v) {
    if (!v.embedUrl && v.url && v.url.indexOf('bilibili.com/video/') > -1) {
      var bvMatch = v.url.match(/BV[a-zA-Z0-9]+/);
      if (bvMatch) {
        v.embedUrl = 'https://player.bilibili.com/player.html?bvid=' + bvMatch[0] + '&autoplay=0&high_quality=1';
      }
    }
    return v;
  });

  var activeIdx = STATE.activeVideo[ep.id] || 0;
  var active = videos[activeIdx];

  var vi = videos.map(function(v, i) {
    var icon = v.source === 'bilibili' ? '📺' : '🎬';
    return '<div class="video-item '+(i===activeIdx?'active':'')+'" onclick="playVideo('+ep.id+','+i+')">' +
      '<div class="video-thumb">'+icon+'</div>' +
      '<div class="video-info"><div class="title">'+v.title+'</div><div class="source">'+v.source+'</div></div>' +
      '<span class="video-badge">观看</span></div>';
  }).join('');

  var embedHtml = '';
  if (active && active.embedUrl) {
    embedHtml = '<div class="video-wrapper"><iframe src="'+active.embedUrl+'" allowfullscreen></iframe></div>';
  } else if (active && active.url) {
    embedHtml = '<div style="text-align:center;padding:2rem;background:var(--bg);border-radius:8px;border:1px solid var(--border)">'+
      '<p style="margin-bottom:1rem">📺 推荐视频：'+active.title+'</p>'+
      '<a href="'+active.url+'" target="_blank" class="btn btn-primary">在 '+active.source+' 观看 →</a></div>';
  }

  return '<div class="video-section"><h3>📺 推荐视频</h3>'+embedHtml+'<div class="video-list">'+vi+'</div></div>';
}

function getDefaultVideos(ep) {
  var map = {
    1: [{title:'什么是人工智能？3分钟看懂AI',source:'bilibili',url:'https://www.bilibili.com/video/BV1FV411d7b7',embedUrl:''}],
    2: [{title:'机器学习是什么？',source:'bilibili',url:'https://www.bilibili.com/video/BV1aJ411f7Wn',embedUrl:''}],
    3: [{title:'计算机视觉入门',source:'bilibili',url:'https://www.bilibili.com/video/BV1FT4y1E74V',embedUrl:''}],
    6: [{title:'大语言模型是如何工作的',source:'bilibili',url:'https://www.bilibili.com/video/BV1Sh411f7Wn',embedUrl:''}],
    15: [{title:'提示词工程入门教程',source:'bilibili',url:'https://www.bilibili.com/video/BV1M14y1f7Wn',embedUrl:''}],
    16: [{title:'图灵：计算机之父',source:'bilibili',url:'https://www.bilibili.com/video/BV1Gs411f7Wn',embedUrl:''}],
    19: [{title:'ChatGPT 是怎么工作的',source:'bilibili',url:'https://www.bilibili.com/video/BV1Ms411f7Wn',embedUrl:''}],
    23: [{title:'AI 绘画：Midjourney 入门',source:'bilibili',url:'https://www.bilibili.com/video/BV1Ms411f7Wn',embedUrl:''}],
    26: [{title:'AlphaGo 如何打败围棋世界冠军',source:'bilibili',url:'https://www.bilibili.com/video/BV1Gs411f7Wn',embedUrl:''}]
  };
  return map[ep.id] || [{title:'了解更多：'+ep.title,source:'bilibili',url:'https://search.bilibili.com/all?keyword='+encodeURIComponent('AI科普 '+ep.title),embedUrl:''}];
}

function playVideo(epId, idx) {
  STATE.activeVideo[epId] = idx;
  renderCurrentPage();
}

// ===== PRACTICE SECTION =====
function renderPractice(ep) {
  try {
    var ps = STATE.practiceStates[ep.id] || {};
    var practice = ep.practice;
    if (!practice) {
      practice = getDefaultPractice(ep);
    }
    if (!practice) return '';

    switch(practice.type) {
      case 'fillblank': return renderFillBlank(ep, practice, ps);
      case '排序': return renderSortPractice(ep, practice, ps);
      case '提示词': return renderPromptPractice(ep, practice, ps);
      case '选择': return renderChoicePractice(ep, practice, ps);
      case 'yesno': return renderYesNoPractice(ep, practice, ps);
      default: return renderFillBlank(ep, practice, ps);
    }
  } catch(e) {
    return '<div class="practice-section"><h3>练习加载出错</h3><p>'+e.message+'</p></div>';
  }
}

function getDefaultPractice(ep) {
  var map = {
    1: {type:'yesno',title:'AI 识别练习',prompt:'观察以下场景，判断哪些用到了 AI 技术。',items:[
      {text:'手机语音助手帮你设闹钟',answer:true},
      {text:'用纸笔写字',answer:false},
      {text:'导航软件推荐最快路线',answer:true},
      {text:'用钥匙开门',answer:false}
    ]},
    2: {type:'排序',title:'机器学习步骤排序',prompt:'把机器学习的步骤按正确顺序排列。（拖动卡片调整顺序，然后点击"检查顺序"）',items:['做判断（预测）','看数据（接收例子）','找规律（分析特征）']},
    3: {type:'选择',title:'计算机视觉应用',prompt:'以下哪些是计算机视觉的应用？（点击选择，可多选）',options:[
      {text:'人脸识别解锁手机',correct:true},
      {text:'语音助手听懂你说话',correct:false},
      {text:'自动驾驶识别交通标志',correct:true},
      {text:'智能音箱播放音乐',correct:false}
    ]},
    4: {"type": "fillblank", "title": "语音识别步骤", "prompt": "填写正确的语音识别步骤。（点击下方选项卡选择答案）", "blanks": [{"text": "第一步：接收_____信号", "answer": "声音", "hints": ["声音", "图像", "文字", "数据"], "explanation": "语音识别的第一步是通过麦克风接收声音信号，就像人的耳朵一样。"}, {"text": "第二步：转换成数字信号", "answer": "模拟", "hints": ["模拟", "数字", "化学", "物理"], "explanation": "声音是模拟信号，需要转换成计算机能处理的数字信号。"}, {"text": "第三步：分析_____特征", "answer": "语音", "hints": ["语音", "图像", "颜色", "温度"], "explanation": "AI 会分析语音的频率、音调、节奏等特征，就像人耳分辨不同人的声音一样。"}, {"text": "第四步：输出文字结果", "answer": "识别", "hints": ["识别", "生成", "删除", "复制"], "explanation": "最后，AI 把分析结果转换成文字，这就是语音识别的完整过程。"}]},
    5: {type:'提示词',title:'提示词挑战',prompt:'用不同的提示词让 AI 写一个关于春天的故事，对比效果：',placeholder:'试试写一个详细的提示词，包含：故事主角、场景、字数要求、风格...'},
    6: {type:'选择',title:'AI 记忆力测试',prompt:'以下关于 AI 记忆力的说法，哪个是正确的？',options:[
      {text:'AI 能像人一样记住所有事情',correct:false},
      {text:'AI 的记忆存储在硬盘里，可以永久保存',correct:true},
      {text:'AI 会像人一样遗忘',correct:false},
      {text:'AI 没有记忆能力',correct:false}
    ]},
    7: {type:'选择',title:'AI 幻觉识别',prompt:'以下哪些回答可能是 AI 编造的？',options:[
      {text:'珠穆朗玛峰是世界最高峰',correct:false},
      {text:'2023年火星上发现了外星人',correct:true},
      {text:'水的化学式是 H₂O',correct:false},
      {text:'爱因斯坦发明了电灯',correct:true}
    ]},
    8: {"type": "fillblank", "title": "AI 的好与坏", "prompt": "思考 AI 带来的好处和挑战。（点击选项卡选择，也可以有自己的想法）", "blanks": [{"text": "好处：AI 可以_____重复性工作", "answer": "代替", "hints": ["代替", "完成", "处理", "执行"], "explanation": "AI 可以代替人类完成重复、枯燥的工作，比如数据录入、流水线操作等。"}, {"text": "好处：AI 可以帮助人类做更_____的事情", "answer": "创造性", "hints": ["创造性", "简单", "快速", "复杂"], "explanation": "当 AI 处理重复工作后，人类可以把精力投入到创造、创新等更有价值的事情上。"}, {"text": "挑战：AI 可能会导致某些_____消失", "answer": "工作", "hints": ["工作", "食物", "阳光", "空气"], "explanation": "确实，一些重复性工作可能会被 AI 取代，这就是为什么我们需要学习新技能。"}, {"text": "挑战：AI 可能带来_____问题", "answer": "隐私", "hints": ["隐私", "天气", "交通", "饮食"], "explanation": "AI 需要大量数据，可能涉及个人隐私，比如人脸识别、位置追踪等。"}]},
    9: {type:'排序',title:'AI 发展历程排序',prompt:'把 AI 发展的重要事件按时间顺序排列。（拖动卡片调整顺序，然后点击"检查顺序"）',items:['深度学习突破','图灵测试提出','ChatGPT发布','AI 概念诞生']},
    10: {type:'提示词',title:'人与 AI 关系思考',prompt:'用一段话描述你心目中人与 AI 的理想关系：',placeholder:'思考：AI 应该是工具、助手、还是伙伴？为什么？'},
    11: {"type": "fillblank", "title": "数据三要素", "prompt": "填入正确的数据特征。（点击选项卡选择答案）", "blanks": [{"text": "好的数据应该是_____的，覆盖各种情况和场景", "answer": "多样", "hints": ["多样", "单一", "少量", "简单"], "explanation": "数据要多样化才能让 AI 学会处理各种情况，就像学生要做各种题型才能学好一样。"}, {"text": "好的数据应该是_____的，信息准确无误", "answer": "准确", "hints": ["准确", "模糊", "大概", "随意"], "explanation": "如果数据不准确，AI 就会学到错误的知识，就像用错误的教材学习一样。"}, {"text": "好的数据应该具有_____性，能代表真实世界", "answer": "代表", "hints": ["代表", "特殊", "个别", "极端"], "explanation": "数据要能代表真实情况，不能只用特殊例子训练 AI。"}]},
    12: {type:'选择',title:'算法概念理解',prompt:'以下关于算法的说法，哪个是正确的？',options:[
      {text:'算法就是计算机程序',correct:false},
      {text:'算法是解决问题的步骤和方法',correct:true},
      {text:'算法只能用代码实现',correct:false},
      {text:'算法不需要逻辑',correct:false}
    ]},
    13: {type:'排序',title:'神经网络结构',prompt:'把神经网络的层按正确顺序排列。（拖动卡片调整顺序，然后点击"检查顺序"）',items:['输出层','隐藏层','输入层']},
    14: {"type": "fillblank", "title": "模型训练步骤", "prompt": "填写模型训练的关键步骤。（点击选项卡选择答案）", "blanks": [{"text": "第一步：准备_____数据", "answer": "训练", "hints": ["训练", "测试", "娱乐", "游戏"], "explanation": "训练数据是 AI 学习的材料，就像学生的学习资料一样。"}, {"text": "第二步：选择模型_____", "answer": "结构", "hints": ["结构", "颜色", "大小", "形状"], "explanation": "不同的任务需要不同的模型结构，就像不同的运动需要不同的训练方法。"}, {"text": "第三步：调整模型_____", "answer": "参数", "hints": ["参数", "名字", "地址", "电话"], "explanation": "参数是模型内部的数值，调整参数就像调整收音机的频道，让它接收更清晰。"}, {"text": "第四步：评估模型_____", "answer": "性能", "hints": ["性能", "外观", "价格", "品牌"], "explanation": "评估是检查模型学得好不好，就像考试检验学习效果一样。"}]},
    15: {type:'提示词',title:'提示词进阶练习',prompt:'用好的提示词让 AI 帮你完成以下任务：',placeholder:'例如：帮我写一篇300字的关于春天的作文，要生动有趣，适合小学生阅读'},
    16: {type:'选择',title:'图灵贡献测试',prompt:'以下哪个是艾伦·图灵的主要贡献？',options:[
      {text:'发明了第一台计算机',correct:false},
      {text:'提出了图灵测试',correct:true},
      {text:'创建了互联网',correct:false},
      {text:'发明了智能手机',correct:false}
    ]},
    17: {"type": "fillblank", "title": "AI 寒冬原因", "prompt": "填写导致 AI 寒冬的主要原因。（点击选项卡选择答案）", "blanks": [{"text": "计算_____不足", "answer": "能力", "hints": ["能力", "速度", "重量", "体积"], "explanation": "早期计算机太慢太小，无法处理复杂的 AI 计算。"}, {"text": "数据_____有限", "answer": "量", "hints": ["量", "质", "色", "形"], "explanation": "AI 需要大量数据学习，但当时没有互联网，数据很少。"}, {"text": "算法_____不够", "answer": "复杂度", "hints": ["复杂度", "简单度", "高度", "深度"], "explanation": "早期的算法太简单，无法处理复杂任务。"}, {"text": "实际应用_____少", "answer": "案例", "hints": ["案例", "数量", "颜色", "形状"], "explanation": "看不到 AI 的实际价值，投资就会减少。"}]},
    18: {type:'选择',title:'深度学习突破',prompt:'以下哪个是深度学习的关键突破？',options:[
      {text:'让 AI 能下围棋',correct:true},
      {text:'让 AI 能上网',correct:false},
      {text:'让 AI 能充电',correct:false},
      {text:'让 AI 能走路',correct:false}
    ]},
    19: {type:'排序',title:'ChatGPT 发展排序',prompt:'把 ChatGPT 的发展历程按时间顺序排列。（拖动卡片调整顺序，然后点击"检查顺序"）',items:['GPT-3发布','ChatGPT上线','GPT-4发布','GPT-2发布']},
    20: {type:'选择',title:'中国 AI 知识检测',prompt:'以下关于中国 AI 的说法，哪个是正确的？',options:[
      {text:'中国 AI 起步比美国早',correct:false},
      {text:'DeepSeek 是中国开发的大语言模型',correct:true},
      {text:'中国没有 AI 公司',correct:false},
      {text:'中国 AI 只用于游戏',correct:false}
    ]},
    21: {"type": "fillblank", "title": "AI + 医疗应用", "prompt": "填写 AI 在医疗领域的应用。（点击选项卡选择答案）", "blanks": [{"text": "AI 可以帮助医生分析_____影像", "answer": "医学", "hints": ["医学", "风景", "人物", "动物"], "explanation": "AI 可以快速分析 X 光、CT、MRI 等医学影像，帮助医生发现病变。"}, {"text": "AI 可以辅助诊断_____疾病", "answer": "罕见", "hints": ["罕见", "常见", "所有", "没有"], "explanation": "罕见病医生见得少，AI 可以学习全球病例来辅助诊断。"}, {"text": "AI 可以加速_____研发", "answer": "药物", "hints": ["药物", "食物", "玩具", "衣服"], "explanation": "AI 可以模拟药物分子结构，大大缩短新药研发时间。"}, {"text": "AI 可以提供_____问诊服务", "answer": "远程", "hints": ["远程", "现场", "电话", "视频"], "explanation": "AI 可以让偏远地区的患者也能获得专家级的医疗建议。"}]},
    22: {type:'选择',title:'AI + 教育应用',prompt:'以下哪个是 AI 在教育领域的应用？',options:[
      {text:'AI 可以个性化推荐学习内容',correct:true},
      {text:'AI 可以代替老师上课',correct:false},
      {text:'AI 可以完全替代学校',correct:false},
      {text:'AI 只能用于考试',correct:false}
    ]},
    23: {type:'提示词',title:'AI 艺术创作',prompt:'用提示词让 AI 生成一幅春天的画：',placeholder:'描述你想要的画面：场景、风格、色彩、氛围...'},
    24: {type:'选择',title:'AI + 机器人',prompt:'以下关于 AI 机器人的说法，哪个是正确的？',options:[
      {text:'AI 机器人都长得像人',correct:false},
      {text:'AI 机器人可以自主学习和适应',correct:true},
      {text:'AI 机器人只能重复固定动作',correct:false},
      {text:'AI 机器人不需要编程',correct:false}
    ]},
    25: {"type": "fillblank", "title": "自动驾驶技术", "prompt": "填写自动驾驶的关键技术。（点击选项卡选择答案）", "blanks": [{"text": "需要_____识别周围环境", "answer": "传感器", "hints": ["传感器", "摄像头", "雷达", "激光"], "explanation": "传感器就像汽车的眼睛，帮助它看到周围的环境。"}, {"text": "需要_____学习驾驶经验", "answer": "机器", "hints": ["机器", "人类", "动物", "自然"], "explanation": "机器学习让汽车能从大量驾驶数据中学习，不断改进驾驶技能。"}, {"text": "需要做出_____决策", "answer": "实时", "hints": ["实时", "延迟", "事后", "提前"], "explanation": "路况瞬息万变，AI 必须在毫秒内做出决策。"}, {"text": "需要保证行驶_____", "answer": "安全", "hints": ["安全", "速度", "舒适", "美观"], "explanation": "安全是自动驾驶最重要的目标，比速度和舒适更重要。"}]},
    26: {type:'选择',title:'AI + 游戏',prompt:'以下哪个是 AI 在游戏中的应用？',options:[
      {text:'AI 可以生成游戏关卡',correct:true},
      {text:'AI 可以代替玩家玩游戏',correct:false},
      {text:'AI 只能用于游戏测试',correct:false},
      {text:'AI 不能用于游戏开发',correct:false}
    ]},
    27: {"type": "fillblank", "title": "AI + 天气预报", "prompt": "填写 AI 在天气预报中的作用。（点击选项卡选择答案）", "blanks": [{"text": "AI 可以分析大量_____数据", "answer": "气象", "hints": ["气象", "财务", "人事", "销售"], "explanation": "气象数据包括温度、湿度、气压、风速等，AI 可以快速处理这些复杂数据。"}, {"text": "AI 可以提高预报_____精度", "answer": "准确", "hints": ["准确", "模糊", "大概", "粗略"], "explanation": "AI 能发现人类难以察觉的规律，让天气预报更准确。"}, {"text": "AI 可以预测极端_____事件", "answer": "天气", "hints": ["天气", "交通", "经济", "政治"], "explanation": "AI 可以提前预警台风、暴雨等极端天气，保护人们安全。"}, {"text": "AI 可以提供更_____的预报", "answer": "及时", "hints": ["及时", "延迟", "缓慢", "过时"], "explanation": "AI 可以实时更新预报，让人们及时了解天气变化。"}]},
    28: {type:'选择',title:'AI + 环境保护',prompt:'以下哪个是 AI 在环保领域的应用？',options:[
      {text:'AI 可以监测空气质量',correct:true},
      {text:'AI 可以制造污染',correct:false},
      {text:'AI 只能用于环保宣传',correct:false},
      {text:'AI 不能用于环境保护',correct:false}
    ]},
    29: {"type": "fillblank", "title": "AI + 安全", "prompt": "填写 AI 在安全领域的应用。（点击选项卡选择答案）", "blanks": [{"text": "AI 可以识别_____威胁", "answer": "网络", "hints": ["网络", "物理", "心理", "环境"], "explanation": "AI 可以实时监控网络流量，识别黑客攻击和病毒威胁。"}, {"text": "AI 可以监控_____安全", "answer": "公共", "hints": ["公共", "私人", "虚拟", "抽象"], "explanation": "AI 可以分析监控视频，帮助维护公共场所的安全。"}, {"text": "AI 可以预防_____犯罪", "answer": "金融", "hints": ["金融", "交通", "环境", "文化"], "explanation": "AI 可以识别异常交易模式，预防信用卡诈骗、洗钱等金融犯罪。"}, {"text": "AI 可以提供_____认证", "answer": "身份", "hints": ["身份", "学历", "年龄", "性别"], "explanation": "人脸识别、指纹识别等 AI 技术可以快速验证身份。"}]},
    30: {type:'选择',title:'未来职业思考',prompt:'以下哪个是 AI 时代最需要的能力？',options:[
      {text:'打字速度',correct:false},
      {text:'批判性思维和学习能力',correct:true},
      {text:'体力劳动',correct:false},
      {text:'记忆力',correct:false}
    ]},
    31: {"type": "fillblank", "title": "AI 公益案例", "prompt": "填写 AI 在公益领域的应用。（点击选项卡选择答案）", "blanks": [{"text": "AI 可以帮助寻找_____人口", "answer": "失踪", "hints": ["失踪", "流动", "固定", "临时"], "explanation": "AI 可以通过人脸识别技术帮助寻找走失的老人和儿童。"}, {"text": "AI 可以优化_____资源分配", "answer": "慈善", "hints": ["慈善", "娱乐", "体育", "艺术"], "explanation": "AI 可以分析需求，帮助慈善机构更有效地分配资源。"}, {"text": "AI 可以分析社会_____问题", "answer": "公益", "hints": ["公益", "经济", "政治", "文化"], "explanation": "AI 可以分析社会数据，发现需要帮助的群体和问题。"}, {"text": "AI 可以提供_____教育支持", "answer": "远程", "hints": ["远程", "现场", "线下", "面对面"], "explanation": "AI 可以让优质教育资源覆盖偏远地区，帮助更多孩子学习。"}]},
    32: {type:'选择',title:'编程少年项目',prompt:'以下哪个是青少年可以用 AI 做的项目？',options:[
      {text:'开发智能垃圾分类系统',correct:true},
      {text:'制造火箭',correct:false},
      {text:'运营大型工厂',correct:false},
      {text:'管理国家政策',correct:false}
    ]},
    33: {type:'提示词',title:'AI 创业思考',prompt:'用一段话描述一个青少年可以用 AI 解决的社会问题：',placeholder:'思考：什么问题困扰着你身边的人？AI 能怎么帮助？'},
    34: {"type": "fillblank", "title": "学校 AI 实验室", "prompt": "填写学校 AI 实验室的功能。（点击选项卡选择答案）", "blanks": [{"text": "提供_____学习环境", "answer": "动手", "hints": ["动手", "理论", "被动", "抽象"], "explanation": "AI 实验室让学生可以亲手操作，体验 AI 技术。"}, {"text": "支持_____项目开发", "answer": "AI", "hints": ["AI", "体育", "艺术", "音乐"], "explanation": "学生可以在实验室里开发自己的 AI 项目。"}, {"text": "促进_____合作", "answer": "团队", "hints": ["团队", "个人", "竞争", "独立"], "explanation": "AI 项目通常需要团队合作，培养协作能力。"}, {"text": "培养_____思维", "answer": "创新", "hints": ["创新", "保守", "传统", "固定"], "explanation": "AI 实验室鼓励学生创新思考，尝试新方法。"}]},
    35: {type:'选择',title:'青少年 AI 行动',prompt:'以下哪个是青少年现在就可以做的 AI 实践？',options:[
      {text:'用 AI 工具完成学校作业',correct:true},
      {text:'开发商业 AI 产品',correct:false},
      {text:'创建 AI 公司',correct:false},
      {text:'发明新的 AI 算法',correct:false}
    ]},
    36: {"type": "fillblank", "title": "发现真实问题", "prompt": "填写发现问题的关键步骤。（点击选项卡选择答案）", "blanks": [{"text": "观察生活中的_____和需求", "answer": "痛点", "hints": ["痛点", "乐趣", "优点", "特点"], "explanation": "痛点是人们遇到的问题和困难，这是创新的起点。"}, {"text": "与_____交流了解需求", "answer": "用户", "hints": ["用户", "机器", "动物", "植物"], "explanation": "只有和潜在用户交流，才能真正了解他们的需求。"}, {"text": "分析问题的_____和影响", "answer": "原因", "hints": ["原因", "结果", "表面", "现象"], "explanation": "找到问题的根本原因，才能设计出好的解决方案。"}, {"text": "确定问题的_____和范围", "answer": "优先级", "hints": ["优先级", "难度", "复杂度", "重要性"], "explanation": "不是所有问题都同样重要，要先解决最关键的问题。"}]},
    37: {type:'选择',title:'方案设计原则',prompt:'以下哪个是好的 AI 解决方案应该具备的特点？',options:[
      {text:'技术最先进',correct:false},
      {text:'真正解决用户问题',correct:true},
      {text:'功能最多',correct:false},
      {text:'开发最快',correct:false}
    ]},
    38: {"type": "fillblank", "title": "原型开发步骤", "prompt": "填写制作 AI 原型的关键步骤。（点击选项卡选择答案）", "blanks": [{"text": "选择合适的_____工具", "answer": "开发", "hints": ["开发", "绘画", "音乐", "运动"], "explanation": "选择合适的编程工具和平台，让开发更高效。"}, {"text": "收集和整理_____数据", "answer": "训练", "hints": ["训练", "娱乐", "休息", "游戏"], "explanation": "训练数据是 AI 学习的基础，要收集相关、准确的数据。"}, {"text": "训练和优化模型", "answer": "模型", "hints": ["模型", "数据", "界面", "声音"], "explanation": "用数据训练模型，不断调整参数让模型更准确。"}, {"text": "测试和_____功能", "answer": "调试", "hints": ["调试", "删除", "隐藏", "复制"], "explanation": "测试发现 Bug，调试修复问题，确保功能正常。"}]},
    39: {type:'选择',title:'测试改进方法',prompt:'以下哪个是测试 AI 项目的好方法？',options:[
      {text:'只测试正常情况',correct:false},
      {text:'邀请真实用户试用并收集反馈',correct:true},
      {text:'自己觉得好就行',correct:false},
      {text:'等开发完再测试',correct:false}
    ]},
    40: {type:'提示词',title:'作品展示思考',prompt:'用一段话介绍你的 AI 项目，包括：解决了什么问题、用了什么技术、有什么创新点：',placeholder:'思考：你的项目有什么独特之处？为什么别人应该关注？'}
  };
  return map[ep.id] || null;
}

function renderFillBlank(ep, practice, ps) {
  var inputs = practice.blanks.map(function(b, i) {
    var val = ps['blank_'+i] || '';
    var checked = ps['checked'];
    var cls = '';
    if (checked) cls = val.toLowerCase() === b.answer.toLowerCase() ? 'correct' : 'wrong';

    // Hidden input to store value
    var inputHtml = '<input type="hidden" id="blank_'+ep.id+'_'+i+'" value="'+val+'">';

    // Display the selected answer or placeholder
    var displayVal = val || '______';
    var displayCls = val ? 'blank-filled' : 'blank-empty';

    // Hint buttons (clickable options)
    var hintsHtml = '';
    if (b.hints && b.hints.length > 0) {
      var hintBtns = b.hints.map(function(h) {
        var selected = val === h ? ' selected' : '';
        return '<button class="blank-hint-btn'+selected+'" onclick="selectBlankHint('+ep.id+','+i+',\''+h+'\')">'+h+'</button>';
      }).join('');
      hintsHtml = '<div class="blank-hints">'+hintBtns+'</div>';
    }

    var lineText;
    if (b.text.indexOf('_____') !== -1) {
      lineText = b.text.replace('_____', '<span class="blank-display '+cls+' '+displayCls+'">'+displayVal+'</span>');
    } else if (b.text.indexOf('→') !== -1) {
      lineText = b.text.replace('→', '→ <span class="blank-display '+cls+' '+displayCls+'">'+displayVal+'</span>');
    } else {
      lineText = b.text + ' <span class="blank-display '+cls+' '+displayCls+'">'+displayVal+'</span>';
    }

    // Explanation (shown after check)
    var explHtml = '';
    if (checked && b.explanation) {
      explHtml = '<div class="blank-explanation">'+b.explanation+'</div>';
    }

    return '<div class="blank-item"><p style="color:var(--text);margin-bottom:.35rem">'+lineText+'</p>'+inputHtml+hintsHtml+explHtml+'</div>';
  }).join('');

  var resultHtml = '';
  if (ps.checked) {
    var allCorrect = ps.correctCount === practice.blanks.length;
    resultHtml = '<div class="practice-result"><h4>'+(ps.correctCount||0)+'/'+practice.blanks.length+' 正确</h4>';
    if (!allCorrect) {
      var corrections = practice.blanks.map(function(b, i) {
        var val = ps['blank_'+i] || '';
        if (val.toLowerCase() !== b.answer.toLowerCase()) {
          return '<li>正确答案：<b style="color:var(--success)">'+b.answer+'</b></li>';
        }
        return '';
      }).filter(function(s){return s;}).join('');
      if (corrections) resultHtml += '<ul style="margin-top:.5rem;padding-left:1.5rem;color:var(--text-muted)">'+corrections+'</ul>';
    } else {
      resultHtml += '<p>全部正确，太棒了！</p>';
    }
    resultHtml += '</div>';
  }

  return '<div class="practice-section"><h3>✏️ 动手练习：'+practice.title+'</h3>'+
    '<div class="practice-prompt"><div class="label">练习任务</div><p>'+practice.prompt+'</p></div>'+
    '<div class="blank-container">'+inputs+'</div>'+
    '<div class="practice-actions"><button class="btn btn-primary btn-sm" onclick="checkBlanks('+ep.id+')">检查答案</button>'+
    '<button class="btn btn-secondary btn-sm" onclick="resetPractice('+ep.id+')">重新填写</button></div>'+
    resultHtml+'</div>';
}

function renderSortPractice(ep, practice, ps) {
  var items = ps['排序'] || practice.items.slice();
  if (!ps['排序']) {
    items = practice.items.slice();
    // Shuffle
    for (var i = items.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = items[i]; items[i] = items[j]; items[j] = tmp;
    }
    STATE.practiceStates[ep.id] = STATE.practiceStates[ep.id] || {};
    STATE.practiceStates[ep.id]['排序'] = items;
  }
  var currentItems = STATE.practiceStates[ep.id]['排序'] || items;

  var itemHtml = currentItems.map(function(item, i) {
    return '<div class="drag-item" draggable="true" ondragstart="dragStart(event,'+i+')" ondragend="dragEnd(event)">'+(i+1)+'. '+item+'</div>';
  }).join('');

  var correctOrder = practice.items;

  return '<div class="practice-section"><h3>🔄 排序练习：'+practice.title+'</h3>'+
    '<div class="practice-prompt"><div class="label">练习任务</div><p>'+practice.prompt+'</p></div>'+
    '<div class="drag-container" id="sortContainer_'+ep.id+'" ondragover="event.preventDefault()" ondrop="dropItem(event,'+ep.id+')">'+itemHtml+'</div>'+
    '<div class="practice-actions"><button class="btn btn-primary btn-sm" onclick="checkSort('+ep.id+')">检查顺序</button>'+
    '<button class="btn btn-secondary btn-sm" onclick="resetSort('+ep.id+')">重新排列</button></div>'+
    (ps['排序Checked']?'<div class="practice-result"><h4>'+(ps['排序Correct']?'✅ 顺序正确！':'❌ 顺序不对，再试试')+'</h4>'+
    (ps['排序Correct']?'':'<p style="margin-top:.5rem;color:var(--text-muted)"><b>正确顺序：</b>'+correctOrder.map(function(item,i){return (i+1)+'. '+item;}).join(' → ')+'</p>')+
    '</div>':'')+
    '</div>';
}

function renderPromptPractice(ep, practice, ps) {
  var val = ps['prompt_input'] || '';
  return '<div class="practice-section"><h3>✍️ 提示词练习：'+practice.title+'</h3>'+
    '<div class="practice-prompt"><div class="label">练习任务</div><p>'+practice.prompt+'</p></div>'+
    '<textarea class="practice-input" id="promptInput_'+ep.id+'" placeholder="'+(practice.placeholder||'在这里输入你的提示词...')+'" onchange="updatePrompt('+ep.id+',this.value)">'+val+'</textarea>'+
    '<div class="practice-actions"><button class="btn btn-primary btn-sm" onclick="showPromptTips()">查看提示词技巧</button>'+
    '<button class="btn btn-secondary btn-sm" onclick="resetPractice('+ep.id+')">清空重写</button></div>'+
    '<div id="promptTips_'+ep.id+'" style="display:none;margin-top:1rem;padding:1rem;background:var(--bg);border-radius:8px;border:1px solid var(--border)">'+
    '<p style="font-size:.85rem;color:var(--text-muted)"><b>提示词技巧：</b><br>'+
    '1. 说清楚你要什么（具体任务）<br>2. 给上下文（给谁看、什么场景）<br>'+
    '3. 指定格式（字数、风格、结构）<br>4. 分步骤来（先做什么后做什么）</p></div></div>';
}

function renderChoicePractice(ep, practice, ps) {
  var options = practice.options.map(function(opt, i) {
    var cls = 'quiz-option';
    if (ps['choice_checked']) {
      cls += ' disabled';
      if (opt.correct) cls += ' correct';
      else if (i === ps['choice_selected'] && !opt.correct) cls += ' wrong';
    } else if (i === ps['choice_selected']) {
      cls += ' selected';
    }
    return '<div class="'+cls+'" onclick="selectPracticeChoice('+ep.id+','+i+')">'+opt.text+'</div>';
  }).join('');

  return '<div class="practice-section"><h3>🧪 练习：'+practice.title+'</h3>'+
    '<div class="practice-prompt"><div class="label">练习任务</div><p>'+practice.prompt+'</p></div>'+
    '<div class="quiz-options">'+options+'</div>'+
    '<div class="practice-actions"><button class="btn btn-primary btn-sm" onclick="checkChoice('+ep.id+')">检查答案</button>'+
    '<button class="btn btn-secondary btn-sm" onclick="resetPractice('+ep.id+')">重新选择</button></div>'+
    (ps['choice_checked']?'<div class="practice-result"><h4>'+(ps['choice_correct']?'✅ 正确！':'❌ 不正确')+'</h4>'+
    (ps['choice_correct']?'':'<p style="margin-top:.5rem;color:var(--text-muted)"><b>正确答案：</b>'+practice.options.find(function(o){return o.correct;}).text+'</p>')+
    '</div>':'')+
    '</div>';
}

function renderYesNoPractice(ep, practice, ps) {
  var items = practice.items.map(function(item, i) {
    var selected = ps['yesno_'+i];
    var checked = ps['yesno_checked'];
    var btnYesCls = 'yesno-btn yesno-yes';
    var btnNoCls = 'yesno-btn yesno-no';
    if (selected === true) btnYesCls += ' selected';
    if (selected === false) btnNoCls += ' selected';
    if (checked) {
      if (item.answer === true) btnYesCls += ' correct';
      else btnNoCls += ' correct';
      if (selected === true && item.answer !== true) btnYesCls += ' wrong';
      if (selected === false && item.answer !== false) btnNoCls += ' wrong';
    }
    return '<div class="yesno-item">'+
      '<p class="yesno-text">'+item.text+'</p>'+
      '<div class="yesno-buttons">'+
      '<button class="'+btnYesCls+'" onclick="selectYesNo('+ep.id+','+i+',true)"'+(checked?' disabled':'')+'>是</button>'+
      '<button class="'+btnNoCls+'" onclick="selectYesNo('+ep.id+','+i+',false)"'+(checked?' disabled':'')+'>否</button>'+
      '</div></div>';
  }).join('');

  var resultHtml = '';
  if (ps['yesno_checked']) {
    var correct = 0;
    practice.items.forEach(function(item, i) {
      if (ps['yesno_'+i] === item.answer) correct++;
    });
    var allCorrect = correct === practice.items.length;
    resultHtml = '<div class="practice-result"><h4>'+correct+'/'+practice.items.length+' 正确</h4>';
    if (allCorrect) {
      resultHtml += '<p>全部正确，太棒了！</p>';
    } else {
      resultHtml += '<ul style="margin-top:.5rem;padding-left:1.5rem;color:var(--text-muted)">';
      practice.items.forEach(function(item, i) {
        if (ps['yesno_'+i] !== item.answer) {
          resultHtml += '<li>'+item.text+' → 应为：<b style="color:var(--success)">'+(item.answer?'是':'否')+'</b></li>';
        }
      });
      resultHtml += '</ul>';
    }
    resultHtml += '</div>';
  }

  return '<div class="practice-section"><h3>✏️ 动手练习：'+practice.title+'</h3>'+
    '<div class="practice-prompt"><div class="label">练习任务</div><p>'+practice.prompt+'</p></div>'+
    items+
    '<div class="practice-actions"><button class="btn btn-primary btn-sm" onclick="checkYesNo('+ep.id+')">检查答案</button>'+
    '<button class="btn btn-secondary btn-sm" onclick="resetPractice('+ep.id+')">重新选择</button></div>'+
    resultHtml+'</div>';
}

function selectYesNo(epId, idx, val) {
  var ps = STATE.practiceStates[epId] || {};
  if (ps['yesno_checked']) return;
  ps['yesno_'+idx] = val;
  STATE.practiceStates[epId] = ps;
  renderCurrentPage();
}
function checkYesNo(epId) {
  var ps = STATE.practiceStates[epId] || {};
  var practice = getPracticeForEp(epId);
  if (!practice) return;
  var answered = 0;
  practice.items.forEach(function(_, i) {
    if (ps['yesno_'+i] !== undefined) answered++;
  });
  if (answered < practice.items.length) {
    alert('请先回答所有问题！');
    return;
  }
  ps['yesno_checked'] = true;
  var correct = 0;
  practice.items.forEach(function(item, i) {
    if (ps['yesno_'+i] === item.answer) correct++;
  });
  STATE.practiceStates[epId] = ps;

  if (correct === practice.items.length) {
    playSound('correct');
    triggerConfetti();
  } else {
    playSound('wrong');
  }
  renderCurrentPage();
}

// Practice interactions
function updateBlank(epId, idx, val) {
  // Input validation
  if (typeof val !== 'string') return;
  if (val.length > 100) val = val.substring(0, 100);
  // Sanitize input - remove potentially dangerous characters
  val = val.replace(/[<>]/g, '');

  STATE.practiceStates[epId] = STATE.practiceStates[epId] || {};
  STATE.practiceStates[epId]['blank_'+idx] = val;
}

function selectBlankHint(epId, idx, val) {
  STATE.practiceStates[epId] = STATE.practiceStates[epId] || {};
  STATE.practiceStates[epId]['blank_'+idx] = val;
  renderCurrentPage();
}

function checkBlanks(epId) {
  var ps = STATE.practiceStates[epId] || {};
  var practice = getPracticeForEp(epId);
  if (!practice) return;
  var correct = 0;
  practice.blanks.forEach(function(b, i) {
    var val = ps['blank_'+i] || '';
    if (val.toLowerCase() === b.answer.toLowerCase()) correct++;
  });
  ps.checked = true;
  ps.correctCount = correct;
  STATE.practiceStates[epId] = ps;

  // Sound + confetti feedback
  if (correct === practice.blanks.length) {
    SoundEngine.playCorrect();
    setTimeout(function(){ Confetti.burst(window.innerWidth/2, window.innerHeight/3, 25); }, 100);
  } else if (correct > 0) {
    SoundEngine.playCorrect();
  } else {
    SoundEngine.playIncorrect();
  }

  // Gamification: XP for practice
  var xpGain = correct * 5;
  if (correct === practice.blanks.length) xpGain += 10; // Perfect bonus
  GamificationStore.addXP(xpGain);

  renderCurrentPage();
}
function getPracticeForEp(epId) {
  var ep = null;
  COURSE_DATA.modules.forEach(function(m) { m.episodes.forEach(function(e) { if (e.id === epId) ep = e; }); });
  if (!ep) return null;
  return ep.practice || getDefaultPractice(ep);
}
function getEpisodeById(epId) {
  var ep = null;
  COURSE_DATA.modules.forEach(function(m) { m.episodes.forEach(function(e) { if (e.id === epId) ep = e; }); });
  return ep;
}
function toggleResource(epId, idx) {
  STATE.practiceStates[epId] = STATE.practiceStates[epId] || {};
  var key = 'res_'+epId+'_'+idx;
  STATE.practiceStates[epId][key] = !STATE.practiceStates[epId][key];
  renderCurrentPage();
}
function resetPractice(epId) {
  STATE.practiceStates[epId] = {};
  renderCurrentPage();
}
function updatePrompt(epId, val) {
  // Input validation
  if (typeof val !== 'string') return;
  if (val.length > 500) val = val.substring(0, 500);
  // Sanitize input - remove potentially dangerous characters
  val = val.replace(/[<>]/g, '');

  STATE.practiceStates[epId] = STATE.practiceStates[epId] || {};
  STATE.practiceStates[epId]['prompt_input'] = val;
}
function showPromptTips() {
  // Toggle all tip panels
  document.querySelectorAll('[id^="promptTips_"]').forEach(function(el) {
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
  });
}
function selectPracticeChoice(epId, idx) {
  var ps = STATE.practiceStates[epId] || {};
  if (ps['choice_checked']) return;
  ps['choice_selected'] = idx;
  STATE.practiceStates[epId] = ps;
  renderCurrentPage();
}
function checkChoice(epId) {
  var ps = STATE.practiceStates[epId] || {};
  if (ps['choice_selected'] === undefined) return;
  var practice = getPracticeForEp(epId);
  if (!practice) return;
  ps['choice_checked'] = true;
  ps['choice_correct'] = practice.options[ps['choice_selected']].correct;
  STATE.practiceStates[epId] = ps;

  // Sound + confetti feedback
  if (ps['choice_correct']) {
    SoundEngine.playCorrect();
    setTimeout(function(){ Confetti.burst(window.innerWidth/2, window.innerHeight/3, 20); }, 100);
    GamificationStore.addXP(10);
  } else {
    SoundEngine.playIncorrect();
  }

  renderCurrentPage();
}

// Sort interactions
var dragIdx = null;
function dragStart(e, idx) { dragIdx = idx; e.dataTransfer.effectAllowed = 'move'; }
function dragEnd(e) { dragIdx = null; }
function dropItem(e, epId) {
  e.preventDefault();
  if (dragIdx === null) return;
  var ps = STATE.practiceStates[epId] || {};
  var items = ps['排序'] || [];
  var target = e.target.closest('.drag-item');
  if (!target) return;
  var items2 = Array.prototype.slice.call(target.parentNode.children);
  var targetIdx = items2.indexOf(target);
  if (targetIdx === -1 || targetIdx === dragIdx) return;
  var moved = items.splice(dragIdx, 1)[0];
  items.splice(targetIdx, 0, moved);
  ps['排序'] = items;
  STATE.practiceStates[epId] = ps;
  renderCurrentPage();
}
function checkSort(epId) {
  var ps = STATE.practiceStates[epId] || {};
  var practice = getPracticeForEp(epId);
  if (!practice) return;
  var current = ps['排序'] || [];
  var correct = JSON.stringify(current) === JSON.stringify(practice.items);
  ps['排序Checked'] = true;
  ps['排序Correct'] = correct;
  STATE.practiceStates[epId] = ps;

  // Sound + confetti feedback
  if (correct) {
    SoundEngine.playCorrect();
    setTimeout(function(){ Confetti.burst(window.innerWidth/2, window.innerHeight/3, 25); }, 100);
    GamificationStore.addXP(15);
  } else {
    SoundEngine.playIncorrect();
  }

  renderCurrentPage();
}
function resetSort(epId) {
  var practice = getPracticeForEp(epId);
  if (!practice) return;
  var items = practice.items.slice();
  for (var i = items.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = items[i]; items[i] = items[j]; items[j] = tmp;
  }
  STATE.practiceStates[epId] = {'排序': items};
  renderCurrentPage();
}

// ===== SECTIONS =====
function renderSection(s, ep) {
  switch(s.type) {
    case 'text': return '<div class="content-block fade-in">'+(s.title?'<h2>'+s.title+'</h2>':'')+'<p>'+s.content+'</p></div>';
    case 'highlight': return '<div class="highlight-box fade-in">'+(s.title?'<h3 style="margin-bottom:.5rem;font-size:1rem">'+s.title+'</h3>':'')+'<p>'+s.content+'</p></div>';
    case 'analogy': return '<div class="analogy-box fade-in"><div class="label">'+(s.title||'类比')+'</div><p>'+s.content+'</p></div>';
    case 'case': return '<div class="case-box fade-in"><div class="label">'+(s.title||'案例')+'</div><p>'+s.content+'</p></div>';
    case 'table':
      if(!Array.isArray(s.content)||s.content.length<2) return '';
      var hd=s.content[0].map(function(h){return '<th>'+h+'</th>';}).join('');
      var rw=s.content.slice(1).map(function(r){return '<tr>'+r.map(function(c){return '<td>'+c+'</td>';}).join('')+'</tr>';}).join('');
      return '<div class="content-block fade-in">'+(s.title?'<h2>'+s.title+'</h2>':'')+'<div class="data-table-wrap"><table class="data-table"><thead><tr>'+hd+'</tr></thead><tbody>'+rw+'</tbody></table></div></div>';
    case 'image': return '<div class="lesson-image fade-in">'+getImageSVG(s.content,s.title,ep.id)+'</div>';
    default: return '';
  }
}

// ===== SVG =====
var _imgIdx = {};
function getImageSVG(type, title, epId) {
  // Track which illustration index to use for this episode
  _imgIdx[epId] = (_imgIdx[epId] || 0) + 1;
  var idx = _imgIdx[epId];

  if (typeof ILLUSTRATIONS !== 'undefined') {
    // 1. Try string content key (e.g. "ai-everywhere")
    if (ILLUSTRATIONS[type]) {
      return ILLUSTRATIONS[type];
    }
    // 2. Try by episode ID + index (for episodes with multiple illustrations)
    if (idx > 1) {
      var indexedKey = epId + '_' + idx;
      if (ILLUSTRATIONS[indexedKey]) {
        return ILLUSTRATIONS[indexedKey];
      }
    }
    // 3. Only use episode ID illustration for the FIRST image in the episode
    if (idx === 1 && ILLUSTRATIONS[epId]) {
      return ILLUSTRATIONS[epId];
    }
  }

  // Fallback SVGs for backward compatibility
  var fallbackSvgs = {
    'ai-everywhere': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><rect width="800" height="300" fill="#1e293b" rx="8"/><text x="400" y="35" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="sans-serif">AI 无处不在</text><rect x="80" y="80" width="60" height="100" rx="8" fill="none" stroke="#06b6d4" stroke-width="2"/><text x="110" y="210" text-anchor="middle" fill="#06b6d4" font-size="11">语音助手</text><rect x="220" y="90" width="80" height="60" rx="8" fill="none" stroke="#f59e0b" stroke-width="2"/><circle cx="260" cy="120" r="15" fill="none" stroke="#f59e0b" stroke-width="2"/><text x="260" y="210" text-anchor="middle" fill="#f59e0b" font-size="11">人脸识别</text><rect x="400" y="100" width="100" height="50" rx="12" fill="none" stroke="#10b981" stroke-width="2"/><circle cx="425" cy="155" r="10" fill="none" stroke="#10b981" stroke-width="2"/><circle cx="475" cy="155" r="10" fill="none" stroke="#10b981" stroke-width="2"/><text x="450" y="210" text-anchor="middle" fill="#10b981" font-size="11">自动驾驶</text><circle cx="600" cy="120" r="35" fill="none" stroke="#a855f7" stroke-width="2"/><text x="600" y="210" text-anchor="middle" fill="#a855f7" font-size="11">智能音箱</text><rect x="710" y="90" width="50" height="60" rx="12" fill="none" stroke="#ec4899" stroke-width="2"/><text x="735" y="210" text-anchor="middle" fill="#ec4899" font-size="11">智能手表</text><circle cx="400" cy="265" r="15" fill="#6366f1" opacity="0.3"/><text x="400" y="270" text-anchor="middle" fill="#818cf8" font-size="11" font-weight="bold">AI</text></svg>',
    'learning-process': '<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><rect width="800" height="200" fill="#1e293b" rx="8"/><rect x="50" y="60" width="150" height="80" rx="8" fill="none" stroke="#06b6d4" stroke-width="2"/><text x="125" y="95" text-anchor="middle" fill="#06b6d4" font-size="12" font-weight="bold">看数据</text><text x="125" y="115" text-anchor="middle" fill="#94a3b8" font-size="10">接收大量例子</text><line x1="200" y1="100" x2="280" y2="100" stroke="#334155" stroke-width="2"/><rect x="280" y="60" width="150" height="80" rx="8" fill="none" stroke="#f59e0b" stroke-width="2"/><text x="355" y="95" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">找规律</text><text x="355" y="115" text-anchor="middle" fill="#94a3b8" font-size="10">分析共同特征</text><line x1="430" y1="100" x2="510" y2="100" stroke="#334155" stroke-width="2"/><rect x="510" y="60" width="150" height="80" rx="8" fill="none" stroke="#10b981" stroke-width="2"/><text x="585" y="95" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">做判断</text><text x="585" y="115" text-anchor="middle" fill="#94a3b8" font-size="10">识别新东西</text><text x="400" y="180" text-anchor="middle" fill="#6366f1" font-size="11">机器学习三步曲</text></svg>',
    'neural-network': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><rect width="800" height="300" fill="#1e293b" rx="8"/><text x="400" y="30" text-anchor="middle" fill="#94a3b8" font-size="13">神经网络结构</text><text x="100" y="60" text-anchor="middle" fill="#06b6d4" font-size="11" font-weight="bold">输入层</text><text x="400" y="60" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">隐藏层</text><text x="700" y="60" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">输出层</text><circle cx="100" cy="100" r="15" fill="#06b6d4" opacity="0.3" stroke="#06b6d4" stroke-width="2"/><circle cx="100" cy="150" r="15" fill="#06b6d4" opacity="0.3" stroke="#06b6d4" stroke-width="2"/><circle cx="100" cy="200" r="15" fill="#06b6d4" opacity="0.3" stroke="#06b6d4" stroke-width="2"/><circle cx="350" cy="100" r="15" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" stroke-width="2"/><circle cx="350" cy="150" r="15" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" stroke-width="2"/><circle cx="350" cy="200" r="15" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" stroke-width="2"/><circle cx="450" cy="125" r="15" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" stroke-width="2"/><circle cx="450" cy="175" r="15" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" stroke-width="2"/><circle cx="700" cy="125" r="20" fill="#10b981" opacity="0.3" stroke="#10b981" stroke-width="2"/><circle cx="700" cy="185" r="20" fill="#10b981" opacity="0.3" stroke="#10b981" stroke-width="2"/><line x1="115" y1="100" x2="335" y2="100" stroke="#334155" stroke-width="1"/><line x1="115" y1="100" x2="335" y2="150" stroke="#334155" stroke-width="1"/><line x1="115" y1="150" x2="335" y2="150" stroke="#334155" stroke-width="1"/><line x1="115" y1="150" x2="335" y2="200" stroke="#334155" stroke-width="1"/><line x1="115" y1="200" x2="335" y2="200" stroke="#334155" stroke-width="1"/><line x1="115" y1="200" x2="350" y2="100" stroke="#334155" stroke-width="1"/><line x1="365" y1="100" x2="680" y2="125" stroke="#334155" stroke-width="1"/><line x1="365" y1="100" x2="680" y2="185" stroke="#334155" stroke-width="1"/><line x1="365" y1="150" x2="680" y2="125" stroke="#334155" stroke-width="1"/><line x1="365" y1="150" x2="680" y2="185" stroke="#334155" stroke-width="1"/><line x1="365" y1="200" x2="680" y2="125" stroke="#334155" stroke-width="1"/><line x1="365" y1="200" x2="680" y2="185" stroke="#334155" stroke-width="1"/><line x1="465" y1="125" x2="680" y2="125" stroke="#334155" stroke-width="1"/><line x1="465" y1="125" x2="680" y2="185" stroke="#334155" stroke-width="1"/><line x1="465" y1="175" x2="680" y2="125" stroke="#334155" stroke-width="1"/><line x1="465" y1="175" x2="680" y2="185" stroke="#334155" stroke-width="1"/><text x="700" y="250" text-anchor="middle" fill="#94a3b8" font-size="11">输出结果</text></svg>',
    'ai-daily-life': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><rect width="800" height="300" fill="#1e293b" rx="8"/><text x="400" y="35" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="sans-serif">日常生活中的AI应用</text><rect x="50" y="60" width="150" height="80" rx="8" fill="none" stroke="#06b6d4" stroke-width="2"/><text x="125" y="95" text-anchor="middle" fill="#06b6d4" font-size="12" font-weight="bold">手机</text><text x="125" y="115" text-anchor="middle" fill="#94a3b8" font-size="10">语音助手/拍照/推荐</text><rect x="220" y="60" width="150" height="80" rx="8" fill="none" stroke="#f59e0b" stroke-width="2"/><text x="295" y="95" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">家中</text><text x="295" y="115" text-anchor="middle" fill="#94a3b8" font-size="10">音箱/电视/扫地机</text><rect x="390" y="60" width="150" height="80" rx="8" fill="none" stroke="#10b981" stroke-width="2"/><text x="465" y="95" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">出行</text><text x="465" y="115" text-anchor="middle" fill="#94a3b8" font-size="10">导航/打车/公交</text><rect x="560" y="60" width="150" height="80" rx="8" fill="none" stroke="#ec4899" stroke-width="2"/><text x="635" y="95" text-anchor="middle" fill="#ec4899" font-size="12" font-weight="bold">学校</text><text x="635" y="115" text-anchor="middle" fill="#94a3b8" font-size="10">作业批改/翻译</text><rect x="200" y="170" width="400" height="60" rx="8" fill="none" stroke="#3b82f6" stroke-width="2"/><text x="400" y="195" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="bold">AI 已经渗透到生活的每个角落</text><text x="400" y="215" text-anchor="middle" fill="#94a3b8" font-size="10">只需要一部手机，你就在使用 AI</text></svg>',
    'ai-how-it-works': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><rect width="800" height="300" fill="#1e293b" rx="8"/><text x="400" y="35" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="sans-serif">AI 是怎么工作的</text><rect x="50" y="80" width="150" height="80" rx="8" fill="none" stroke="#06b6d4" stroke-width="2"/><text x="125" y="115" text-anchor="middle" fill="#06b6d4" font-size="12" font-weight="bold">输入</text><text x="125" y="135" text-anchor="middle" fill="#94a3b8" font-size="10">图片/文字/声音</text><line x1="200" y1="120" x2="280" y2="120" stroke="#334155" stroke-width="2"/><rect x="280" y="80" width="240" height="80" rx="8" fill="none" stroke="#f59e0b" stroke-width="2"/><text x="400" y="115" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">AI 模型处理</text><text x="400" y="135" text-anchor="middle" fill="#94a3b8" font-size="10">分析特征 → 匹配模式 → 做出判断</text><line x1="520" y1="120" x2="600" y2="120" stroke="#334155" stroke-width="2"/><rect x="600" y="80" width="150" height="80" rx="8" fill="none" stroke="#10b981" stroke-width="2"/><text x="675" y="115" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">输出</text><text x="675" y="135" text-anchor="middle" fill="#94a3b8" font-size="10">答案/预测/生成</text><rect x="150" y="190" width="500" height="60" rx="8" fill="none" stroke="#a855f7" stroke-width="2"/><text x="400" y="215" text-anchor="middle" fill="#a855f7" font-size="11" font-weight="bold">关键：AI 从大量数据中学习规律，然后用规律处理新数据</text><text x="400" y="235" text-anchor="middle" fill="#94a3b8" font-size="10">就像你看了1000张猫的照片后，一眼就能认出猫</text></svg>'
  };

  if (fallbackSvgs[type]) return fallbackSvgs[type];

  // Final fallback: generate a simple illustration with the title
  var displayTitle = title || type;
  return '<svg viewBox="0 0 800 250" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><rect width="800" height="250" fill="#1e293b" rx="8"/><circle cx="400" cy="90" r="35" fill="#6366f1" opacity="0.15" stroke="#6366f1" stroke-width="1.5"/><text x="400" y="97" text-anchor="middle" fill="#818cf8" font-size="22">💡</text><text x="400" y="155" text-anchor="middle" fill="#f1f5f9" font-size="14" font-weight="bold" font-family="sans-serif">'+displayTitle+'</text><rect x="150" y="180" width="500" height="2" rx="1" fill="#334155"/></svg>';
}

// ===== QUIZ =====
function renderQuiz(ep, qs) {
  try {
    var q=ep.quiz[qs.current]; if(!q) return '';
    var answered=qs.answers[qs.current]!==undefined, si=qs.answers[qs.current];
    var oh=q.options.map(function(opt,i){
      var c='quiz-option';
      if(answered){c+=' disabled';if(i===q.correct)c+=' correct';else if(i===si&&i!==q.correct)c+=' wrong';}
      else if(i===si) c+=' selected';
      return '<div class="'+c+'" onclick="selectQuizOption('+ep.id+','+qs.current+','+i+')">'+String.fromCharCode(65+i)+'. '+opt+'</div>';
    }).join('');
    var eh='';
    if(answered) eh='<div class="quiz-explanation"><strong>'+(si===q.correct?'✅ 正确！':'❌ 不正确')+'</strong><br>'+q.explanation+'</div>';
    var t=ep.quiz.length,c=qs.current,cc=0;
    Object.keys(qs.answers).forEach(function(idx){if(ep.quiz[parseInt(idx)]&&ep.quiz[parseInt(idx)].correct===qs.answers[idx])cc++;});
    return '<div class="quiz-container fade-in"><div class="quiz-header"><h3>📝 知识测验</h3>'+
      '<span class="quiz-progress-text">第 '+(c+1)+'/'+t+' 题'+(answered?' · 已答对 '+cc+' 题':'')+'</span></div>'+
      '<div class="quiz-question">'+q.question+'</div><div class="quiz-options">'+oh+'</div>'+eh+
      '<div class="quiz-actions"><div>'+(c>0?'<button class="btn btn-secondary btn-sm" onclick="quizNav('+ep.id+',-1)">← 上一题</button>':'')+'</div>'+
      '<div style="display:flex;gap:.5rem">'+(answered&&c<t-1?'<button class="btn btn-primary btn-sm" onclick="quizNav('+ep.id+',1)">下一题 →</button>':'')+
      (answered&&c===t-1?'<span style="font-size:.9rem;color:#10b981;font-weight:600">测验完成！答对 '+cc+'/'+t+'</span>':'')+'</div></div></div>';
  } catch(e) {
    return '<div class="quiz-container"><h3>测验加载出错</h3><p>'+e.message+'</p></div>';
  }
}
function selectQuizOption(eid,qi,oi){
  var qs=STATE.quizStates[eid]||(STATE.quizStates[eid]={current:0,answers:{}});
  if(qs.answers[qi]!==undefined)return;
  qs.answers[qi]=oi;
  // Animate answer
  var ep=getEpisodeById(eid);
  if(ep){
    var q=ep.quiz[qi];
    var isCorrect=(oi===q.correct);
    if(isCorrect){
      SoundEngine.playCorrect();
      setTimeout(function(){Confetti.burst(window.innerWidth/2,window.innerHeight/3,20);},100);
    } else {
      SoundEngine.playIncorrect();
    }
  }
  renderCurrentPage();
}
function quizNav(eid,d){if(!STATE.quizStates[eid])STATE.quizStates[eid]={current:0,answers:{}};STATE.quizStates[eid].current+=d;renderCurrentPage();}

// ===== ABOUT =====
function renderAbout() {
  return '<div class="section" style="max-width:800px"><div class="lesson-breadcrumb"><a href="#" onclick="navigateTo(\'home\');return false">首页</a> <span>›</span> <span>关于课程</span></div>'+
    '<h1 style="font-size:2rem;font-weight:800;margin-bottom:1rem">关于这门课</h1>'+
    '<div class="content-block"><h2>课程目标</h2><p>完成这40集后，你应该能够：</p>'+
    '<h3>知识层面</h3><ul><li>理解 AI 的基本概念和工作原理</li><li>了解 AI 的应用场景和局限性</li><li>知道 AI 的发展历史和未来趋势</li></ul>'+
    '<h3>能力层面</h3><ul><li>学会和 AI 有效对话（提示工程）</li><li>能够评估 AI 输出的质量</li><li>能够用 AI 辅助解决问题</li><li>能够完成一个简单的 AI 项目</li></ul>'+
    '<h3>态度层面</h3><ul><li>对 AI 保持好奇和开放</li><li>批判性地看待 AI 的能力</li><li>理解技术与人的关系</li><li>建立"我也能做到"的信心</li></ul></div>'+
    '<div class="content-block"><h2>使用建议</h2><p><b>建议节奏</b>：每周 5 集，8 周完成</p>'+
    '<table class="data-table"><thead><tr><th>周次</th><th>内容</th><th>模块</th></tr></thead><tbody>'+
    '<tr><td>第1周</td><td>第01-05集</td><td>模块一（上）</td></tr>'+
    '<tr><td>第2周</td><td>第06-10集</td><td>模块一（下）</td></tr>'+
    '<tr><td>第3周</td><td>第11-15集</td><td>模块二</td></tr>'+
    '<tr><td>第4周</td><td>第16-20集</td><td>模块三</td></tr>'+
    '<tr><td>第5周</td><td>第21-25集</td><td>模块四（上）</td></tr>'+
    '<tr><td>第6周</td><td>第26-30集</td><td>模块四（下）</td></tr>'+
    '<tr><td>第7周</td><td>第31-35集</td><td>模块五</td></tr>'+
    '<tr><td>第8周</td><td>第36-40集</td><td>模块六</td></tr>'+
    '</tbody></table></div>'+
    '<div class="content-block"><h2>每集流程</h2><ol>'+
    '<li><b>看/听</b>（5-15分钟）：核心内容</li>'+
    '<li><b>看视频</b>（3-5分钟）：推荐视频加深理解</li>'+
    '<li><b>做练习</b>（5-10分钟）：动手练习巩固知识</li>'+
    '<li><b>聊</b>（5-10分钟）：讨论引导</li>'+
    '<li><b>做活动</b>（10-20分钟）：动手活动</li>'+
    '<li><b>记</b>（5分钟）：记录收获</li></ol></div>'+
    '<div class="highlight-box"><p>最好的教育不是灌输知识，而是点燃火焰。保持好奇，保持学习，保持行动。未来是你的。</p></div></div>';
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() { renderCurrentPage(); });
