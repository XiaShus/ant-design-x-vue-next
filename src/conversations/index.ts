import type { App } from 'vue';
import ConversationsComponent from './Conversations.vue';
import Creation from './Creation.vue';

export type { ConversationsProps, Conversation, CreationProps } from './interface';

type Compounded = typeof ConversationsComponent & {
  Creation: typeof Creation;
};

const Conversations = ConversationsComponent as Compounded;
Conversations.Creation = Creation;

// @ts-ignore
Conversations.install = function (app: App) {
  app.component(ConversationsComponent.name, ConversationsComponent);
  app.component(Creation.name, Creation);
  return app;
};

export default Conversations;

export { Conversations, Creation };
