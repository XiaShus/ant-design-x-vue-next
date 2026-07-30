export interface ActionsLocale {
  feedbackLike: string;
  feedbackDislike: string;
  audio: string;
  audioRunning: string;
  audioError: string;
  audioLoading: string;
}

export const zhCN: ActionsLocale = {
  feedbackLike: '喜欢',
  feedbackDislike: '不喜欢',
  audio: '播放音频',
  audioRunning: '音频播放中',
  audioError: '播放出错了',
  audioLoading: '正在加载音频',
};

export const enUS: ActionsLocale = {
  feedbackLike: 'Like',
  feedbackDislike: 'Dislike',
  audio: 'Play audio',
  audioRunning: 'Audio playing',
  audioError: 'Playback error',
  audioLoading: 'Loading audio',
};

/** Default locale for Actions presets (zh-CN). */
export const defaultActionsLocale = zhCN;
