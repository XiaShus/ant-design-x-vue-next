import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';
import { Slider } from 'ant-design-vue';
import Sender from '../index';
import type { SkillType, SlotConfigType } from '../slot-types';

const baseSlotConfig: SlotConfigType[] = [
  { type: 'text', value: 'Hello ' },
  {
    type: 'input',
    key: 'name',
    props: { defaultValue: 'World', placeholder: 'name' },
  },
];

describe('Sender slot filling', () => {
  it('getValue joins text + input', async () => {
    const wrapper = mount(Sender, {
      props: {
        slotConfig: baseSlotConfig,
      },
    });

    await nextTick();
    const val = (wrapper.vm as any).getValue?.();
    expect(val?.value).toBe('Hello World');
  });

  it('select/custom formatResult', async () => {
    const slotConfig: SlotConfigType[] = [
      { type: 'text', value: 'Budget ' },
      {
        type: 'select',
        key: 'transport',
        props: {
          defaultValue: 'airplane',
          options: ['airplane', 'train'],
        },
      },
      {
        type: 'custom',
        key: 'priceRange',
        props: { defaultValue: [3000, 6000] },
        customRender: (value, onChange) =>
          h(Slider, {
            range: true,
            value,
            onChange,
            min: 1000,
            max: 8000,
          }),
        formatResult: (value: number[]) => `between ${value[0]} and ${value[1]} RMB`,
      },
    ];

    const wrapper = mount(Sender, {
      props: { slotConfig },
    });

    await nextTick();
    const val = (wrapper.vm as any).getValue?.();
    expect(val?.value).toBe('Budget airplanebetween 3000 and 6000 RMB');
  });

  it('skill included in getValue', async () => {
    const skill: SkillType = {
      value: 'travelId',
      title: 'Travel Planner',
    };

    const wrapper = mount(Sender, {
      props: {
        slotConfig: [{ type: 'text', value: 'Plan trip' }],
        skill,
      },
    });

    await nextTick();
    const val = (wrapper.vm as any).getValue?.();
    expect(val?.skill?.value).toBe('travelId');
    expect(val?.value).toBe('Plan trip');
  });

  it('insert adds slots', async () => {
    const wrapper = mount(Sender, {
      props: {
        slotConfig: [{ type: 'text', value: 'Start' }],
      },
    });

    await nextTick();
    (wrapper.vm as any).insert?.([
      { type: 'text', value: ' End' },
      { type: 'input', key: 'extra', props: { defaultValue: '!' } },
    ]);
    await nextTick();

    const val = (wrapper.vm as any).getValue?.();
    expect(val?.value).toBe('Start End!');
    expect(val?.slotConfig?.length).toBe(3);
  });

  it('clear empties inserted slots and resets values', async () => {
    const wrapper = mount(Sender, {
      props: {
        slotConfig: baseSlotConfig,
      },
    });

    await nextTick();
    (wrapper.vm as any).insert?.([{ type: 'text', value: ' extra' }]);
    await nextTick();
    (wrapper.vm as any).clear?.();
    await nextTick();

    const val = (wrapper.vm as any).getValue?.();
    expect(val?.value).toBe('Hello World');
    expect(val?.slotConfig?.length).toBe(2);
  });

  it('onSubmit receives slotConfig+skill', async () => {
    const onSubmit = vi.fn();
    const skill: SkillType = { value: 'skill-1', title: 'Skill' };

    const wrapper = mount(Sender, {
      props: {
        slotConfig: baseSlotConfig,
        skill,
        onSubmit,
      },
    });

    await nextTick();
    await wrapper.find('button[type="button"]').trigger('click');

    expect(onSubmit).toHaveBeenCalled();
    const [message, slotConfig, submittedSkill] = onSubmit.mock.calls[0];
    expect(message).toBe('Hello World');
    expect(slotConfig?.length).toBe(2);
    expect(submittedSkill?.value).toBe('skill-1');
  });

  it('SlotTextArea root is contentEditable', async () => {
    const wrapper = mount(Sender, {
      props: {
        slotConfig: baseSlotConfig,
      },
      attachTo: document.body,
    });

    await nextTick();
    const editable = wrapper.find('[contenteditable="true"]');
    expect(editable.exists()).toBe(true);
    expect(editable.classes().some((cls) => cls.includes('input-slot'))).toBe(true);

    wrapper.unmount();
  });

  it('content slot renders editable region (not Input)', async () => {
    const wrapper = mount(Sender, {
      props: {
        slotConfig: [
          { type: 'text', value: 'Go to ' },
          {
            type: 'content',
            key: 'city',
            props: { defaultValue: 'Beijing', placeholder: '[city]' },
          },
        ],
      },
      attachTo: document.body,
    });

    await nextTick();
    const content = wrapper.find('[data-slot-type="content"][data-slot-key="city"]');
    expect(content.exists()).toBe(true);
    expect(content.text()).toBe('Beijing');
    expect(wrapper.find('.ant-input').exists()).toBe(false);

    const val = (wrapper.vm as any).getValue?.();
    expect(val?.value).toBe('Go to Beijing');

    wrapper.unmount();
  });

  it('paste plain text into editable root', async () => {
    const onChange = vi.fn();
    const wrapper = mount(Sender, {
      props: {
        slotConfig: [{ type: 'text', value: 'Hi' }],
        onChange,
      },
      attachTo: document.body,
    });

    await nextTick();
    const editable = wrapper.find('[contenteditable="true"]').element as HTMLDivElement;
    editable.focus();

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editable);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);

    const clipboardData = {
      getData: (type: string) => (type === 'text/plain' ? ' pasted' : ''),
    };

    const event = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent;
    Object.defineProperty(event, 'clipboardData', { value: clipboardData });
    editable.dispatchEvent(event);

    await nextTick();
    // Falls back to insert([{ type: 'text' }]) when cursor insert is unavailable in jsdom,
    // or inserts at caret via Selection API — either path should surface pasted plain text.
    const val = (wrapper.vm as any).getValue?.();
    expect(val?.value).toContain('pasted');
    wrapper.unmount();
  });

  it('focus supports cursor start/end/slot', async () => {
    const wrapper = mount(Sender, {
      props: {
        slotConfig: [
          { type: 'text', value: 'A' },
          {
            type: 'content',
            key: 'city',
            props: { defaultValue: 'X' },
          },
          { type: 'text', value: 'B' },
        ],
      },
      attachTo: document.body,
    });

    await nextTick();
    const editable = wrapper.find('[contenteditable="true"]').element as HTMLDivElement;

    (wrapper.vm as any).focus?.({ cursor: 'end' });
    expect(document.activeElement).toBe(editable);

    (wrapper.vm as any).focus?.({ cursor: 'start' });
    expect(document.activeElement).toBe(editable);

    (wrapper.vm as any).focus?.({ cursor: 'slot', key: 'city' });
    expect(document.activeElement).toBe(editable);
    const selection = window.getSelection();
    expect(selection?.rangeCount).toBeGreaterThan(0);
    const slotEl = wrapper.find('[data-slot-key="city"]').element;
    expect(slotEl.contains(selection?.anchorNode as Node) || selection?.anchorNode === slotEl).toBe(
      true,
    );

    wrapper.unmount();
  });

  it('readOnly disables contentEditable', async () => {
    const wrapper = mount(Sender, {
      props: {
        slotConfig: baseSlotConfig,
        readOnly: true,
      },
    });

    await nextTick();
    expect(wrapper.find('[contenteditable="true"]').exists()).toBe(false);
    expect(wrapper.find('[contenteditable="false"]').exists()).toBe(true);
  });
});
