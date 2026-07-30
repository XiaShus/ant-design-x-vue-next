import { describe, expect, it } from 'vitest';
import type { AllowSpeech, ControlledSpeechConfig, SpeechConfig } from '../index';

describe('Sender AllowSpeech exports', () => {
  it('exports AllowSpeech, ControlledSpeechConfig, and SpeechConfig alias', () => {
    const enabled = true satisfies AllowSpeech;
    const controlled = {
      recording: false,
      onRecordingChange: () => undefined,
    } satisfies ControlledSpeechConfig;
    const alias: SpeechConfig = controlled;
    const union: AllowSpeech = alias;
    expect(enabled).toBe(true);
    expect(controlled.recording).toBe(false);
    expect(typeof union === 'object' && union !== null).toBe(true);
  });
});
