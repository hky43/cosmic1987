/**
 * 统一音乐管理器
 * 负责管理整个应用的音频播放，避免多个组件同时控制音频导致冲突
 */
import { ref } from 'vue';
import { Howl, Howler } from 'howler';
import { asset } from './asset';

// 预先定义 trackGroups 数据
const trackGroupsData = {
  // 首页
  home: [
    { id: "home-1", title: "Space Odyssey", url: asset("music/深澤秀行 - innocence.mp3") },
    { id: "home-2", title: "Cosmic Journey", url: asset("music/The 1999 - 1987宇宙组曲.mp3") },
    { id: "home-3", title: "Golden Record", url: asset("music/Mili - Compass.mp3") },
  ],
  
  // About 页面
  about: [
    { id: "about-1", title: "Voyager Theme", url: asset("music/The 1999 - 冷空气.mp3") },
  ],
  
  // Travel 页面
  travel: [
    { id: "travel-1", title: "Star Travel", url: asset("music/The 1999 - 为了什么.mp3") },
  ],
  
  // CosmicArchive 页面
  cosmicArchive: [
    { id: "cosmic-1", title: "Archive Theme", url: asset("music/Brian Eno - Fine-grained.mp3") },
  ],
  
  // Future 页面
  future: [
    { id: "future-1", title: "Future Ambient", url: asset("music/The 1999 - 热茶炊.mp3") },
  ],
};

class AudioManager {
  constructor() {
    // 增大 HTML5 Audio 池大小，防止快速切换时池耗尽
    Howler.html5PoolSize = 100;

    // 当前音频实例
    this.sound = null;
    
    // 播放状态
    this.isPlaying = ref(false);
    this.volumePercent = ref(50);
    
    // 当前播放的曲目信息
    this.currentTrack = ref(null);
    this.currentTrackIndex = ref(0);
    
    // 当前播放位置（进度）
    this.currentTime = ref(0);
    
    // 正在进行的渐变动画
    this.fadeTimer = null;
    
    // 曲目列表 - 按页面分组
    this.trackGroups = trackGroupsData;
    
    // 当前所在的页面组
    this.currentGroup = ref('home');
    
    // 是否允许自动播放
    this.autoPlayEnabled = ref(true);
    
    // 主题音乐模式 - 当用户从唱片播放器进入页面时启用
    this.isThemeMusicActive = ref(false);
    this.currentThemeTrack = ref(null);
    this.homePlaybackState = null; // 保存首页音乐状态
    
    // 日志开关
    this.debug = true;
    
    // 用于管理Test02.vue等复杂音频场景的实例
    this.audioInstances = new Map();
    this.currentInstanceId = null;
    
    // 切换锁，防止快速连续切换导致竞态
    this.isSwitching = ref(false);
    
    // 上次播放的曲目ID，用于避免重复播放
    this.lastPlayedTrackId = ref(null);
    
    // 定时更新播放进度
    this.progressUpdateTimer = null;
    
    // 持久化播放状态（按页面组）
    this.playbackStates = {};
    
    // 自动播放相关
    this._autoPlayListenerSet = false; // 是否设置了用户交互监听器
    this._pendingPlayCallback = null; // 等待加载完成后的回调
    this._startTime = 0; // 音频加载后的起始播放位置
    
    // 最后处理的路径（用于 ensureGroup 校验，防止过时页面误切音乐）
    this._lastSwitchedPath = '';

    // 调试用：暴露到 window，方便浏览器控制台测试
    window.audioManager = this;
    this.log('[AudioManager] 🔧 已暴露到 window.audioManager，可在控制台测试！');
  }

  /**
   * 根据路径判断属于哪个页面组
   * @param {string} path - 路由路径
   * @returns {string} 页面组名称
   */
  getGroupFromPath(path) {
    if (path === '/' || path === '/home') return 'home';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/travel')) return 'travel';
    if (path.startsWith('/cosmic')) return 'cosmicArchive';
    if (path.startsWith('/future')) return 'future';
    if (path.startsWith('/test')) return 'test';
    return 'home'; // 默认返回首页
  }

