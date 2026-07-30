import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick, ref } from 'vue';
import Actions, {
  ActionsCopy,
  ActionsFeedback,
  ActionsItem,
} from '../index';
import type {
  ActionsAudioSemanticType,
  ActionsCopySemanticType,
  ActionsFeedbackSemanticType,
  ActionsItemSemanticType,
} from '../index';
import { ACTIONS_ITEM_STATUS } from '../constants';

describe('Actions presets', () => {
  it('exports preset semantic types from package entry', () => {
    const copyRoot = 'root' satisfies ActionsCopySemanticType;
    const feedbackLike = 'like' satisfies ActionsFeedbackSemanticType;
    const itemRunning = 'running' satisfies ActionsItemSemanticType;
    const audioError = 'error' satisfies ActionsAudioSemanticType;
    expect(copyRoot).toBe('root');
    expect(feedbackLike).toBe('like');
    expect(itemRunning).toBe('running');
    expect(audioError).toBe('error');
  });

  it('actionRender mounts custom content', () => {
    const wrapper = mount(Actions, {
      props: {
        items: [
          {
            key: 'custom',
            actionRender: () => h('button', { class: 'custom-action' }, 'Go'),
          },
        ],
      },
    });
    expect(wrapper.find('.custom-action').exists()).toBe(true);
    expect(wrapper.text()).toContain('Go');
  });

  it('Actions.Copy renders copyable control', () => {
    const wrapper = mount(ActionsCopy, {
      props: { text: 'hello' },
    });
    expect(wrapper.find('.ant-actions-copy').exists() || wrapper.html().includes('ant-typography')).toBe(
      true,
    );
  });

  it('Actions.Feedback toggles like / dislike', async () => {
    const value = ref<'default' | 'like' | 'dislike'>('default');
    const onChange = vi.fn((v: typeof value.value) => {
      value.value = v;
    });
    const wrapper = mount(ActionsFeedback, {
      props: {
        value: value.value,
        onChange,
      },
    });

    await wrapper.find('.ant-actions-feedback-item-like').trigger('click');
    expect(onChange).toHaveBeenCalledWith('like');

    await wrapper.setProps({ value: 'like' });
    await nextTick();
    // when liked, dislike is hidden
    expect(wrapper.find('.ant-actions-feedback-item-dislike').exists()).toBe(false);
  });

  it('Actions.Item shows loading icon by status', () => {
    const wrapper = mount(ActionsItem, {
      props: {
        status: ACTIONS_ITEM_STATUS.LOADING,
        defaultIcon: h('span', { class: 'default-icon' }, 'D'),
        label: 'share',
      },
    });
    expect(wrapper.find('.anticon-loading').exists() || wrapper.html().includes('anticon')).toBe(
      true,
    );
    expect(wrapper.find('.default-icon').exists()).toBe(false);
  });

  it('compound Actions.Copy / Feedback available on Actions', () => {
    expect(Actions.Copy).toBeTruthy();
    expect(Actions.Feedback).toBeTruthy();
    expect(Actions.Item).toBeTruthy();
    expect(Actions.Audio).toBeTruthy();
  });
});
