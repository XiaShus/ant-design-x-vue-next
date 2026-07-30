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
});