  /**
   * 页面显式声明音频组标签
   * 由各页面 onMounted 调用，告知 audioManager 当前页面属于哪个组
   * - 同组 → 不切换，继续播放
   * - 不同组 → 保存旧状态，切换到新组
   * @param {string} tag - 组标签 (home/about/travel/cosmicArchive/future/test)
   * @param {Object} options - 配置选项
   */
  ensureGroup(tag, options = {}) {
    if (!tag || !this.trackGroups[tag]) {
      this.warn('[AudioManager] ensureGroup 收到无效标签:', tag, '，回退到 home');
      tag = 'home';
    }

    if (tag === 'test') {
      this.log('[AudioManager] test 页面，不播放音乐，释放音频实例');
      this.saveGroupState();
      this.currentGroup.value = tag;
      this.stop();
      this._removeAutoPlayListeners();
      if (this.sound) {
        this.sound.unload();
        this.sound = null;
      }
      return;
    }

    // 主题音乐模式锁定中：音乐由 LightMonologue 唱片控制，跳过标签切换
    if (this.isThemeMusicActive.value) {
      this.log('[AudioManager] 主题音乐模式锁定中，跳过标签切换 (页面标签: ' + tag + ')');
      return;
    }

    // 防竞态：如果当前路由路径与声明的标签不匹配，说明该页面已过时（快速导航导致）
    if (this._lastSwitchedPath) {
      const pathGroup = this.getGroupFromPath(this._lastSwitchedPath);
      if (pathGroup !== tag) {
        this.warn('[AudioManager] 页面标签 ' + tag + ' 与当前路径组 ' + pathGroup + ' 不匹配，忽略此次声明（页面已过时）');
        return;
      }
    }

    if (tag === this.currentGroup.value) {
      this.log('[AudioManager] 已在相同页面组 ' + tag + '，不切换音乐');
      return;
    }

    this.log('[AudioManager] 页面声明切换: ' + this.currentGroup.value + ' -> ' + tag);
    this.saveGroupState();
    this.currentGroup.value = tag;
    this.restoreGroupState(options);
  }

  /**
   * 获取当前组的曲目列表
   * @returns {Array} 曲目列表
   */
  getCurrentTracks() {
    return this.trackGroups[this.currentGroup.value] || this.trackGroups.home;
  }

  /**
   * 切换到指定页面组的音乐
   * @param {string} path - 路由路径
   * @param {Object} options - 配置选项
   */
  switchToPath(path, options = {}) {
    // 如果是主题音乐模式，不随路由切换音乐
    if (this.isThemeMusicActive.value) {
      this.log('[AudioManager] 主题音乐模式，不随路由切换音乐');
      return;
    }

    // 记录最后处理的路径（用于 ensureGroup 防竞态）
    this._lastSwitchedPath = path;
    const group = this.getGroupFromPath(path);
    
    // 情况 1：完全没有音频（首次加载或刷新）→ 根据标签匹配决策
    if (!this.sound) {
      if (group === 'test') {
        this.log('[AudioManager] 首次加载，进入 test 页面，不播放音乐');
        this.currentGroup.value = group;
        return;
      }

      const savedTag = this.currentGroup.value;
      const routeTag = group;
      const hasSavedState = !!this.playbackStates[routeTag];

      this.log(`[AudioManager] 刷新恢复 - 保存标签: ${savedTag}, 当前路由标签: ${routeTag}, 有保存状态: ${hasSavedState}`);

      if (routeTag === savedTag) {
        // 标签匹配：刷新前后在同一个页面 → 直接恢复该组状态
        this.log('[AudioManager] 标签匹配，恢复 ' + routeTag + ' 组状态');
        this.restoreGroupState(options);
      } else if (hasSavedState) {
        // 标签不匹配但有保存状态：在不同页面刷新 → 保存旧标签，切换到新标签
        this.log(`[AudioManager] 标签切换: ${savedTag} -> ${routeTag}`);
        this.saveTagState(savedTag);
        this.currentGroup.value = routeTag;
        this.restoreGroupState(options);
      } else {
        // 标签不匹配且无保存状态：首次进入该页面
        this.log('[AudioManager] 首次进入 ' + routeTag + ' 页面');
        this.currentGroup.value = routeTag;
        this.restoreGroupState(options);
      }
      return;
    }
    
    // 情况 2：已经是同一个组 → 不切换
    if (group === this.currentGroup.value) {
      this.log('[AudioManager] 已在相同页面组，不切换音乐');
      return;
    }
    
    // 情况 3：进入 test 页面 → 完全停止音乐并释放音频实例，防止误触播放
    if (group === 'test') {
      this.log('[AudioManager] 进入 test 页面，停止所有音乐并释放音频实例');
      this.saveGroupState();
      this.currentGroup.value = group;
      this._removeAutoPlayListeners();
      this.stop();
      if (this.sound) {
        this.sound.unload();
        this.sound = null;
      }
      return;
    }
    
    // 情况 4：真的切换组 → 正常流程
    this.log(`[AudioManager] 切换页面: ${this.currentGroup.value} -> ${group}`);

    // 如果正从首页离开，主动移除交互自启监听器
    // 避免残留监听器在其他页面点击触发首页音乐播放
    if (this.currentGroup.value === 'home' && group !== 'home') {
      this._removeAutoPlayListeners();
    }

    // 如果正在切换中（如首页初始化加载时用户就跳转了），强制取消当前操作
    if (this.isSwitching.value) {
      this.log('[AudioManager] 强制取消当前切换锁，准备组切换');
      this.stopFade();
      if (this.sound) {
        this.sound.stop();
        this.sound.unload();
        this.sound = null;
      }
      this.isSwitching.value = false;
      this._pendingPlayCallback = null;
      this._startTime = 0;
    }

    // 保存当前组的播放状态
    this.saveGroupState();

    // 切换到新组
    this.currentGroup.value = group;

    // 恢复新组的播放状态
    this.restoreGroupState(options);
  }

