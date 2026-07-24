/**
 * Gamification Engine for AI Science Course
 * Pure vanilla JS - no dependencies
 * Persists all data in localStorage
 */

var GamificationStore = {
  KEY: 'ai-course-gamification',

  getDefault: function() {
    return {
      xp: 0,
      level: 1,
      streak: { current: 0, best: 0, lastDate: null },
      badges: [],
      completedModules: [],
      moduleProgress: {},
      stats: { totalTimeSpent: 0, questionsAnswered: 0, correctAnswers: 0 }
    };
  },

  load: function() {
    try {
      var data = JSON.parse(localStorage.getItem(this.KEY));
      return data || this.getDefault();
    } catch (e) {
      return this.getDefault();
    }
  },

  save: function(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },

  addXP: function(amount) {
    var data = this.load();
    data.xp += amount;
    this.save(data);
    this.animateXPGain(amount);
    this.checkLevelUp(data);
    return data;
  },

  checkLevelUp: function(data) {
    var xpNeeded = data.level * 100;
    if (data.xp >= xpNeeded) {
      data.level++;
      data.xp -= xpNeeded;
      this.save(data);
      this.showLevelUpAnimation(data.level);
    }
  },

  animateXPGain: function(amount) {
    var floater = document.createElement('div');
    floater.className = 'xp-floater';
    floater.textContent = '+' + amount + ' XP';
    floater.style.cssText = 'position:fixed;bottom:20%;left:50%;transform:translateX(-50%);font-size:1.5rem;font-weight:800;color:#f59e0b;text-shadow:0 0 10px rgba(245,158,11,.5);pointer-events:none;z-index:9999;animation:floatUp 1.5s forwards';
    document.body.appendChild(floater);
    setTimeout(function() { floater.remove(); }, 1500);
  },

  showLevelUpAnimation: function(level) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:10000;display:flex;align-items:center;justify-content:center;animation:fadeIn .3s';
    overlay.innerHTML = '<div style="text-align:center;animation:scaleIn .5s cubic-bezier(0.68,-0.55,0.265,1.55)"><div style="font-size:4rem;margin-bottom:1rem">🎉</div><div style="font-size:2rem;font-weight:800;background:linear-gradient(135deg,#f59e0b,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:.5rem">LEVEL UP!</div><div style="font-size:1.5rem;color:#94a3b8">等级 ' + level + '</div></div>';
    overlay.onclick = function() { overlay.remove(); };
    document.body.appendChild(overlay);
    SoundEngine.playLevelUp();
    Confetti.burst(window.innerWidth/2, window.innerHeight/2, 50);
    setTimeout(function() { overlay.remove(); }, 3000);
  },

  updateStreak: function() {
    var data = this.load();
    var today = new Date().toDateString();
    if (data.streak.lastDate === today) return data;

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (data.streak.lastDate === yesterday.toDateString()) {
      data.streak.current++;
    } else {
      data.streak.current = 1;
    }
    data.streak.lastDate = today;
    if (data.streak.current > data.streak.best) {
      data.streak.best = data.streak.current;
    }
    this.save(data);
    return data;
  },

  addBadge: function(badgeId) {
    var data = this.load();
    if (data.badges.indexOf(badgeId) === -1) {
      data.badges.push(badgeId);
      this.save(data);
      this.showBadgeAnimation(badgeId);
    }
    return data;
  },

  showBadgeAnimation: function(badgeId) {
    var badge = BADGES[badgeId];
    if (!badge) return;
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:10000;display:flex;align-items:center;justify-content:center;animation:fadeIn .3s';
    overlay.innerHTML = '<div style="text-align:center;animation:scaleIn .5s cubic-bezier(0.68,-0.55,0.265,1.55)"><div style="font-size:4rem;margin-bottom:1rem">' + badge.icon + '</div><div style="font-size:1.5rem;font-weight:800;color:#f59e0b;margin-bottom:.5rem">获得徽章！</div><div style="font-size:1.2rem;color:#f1f5f9;margin-bottom:.25rem">' + badge.name + '</div><div style="font-size:.9rem;color:#94a3b8">' + badge.desc + '</div></div>';
    overlay.onclick = function() { overlay.remove(); };
    document.body.appendChild(overlay);
    SoundEngine.playBadge();
    Confetti.burst(window.innerWidth/2, window.innerHeight/2, 40);
    setTimeout(function() { overlay.remove(); }, 3000);
  },

  recordQuiz: function(episodeId, correct, total) {
    var data = this.load();
    var key = 'ep_' + episodeId;
    if (!data.moduleProgress[key]) {
      data.moduleProgress[key] = { score: 0, attempts: 0, bestScore: 0 };
    }
    data.moduleProgress[key].attempts++;
    data.moduleProgress[key].score = correct;
    if (correct > data.moduleProgress[key].bestScore) {
      data.moduleProgress[key].bestScore = correct;
    }
    data.stats.questionsAnswered += total;
    data.stats.correctAnswers += correct;
    this.save(data);

    // XP for quiz
    var xpGain = correct * 10;
    if (correct === total) xpGain += 20; // Perfect bonus
    this.addXP(xpGain);

    // Badges
    if (correct === total) this.addBadge('perfect_quiz');
    if (data.stats.correctAnswers >= 50) this.addBadge('quiz_master');

    return data;
  }
};

