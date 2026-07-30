export enum FEEDBACK_VALUE {
  like = 'like',
  dislike = 'dislike',
  default = 'default',
}

export enum ACTIONS_ITEM_STATUS {
  LOADING = 'loading',
  ERROR = 'error',
  RUNNING = 'running',
  DEFAULT = 'default',
}

export type ActionsCopySemanticType = 'root';
export type ActionsFeedbackSemanticType = 'like' | 'liked' | 'dislike' | 'disliked' | 'root';
export type ActionsItemSemanticType = 'root' | 'default' | 'running' | 'error' | 'loading';
export type ActionsAudioSemanticType = 'root' | 'default' | 'running' | 'error' | 'loading';