  /**
   * 设置并播放主题音乐（从唱片播放器进入页面时调用）
   * @param {Object} track - 主题音乐曲目
   * @param {Object} options - 配置选项
   */
  setThemeMusic(track, options = {}) {
    this.log('[AudioManager] 切换到主题音乐:', track);
    
    // 保存当前首页音乐状态（仅首次，避免 navigateTo 重复调用覆盖）
    if (this.currentGroup.value === 'home' && this.sound && !this.homePlaybackState) {
      this.homePlaybackState = {
        trackId: this.currentTrack.value?.id,
        trackIndex: this.currentTrackIndex.value,
        currentTime: this.getCurrentTime(),
        isPlaying: this.isPlaying.value,
        volume: this.volumePercent.value,
      };
      this.log('[AudioManager] 保存首页音乐状态:', this.homePlaybackState);
    }
    
    // 启用主题音乐模式
    this.isThemeMusicActive.value = true;
    this.currentThemeTrack.value = track;
    
    // 切换到主题音乐
    this.switchTrack(track, {
      fadeOutDuration: 500,
      fadeInDuration: 600,
      autoPlay: true,
      ...options,
    });
  }

  /**
   * 恢复首页音乐（返回首页时调用）
   */
  restoreHomeMusic() {
    if (!this.isThemeMusicActive.value) {
      this.log('[AudioManager] 不在主题音乐模式，无需恢复');
      return;
    }
    
    this.log('[AudioManager] 恢复首页音乐');
    this.isThemeMusicActive.value = false;
    this.currentThemeTrack.value = null;
    
    // 恢复到首页组
    this.currentGroup.value = 'home';
    
    if (this.homePlaybackState) {
      // 恢复之前保存的首页状态
      const tracks = this.getCurrentTracks();
      let track = tracks.find(t => t.id === this.homePlaybackState.trackId);
      let trackIndex = this.homePlaybackState.trackIndex;
      
      if (!track) {
        trackIndex = 0;
        track = tracks[0];
      }
      
      this.currentTrackIndex.value = trackIndex;
      this.switchTrack(track, {
        fadeOutDuration: 500,
        fadeInDuration: 600,
        autoPlay: this.homePlaybackState.isPlaying,
        startTime: this.homePlaybackState.currentTime,
      });
      
      if (this.homePlaybackState.volume) {
        this.setVolume(this.homePlaybackState.volume);
      }
      
      this.homePlaybackState = null;
    } else {
      // 没有保存的状态，直接播放首页默认音乐
      this.restoreGroupState();
    }
  }

  /**
   * 保存当前组的播放状态
   */
  saveGroupState() {
    const group = this.currentGroup.value;

    // 主题音乐模式下，禁止覆盖 home 组状态
    // LightMonologue setThemeMusic → switchTrack → saveGroupState 会误把唱片音乐存到 home
    // 真实 home 状态已在 setThemeMusic 中保存为 homePlaybackState
    if (this.isThemeMusicActive.value && group === 'home') {
      this.log('[AudioManager] 主题音乐模式，跳过保存 home 组状态（保护真实首页音乐）');
      return;
    }

    this.playbackStates[group] = {
      trackId: this.currentTrack.value?.id,
      trackIndex: this.currentTrackIndex.value,
      currentTime: this.getCurrentTime(),
      isPlaying: this.isPlaying.value,
      volume: this.volumePercent.value,
      savedAt: Date.now(),
    };
    this.log(`[AudioManager] 保存 ${group} 状态:`, this.playbackStates[group]);
    
    // 同时保存到 localStorage，刷新后也能恢复
    try {
      localStorage.setItem('audioPlaybackStates', JSON.stringify(this.playbackStates));
      localStorage.setItem('audioCurrentTag', group);
    } catch (e) {
      this.error('[AudioManager] 保存到 localStorage 失败', e);
    }
  }