// Badge definitions
var BADGES = {
  first_lesson: { name: '第一步', desc: '完成第一节课', icon: '🌟' },
  perfect_quiz: { name: '满分达人', desc: '答对所有题目', icon: '💯' },
  streak_3: { name: '三日连胜', desc: '连续学习3天', icon: '🔥' },
  streak_7: { name: '一周达人', desc: '连续学习7天', icon: '⚡' },
  quiz_master: { name: '答题大师', desc: '答对50道题', icon: '🏆' },
  explorer: { name: '探索先锋', desc: '完成第1模块', icon: '🚀' },
  scientist: { name: '小科学家', desc: '完成第2模块', icon: '🔬' },
  engineer: { name: '小工程师', desc: '完成第3模块', icon: '⚙️' },
  creator: { name: '创造者', desc: '完成第4模块', icon: '🎨' },
  master: { name: 'AI大师', desc: '完成全部课程', icon: '👑' }
};

// Sound engine using Web Audio API
var SoundEngine = {
  ctx: null,

  init: function() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playCorrect: function() {
    this.init();
    var osc = this.ctx.createOscillator();
    var gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, this.ctx.currentTime);
    osc.frequency.setValueAtTime(659, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  },

  playIncorrect: function() {
    this.init();
    var osc = this.ctx.createOscillator();
    var gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.setValueAtTime(150, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  },

  playLevelUp: function() {
    this.init();
    var freqs = [523, 659, 784, 1047];
    var self = this;
    freqs.forEach(function(freq, i) {
      var osc = self.ctx.createOscillator();
      var gain = self.ctx.createGain();
      osc.connect(gain);
      gain.connect(self.ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, self.ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.25, self.ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, self.ctx.currentTime + i * 0.12 + 0.2);
      osc.start(self.ctx.currentTime + i * 0.12);
      osc.stop(self.ctx.currentTime + i * 0.12 + 0.2);
    });
  },

  playBadge: function() {
    this.init();
    var freqs = [784, 988, 1175, 1568];
    var self = this;
    freqs.forEach(function(freq, i) {
      var osc = self.ctx.createOscillator();
      var gain = self.ctx.createGain();
      osc.connect(gain);
      gain.connect(self.ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, self.ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.2, self.ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, self.ctx.currentTime + i * 0.1 + 0.25);
      osc.start(self.ctx.currentTime + i * 0.1);
      osc.stop(self.ctx.currentTime + i * 0.1 + 0.25);
    });
  }
};

// Confetti particle system
var Confetti = {
  colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'],

  burst: function(x, y, count) {
    count = count || 30;
    for (var i = 0; i < count; i++) {
      var particle = document.createElement('div');
      particle.className = 'confetti-particle';
      var color = this.colors[Math.floor(Math.random() * this.colors.length)];
      var angle = Math.random() * Math.PI * 2;
      var velocity = 50 + Math.random() * 100;
      var dx = Math.cos(angle) * velocity;
      var dy = Math.sin(angle) * velocity - 50;

      particle.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:' + (4 + Math.random() * 6) + 'px;height:' + (4 + Math.random() * 6) + 'px;background:' + color + ';border-radius:' + (Math.random() > 0.5 ? '50%' : '2px') + ';pointer-events:none;z-index:9999;--dx:' + dx + 'px;--dy:' + dy + 'px;animation:confettiFall ' + (0.8 + Math.random() * 0.5) + 's cubic-bezier(0.25,0.46,0.45,0.94) forwards';
      document.body.appendChild(particle);
      setTimeout(function(p) { return function() { p.remove(); }; }(particle), 1500);
    }
  }
};
