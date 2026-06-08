/**
 * 统一音乐管理器
 * 负责管理整个应用的音频播放，避免多个组件同时控制音频导致冲突
 */
import { ref } from 'vue';
import { Howl } from 'howler';
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
    { id: "about-1", title: "Voyager Theme", url: asset("music/The 1999 - 为了什么.mp3") },
  ],
  
  // Travel 页面
  travel: [
    { id: "travel-1", title: "Star Travel", url: asset("music/The 1999 - 冷空气.mp3") },
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
    
    // 情况 3：进入 test 页面 → 停止音乐，不恢复任何音频
    if (group === 'test') {
      this.log('[AudioManager] 进入 test 页面，停止所有音乐');
      this.saveGroupState();
      this.currentGroup.value = group;
      this.stop();
      return;
    }
    
    // 情况 4：真的切换组 → 正常流程
    this.log(`[AudioManager] 切换页面: ${this.currentGroup.value} -> ${group}`);
    
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
    
    // 保存当前首页音乐状态
    if (this.currentGroup.value === 'home' && this.sound) {
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
      // 检查是否是首次访问（使用 sessionStorage 标记）
      const isFirstVisit = sessionStorage.getItem('audioFirstVisitEver') !== 'false';
      
      if (isFirstVisit) {
        // 首次访问：清理旧的 localStorage 状态，确保全新体验
        localStorage.removeItem('audioPlaybackStates');
        localStorage.removeItem('audioCurrentTag');
        sessionStorage.setItem('audioFirstVisitEver', 'false');
        this.log('首次访问，已清理旧的 localStorage 状态');
        return;
      }

      // 不是首次访问：恢复播放状态
      const statesStr = localStorage.getItem('audioPlaybackStates');
      if (statesStr) {
        this.playbackStates = JSON.parse(statesStr);
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
        if (group === 'home') {
          // 首页首次进入：尝试自动播放
          this.switchTrack(tracks[0], {
            autoPlay: false,
            ...options,
          });
          setTimeout(() => {
            this.log('[AudioManager] 等待 500ms 后尝试播放...');
            this.play().catch(err => {
              this.warn('[AudioManager] 自动播放被浏览器阻止', err);
              this._setupAutoPlayOnFirstInteraction();
            });
          }, 500);
        } else {
          // 其他页面首次进入：不自动播放
          this.switchTrack(tracks[0], {
            autoPlay: false,
            ...options,
          });
        }
      }
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
        this.sound?.once('unlock', () => this.sound?.play());
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
   */
  _setupAutoPlayOnFirstInteraction() {
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
    };
    
    // 为多个用户交互事件添加监听器（使用捕获阶段）
    events.forEach(event => {
      document.addEventListener(event, tryPlayOnInteraction, true);
    });
    
    this.log('🔔 已设置用户交互监听，等待第一次点击/触摸后自动播放');
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