  /**
   * 从 localStorage 恢复播放状态
   */
  loadStatesFromStorage() {
    try {
      // 始终尝试从 localStorage 恢复播放状态，不依赖 sessionStorage 标记
      // (sessionStorage 在部分浏览器/设置下刷新后可能被清空，导致状态丢失)
      const statesStr = localStorage.getItem('audioPlaybackStates');
      if (statesStr) {
        const parsed = JSON.parse(statesStr);
        // 过滤掉过期状态（超过 24 小时未更新的自动清理）
        const now = Date.now();
        const staleThreshold = 24 * 60 * 60 * 1000;
        Object.keys(parsed).forEach((key) => {
          if (parsed[key]?.savedAt && now - parsed[key].savedAt > staleThreshold) {
            delete parsed[key];
          }
        });
        this.playbackStates = parsed;
        this.log('从 localStorage 恢复播放状态', this.playbackStates);
      }

      // 恢复音乐标签（当前播放的是哪个页面组的音乐）
      const savedTag = localStorage.getItem('audioCurrentTag');
      if (savedTag) {
        this.currentGroup.value = savedTag;
        this.log('从 localStorage 恢复音乐标签:', savedTag);
      }
    } catch (e) {
      this.error('从 localStorage 恢复失败', e);
    }
  }

  /**
   * 恢复指定组的播放状态
   * @param {Object} options - 配置选项
   */
  restoreGroupState(options = {}) {
    const group = this.currentGroup.value;
    
    // test 页面：不恢复任何音乐，直接返回
    if (group === 'test') {
      this.log('[AudioManager] test 页面，不恢复任何音乐');
      return;
    }
    
    const tracks = this.getCurrentTracks();
    const state = this.playbackStates[group];
    
    if (state && tracks.length > 0) {
      // 有保存的状态：恢复到之前播放的曲目
      this.log(`[AudioManager] 恢复 ${group} 状态:`, state);
      
      let trackIndex = state.trackIndex;
      let track = tracks.find(t => t.id === state.trackId);
      
      if (!track) {
        trackIndex = 0;
        track = tracks[0];
      }
      
      this.currentTrackIndex.value = trackIndex;
      
      const { 
        fadeInDuration = 600, 
        fadeOutDuration = 500, 
        autoPlay = state.isPlaying,
        startTime = state.currentTime || 0,
      } = options;
      
      this.switchTrack(track, {
        fadeInDuration,
        fadeOutDuration,
        autoPlay: autoPlay,
        startTime,
      });
      
      if (state.volume) {
        this.setVolume(state.volume);
      }
    } else {
      // 无保存状态：真正首次进入该页面组
      this.log(`[AudioManager] ${group} 没有保存状态（首次进入），播第一首`);
      this.currentTrackIndex.value = 0;
      if (tracks.length > 0) {
        this.switchTrack(tracks[0], {
          autoPlay: false,
          ...options,
        });
      }
    }

    // home 组页面：注册交互自启监听，确保所有 home 标签页面都能"点击播放"
    if (group === 'home') {
      this._setupAutoPlayOnFirstInteraction();
    }
  }

  /**
   * 保存指定标签的播放状态（不改变 currentGroup，用于刷新时标签切换场景）
   */
  saveTagState(tag) {
    if (!this.sound) return;
    this.playbackStates[tag] = {
      trackId: this.currentTrack.value?.id,
      trackIndex: this.currentTrackIndex.value,
      currentTime: this.getCurrentTime(),
      isPlaying: this.isPlaying.value,
      volume: this.volumePercent.value,
      savedAt: Date.now(),
    };
    this.log(`[AudioManager] 保存旧标签 ${tag} 状态:`, this.playbackStates[tag]);
    try {
      localStorage.setItem('audioPlaybackStates', JSON.stringify(this.playbackStates));
    } catch (e) {
      this.error('[AudioManager] 保存标签状态失败', e);
    }
  }

  /**
   * 创建音频实例
   */
  createAudio(track, startTime = 0) {
    this.log('[AudioManager] createAudio 被调用了！', track, 'startTime:', startTime);
    
    if (!track || !track.url) {
      this.error('⚠️ 曲目信息无效', track);
      return;
    }

    // 清理旧的音频实例
    if (this.sound) {
      this.log('[AudioManager] 清理旧的音频实例');
      this.stopFade();
      this.sound.stop();
      this.sound.unload();
      this.sound = null;
    }

    this.log(`🎵 正在创建 Howl 实例: ${track.title}`);
    this.log('🎵 URL:', track.url);

    // 保存回调函数，用于加载完成后自动播放
    this._pendingPlayCallback = null;
    // 保存起始时间，用于加载后定位
    this._startTime = startTime;

    this.sound = new Howl({
      src: [track.url],
      html5: true,
      loop: true,
      volume: this.volumePercent.value / 100,
      preload: true,
      onload: () => {
        this.log(`✅ 音频加载成功: ${track.title}`);
        if (this._startTime > 0 && this.sound) {
          this.sound.seek(this._startTime);
          this.currentTime.value = this._startTime;
          this.log(`⏱️ 定位到: ${this._startTime.toFixed(2)}s`);
        }
        if (this._pendingPlayCallback) {
          this._pendingPlayCallback();
          this._pendingPlayCallback = null;
        }
      },
      onloaderror: (id, error) => {
        this.error(`❌ 音频加载失败: ${track.title}`, error);
        this._pendingPlayCallback = null;
        this._startTime = 0;
        this.isSwitching.value = false;
      },
      onplayerror: (id, error) => {
        this.error('❌ 播放失败', error);
        const currentSound = this.sound;
        if (!currentSound) return;
        currentSound.once('unlock', () => {
          if (this.sound === currentSound) {
            currentSound.play();
          }
        });
      },
      onplay: () => {
        this.isPlaying.value = true;
        // 启动进度更新定时器
        this.startProgressUpdate();
      },
      onpause: () => {
        this.isPlaying.value = false;
        // 暂停时更新当前时间
        if (this.sound) {
          this.currentTime.value = this.sound.seek();
        }
        // 停止进度更新定时器
        this.stopProgressUpdate();
      },
      onstop: () => {
        this.isPlaying.value = false;
        this.currentTime.value = 0;
        this.stopProgressUpdate();
      },
    });

    this.currentTrack.value = track;
  }

  /**
   * 启动播放进度定时更新
   */
  startProgressUpdate() {
    if (this.progressUpdateTimer) {
      clearInterval(this.progressUpdateTimer);
    }
    this.progressUpdateTimer = setInterval(() => {
      if (this.sound && this.isPlaying.value) {
        const seek = this.sound.seek();
        if (seek !== undefined && !isNaN(seek)) {
          this.currentTime.value = seek;
        }
      }
    }, 100); // 每100ms更新一次
  }

  /**
   * 停止播放进度更新
   */
  stopProgressUpdate() {
    if (this.progressUpdateTimer) {
      clearInterval(this.progressUpdateTimer);
      this.progressUpdateTimer = null;
    }
  }

  /**
   * 淡入播放
   */
  fadeIn(duration = 600) {
    if (!this.sound) {
      this.log('⚠️ 没有音频实例，无法淡入');
      return;
    }

    this.stopFade();
    
    const targetVolume = this.volumePercent.value / 100;
    this.sound.volume(0); // 从0开始
    this.sound.fade(0, targetVolume, duration);
  }

  /**
   * 淡出停止
   */
  fadeOut(duration = 500) {
    if (!this.sound) {
      this.log('⚠️ 没有音频实例，无法淡出');
      return;
    }

    this.stopFade();
    
    const currentVolume = this.sound.volume();
    this.sound.fade(currentVolume, 0, duration);
  }

  /**
   * 停止渐变动画
   */
  stopFade() {
    if (this.fadeTimer) {
      clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }
  }

  /**
   * 切换播放/暂停
   */
  toggle() {
    if (!this.sound) {
      this.log('⚠️ 没有音频实例，尝试创建...');
      const tracks = this.getCurrentTracks();
      if (tracks.length > 0) {
        this.createAudio(tracks[this.currentTrackIndex.value]);
      }
    }

    if (!this.sound) return;

    if (this.isPlaying.value) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * 获取当前播放进度
   */
  getCurrentTime() {
    if (this.sound && this.isPlaying.value) {
      const seek = this.sound.seek();
      return seek !== undefined ? seek : this.currentTime.value;
    }
    return this.currentTime.value;
  }

  /**
   * 设置播放位置
   */
  seek(time) {
    if (this.sound) {
      this.sound.seek(time);
      this.currentTime.value = time;
      this.log(`⏱️ 跳转到: ${time.toFixed(2)}s`);
    }
  }

  /**
   * 播放
   */
  play() {
    // test 页面：拒绝播放任何全局音乐
    if (this.currentGroup.value === 'test') {
      this.log('🔕 test 页面，拒绝播放');
      return Promise.reject(new Error('Music disabled on test page'));
    }

    if (!this.sound) {
      this.log('⚠️ 没有音频实例');
      return Promise.reject(new Error('No audio instance'));
    }

    return new Promise((resolve, reject) => {
      try {
        this.sound.play();
        this.isPlaying.value = true;
        this.log('▶️ 开始播放');
        resolve();
      } catch (err) {
        this.log('⚠️ 播放失败', err);
        this.isPlaying.value = false;
        reject(err);
      }
    });
  }

  /**
   * 暂停
   */
  pause() {
    if (!this.sound) {
      this.log('⚠️ 没有音频实例');
      return;
    }

    this.sound.pause();
    this.isPlaying.value = false;
    this.log('⏸️ 暂停播放');
  }

  /**
   * 停止并重置
   */
  stop() {
    if (!this.sound) return;

    this.stopFade();
    this.sound.stop();
    this.isPlaying.value = false;
    this.log('⏹️ 停止播放');
  }

  /**
   * 设置音量
   */
  setVolume(percent) {
    this.volumePercent.value = Math.max(0, Math.min(100, percent));
    
    if (this.sound) {
      this.sound.volume(this.volumePercent.value / 100);
    }
    
    this.log(`🔊 音量设置为: ${this.volumePercent.value}%`);
  }

  /**
   * 切换到指定曲目
   */
  switchTrack(track, options = {}) {
    this.log('🎵 switchTrack called with track:', track);
    this.log('🎵 Current group:', this.currentGroup.value);
    this.log('🎵 Current tracks:', this.getCurrentTracks());
    
    // 检查是否正在切换
    if (this.isSwitching.value) {
      this.log('⚠️ 正在切换曲目，请稍后');
      return Promise.resolve();
    }

    // 检查是否重复播放同一首
    if (track.id && this.currentTrack.value?.id === track.id && this.isPlaying.value) {
      this.log(`⚠️ 已在播放: ${track.title}，无需重复切换`);
      return Promise.resolve();
    }

    const { fadeOutDuration = 500, fadeInDuration = 600, autoPlay = true, startTime = 0 } = options;

    // 标记正在切换
    this.isSwitching.value = true;
    
    // 更新 currentTrackIndex - 在当前组中查找该曲目的索引
    const tracks = this.getCurrentTracks();
    const trackIndex = tracks.findIndex(t => t.id === track.id);
    this.log('🎵 Found track index:', trackIndex);
    if (trackIndex !== -1) {
      this.currentTrackIndex.value = trackIndex;
      this.log('🎵 Updated currentTrackIndex to:', trackIndex);
    }

    return new Promise((resolve) => {
      const hasSound = this.sound && this.isPlaying.value;

      if (hasSound) {
        this.fadeOut(fadeOutDuration);
        setTimeout(() => {
          this.createAudio(track, startTime);
          if (autoPlay && this.autoPlayEnabled.value) {
            // 等待音频加载完成后再播放
            this._playWhenReady(fadeInDuration, () => {
              this.lastPlayedTrackId.value = track.id;
              this.isSwitching.value = false;
              this.saveGroupState(); // 切换曲目后保存状态
              resolve();
            });
          } else {
            this.lastPlayedTrackId.value = track.id;
            this.isSwitching.value = false;
            this.saveGroupState(); // 切换曲目后保存状态
            resolve();
          }
        }, fadeOutDuration);
      } else {
        this.createAudio(track, startTime);
        if (autoPlay && this.autoPlayEnabled.value) {
          // 等待音频加载完成后再播放
          this._playWhenReady(fadeInDuration, () => {
            this.lastPlayedTrackId.value = track.id;
            this.isSwitching.value = false;
            this.saveGroupState(); // 切换曲目后保存状态
            resolve();
          });
        } else {
          this.lastPlayedTrackId.value = track.id;
          this.isSwitching.value = false;
          this.saveGroupState(); // 切换曲目后保存状态
          resolve();
        }
      }
    });
  }

  /**
   * 等待音频加载完成后播放
   * @param {number} fadeInDuration - 淡入时长
   * @param {Function} resolve - Promise resolve 回调
   */
  _playWhenReady(fadeInDuration, resolve) {
    if (!this.sound) {
      this.log('⚠️ 没有音频实例');
      resolve?.();
      return;
    }

    const doPlay = () => {
      try {
        this.log('🎵 调用 play()...');
        this.sound.play();
        this.log('🎵 播放成功');
        this.isPlaying.value = true;
        this.fadeIn(fadeInDuration);
      } catch (err) {
        this.warn('⚠️ 播放失败（可能是浏览器自动播放策略限制）', err);
        this.isPlaying.value = false;
        this._setupAutoPlayOnFirstInteraction();
      } finally {
        resolve?.();
      }
    };

    // 检查音频是否已加载完成
    if (this.sound.state() === 'loaded') {
      this.log('🎵 音频已加载，准备播放');
      doPlay();
    } else {
      this.log('⏳ 音频加载中，等待完成...');
      // 设置回调，等待加载完成后执行
      this._pendingPlayCallback = () => {
        doPlay();
      };
    }
  }

  /**
   * 警告输出
   */
  warn(...args) {
    console.warn('[AudioManager]', ...args);
  }

  /**
   * 设置在用户第一次交互后自动播放（处理浏览器自动播放策略限制）
   * 仅限 home 组页面（HomePage、UserProgressPage 等）生效
   */
  _setupAutoPlayOnFirstInteraction() {
    // 仅 home 组允许——非 home 组页面直接返回，不注册任何全局监听
    if (this.currentGroup.value !== 'home') {
      this.log('🔕 非 home 组页面，不设置交互自启监听');
      return;
    }

    // 避免重复设置监听器
    if (this._autoPlayListenerSet) return;

    this._autoPlayListenerSet = true;

    const events = ['click', 'touchstart', 'keydown', 'mousedown'];
    const tryPlayOnInteraction = () => {
      if (!this.isPlaying.value && this.sound) {
        this.log('🎯 检测到用户交互，尝试播放音频');
        this.play();
      }

      // 移除所有事件监听器
      events.forEach(event => {
        document.removeEventListener(event, tryPlayOnInteraction, true);
      });

      this._autoPlayListenerSet = false;
      this._autoPlayListenerFn = null;
    };

    // 保存引用，方便离开首页时主动清理
    this._autoPlayListenerFn = tryPlayOnInteraction;
    this._autoPlayEvents = events;

    // 为多个用户交互事件添加监听器（使用捕获阶段）
    events.forEach(event => {
      document.addEventListener(event, tryPlayOnInteraction, true);
    });

    this.log('🔔 已设置用户交互监听（home 组），等待第一次点击/触摸后自动播放');
  }

  /**
   * 移除自动播放交互监听器（离开 home 组页面时调用）
   */
  _removeAutoPlayListeners() {
    if (!this._autoPlayListenerSet || !this._autoPlayListenerFn) return;

    const events = this._autoPlayEvents || ['click', 'touchstart', 'keydown', 'mousedown'];
    events.forEach(event => {
      document.removeEventListener(event, this._autoPlayListenerFn, true);
    });

    this._autoPlayListenerSet = false;
    this._autoPlayListenerFn = null;
    this._autoPlayEvents = null;
    this.log('🔕 已移除交互自启监听器（离开 home 组）');
  }

  /**
   * 切换到指定索引的曲目
   */
  switchTrackByIndex(index, options = {}) {
    const tracks = this.getCurrentTracks();
    if (index < 0 || index >= tracks.length) {
      this.error(`❌ 无效的曲目索引: ${index}`);
      return;
    }

    this.currentTrackIndex.value = index;
    return this.switchTrack(tracks[index], options);
  }

  /**
   * 下一曲
   */
  nextTrack(options = {}) {
    const tracks = this.getCurrentTracks();
    const nextIndex = (this.currentTrackIndex.value + 1) % tracks.length;
    return this.switchTrackByIndex(nextIndex, options);
  }

  /**
   * 上一曲
   */
  prevTrack(options = {}) {
    const tracks = this.getCurrentTracks();
    const prevIndex = (this.currentTrackIndex.value - 1 + tracks.length) % tracks.length;
    return this.switchTrackByIndex(prevIndex, options);
  }

  /**
   * 初始化音频管理器
   * 在应用启动时调用
   */
  init() {
    this.log('初始化音频管理器');
    this.loadStatesFromStorage();
    
    // 不在这里预先创建音频，避免重复实例化
    // 让 switchToPath() 来处理第一次创建
  }

  /**
   * 销毁音频实例
   */
  destroy() {
    this._removeAutoPlayListeners();
    this.stopFade();
    this.stopProgressUpdate();
    this.stop();
    if (this.sound) {
      this.sound.unload();
      this.sound = null;
    }
    this.log('🧹 销毁音频管理器');
  }

  /**
   * 获取当前状态摘要
   */
  getStatus() {
    return {
      isPlaying: this.isPlaying.value,
      volume: this.volumePercent.value,
      currentTrack: this.currentTrack.value,
      currentTrackIndex: this.currentTrackIndex.value,
      currentGroup: this.currentGroup.value,
      currentTime: this.getCurrentTime(),
      isSwitching: this.isSwitching.value,
    };
  }

  /**
   * 创建并管理一个新的音频实例（用于Test02.vue等复杂场景）
   * @param {string} instanceId - 实例ID
   * @param {string} audioUrl - 音频URL
   * @param {Object} options - 配置选项
   */
  createAudioInstance(instanceId, audioUrl, options = {}) {
    // 如果已经存在该实例，则先清理
    if (this.audioInstances.has(instanceId)) {
      this.destroyAudioInstance(instanceId);
    }

    const {
      loop = true,
      volume = 0.5,
      startPosition = 0,
      onLoaded = null,
      onEnded = null,
      onError = null
    } = options;

    const audio = new Audio(audioUrl);
    audio.loop = loop;
    audio.volume = volume;

    // 设置起始时间
    if (startPosition > 0) {
      audio.currentTime = startPosition;
    }

    // 事件监听
    audio.addEventListener('loadeddata', () => {
      this.log(`✅ 音频实例 ${instanceId} 加载成功`);
      if (onLoaded && typeof onLoaded === 'function') {
        onLoaded(audio);
      }
    });

    audio.addEventListener('ended', () => {
      this.log(`⏹️ 音频实例 ${instanceId} 播放结束`);
      if (onEnded && typeof onEnded === 'function') {
        onEnded(audio);
      }
    });

    audio.addEventListener('error', (e) => {
      this.error(`❌ 音频实例 ${instanceId} 播放错误`, e);
      if (onError && typeof onError === 'function') {
        onError(e, audio);
      }
    });

    // 保存实例
    this.audioInstances.set(instanceId, audio);

    // 设置为当前实例
    this.currentInstanceId = instanceId;

    this.log(`🎵 创建音频实例: ${instanceId}, URL: ${audioUrl}`);
    return audio;
  }

  /**
   * 播放指定音频实例
   * @param {string} instanceId - 实例ID
   */
  async playAudioInstance(instanceId) {
    const audio = this.audioInstances.get(instanceId);
    if (!audio) {
      this.log(`⚠️ 音频实例 ${instanceId} 不存在`);
      return false;
    }

    try {
      await audio.play();
      this.currentInstanceId = instanceId;
      this.log(`▶️ 音频实例 ${instanceId} 开始播放`);
      return true;
    } catch (error) {
      this.error(`❌ 音频实例 ${instanceId} 播放失败:`, error);
      return false;
    }
  }

  /**
   * 暂停指定音频实例
   * @param {string} instanceId - 实例ID
   */
  pauseAudioInstance(instanceId) {
    const audio = this.audioInstances.get(instanceId);
    if (!audio) {
      this.log(`⚠️ 音频实例 ${instanceId} 不存在`);
      return false;
    }

    audio.pause();
    this.log(`⏸️ 音频实例 ${instanceId} 暂停播放`);
    return true;
  }

  /**
   * 停止指定音频实例并重置到开始
   * @param {string} instanceId - 实例ID
   */
  stopAudioInstance(instanceId) {
    const audio = this.audioInstances.get(instanceId);
    if (!audio) {
      this.log(`⚠️ 音频实例 ${instanceId} 不存在`);
      return false;
    }

    audio.pause();
    audio.currentTime = 0;
    this.log(`⏹️ 音频实例 ${instanceId} 停止并重置`);
    return true;
  }

  /**
   * 设置音频实例音量
   * @param {string} instanceId - 实例ID
   * @param {number} volume - 音量值 (0-1)
   */
  setAudioInstanceVolume(instanceId, volume) {
    const audio = this.audioInstances.get(instanceId);
    if (!audio) {
      this.log(`⚠️ 音频实例 ${instanceId} 不存在`);
      return false;
    }

    audio.volume = Math.max(0, Math.min(1, volume));
    this.log(`🔊 音频实例 ${instanceId} 音量设置为: ${volume}`);
    return true;
  }

  /**
   * 销毁指定音频实例
   * @param {string} instanceId - 实例ID
   */
  destroyAudioInstance(instanceId) {
    const audio = this.audioInstances.get(instanceId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      
      // 清理事件监听器
      // 注意：Audio元素没有直接移除事件监听器的方法，所以只是暂停和清理引用
      
      this.audioInstances.delete(instanceId);
      
      // 如果销毁的是当前实例，清除当前实例ID
      if (this.currentInstanceId === instanceId) {
        this.currentInstanceId = null;
      }
      
      this.log(`🧹 销毁音频实例: ${instanceId}`);
    }
  }

  /**
   * 日志输出
   */
  log(...args) {
    if (this.debug) {
      console.log('[AudioManager]', ...args);
    }
  }

  /**
   * 错误输出
   */
  error(...args) {
    console.error('[AudioManager]', ...args);
  }

  // ==================== 向后兼容的方法 ====================

  /**
   * 向后兼容：initTracks（现在不做任何事情，tracks 已经内置在 trackGroups 中）
   */
  initTracks(tracks) {
    this.log('[AudioManager] initTracks() is deprecated, tracks are now built-in');
  }

  /**
   * 向后兼容：loadTrack（现在是 switchTrack 的别名）
   */
  loadTrack(track, options = {}) {
    this.log('[AudioManager] loadTrack() is deprecated, use switchTrack() instead');
    return this.switchTrack(track, options);
  }

  /**
   * 向后兼容：resume（现在是 play 的别名）
   */
  resume() {
    this.log('[AudioManager] resume() is deprecated, use play() instead');
    return this.play();
  }
}

// 创建单例实例
const audioManager = new AudioManager();

// 向后兼容：导出 defaultMusicTracks（现在只返回 home 组的曲目）
const defaultMusicTracks = trackGroupsData.home;

// 向后兼容：导出 zone03Track
const zone03Track = {
  id: "zone03",
  title: "Ambient Zone",
  url: trackGroupsData.future[0].url,
};

export default audioManager;
export { audioManager, defaultMusicTracks, zone03Track };