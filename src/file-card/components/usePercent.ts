import { onWatcherCleanup, ref, watchEffect, type Ref } from 'vue';

const AUTO_INTERVAL = 200;
const STEP_BUCKETS: [limit: number, stepPtg: number][] = [
  [30, 0.05],
  [70, 0.03],
  [96, 0.01],
];

/** Align React FileCard usePercent for auto loading progress text. */
export default function usePercent(
  spinning: Ref<boolean> | boolean,
  percent: Ref<number | 'auto' | undefined> | number | 'auto' | undefined,
): [Ref<number | undefined>, Ref<string>] {
  const mockPercent = ref(0);
  const spinningRef = typeof spinning === 'boolean' ? ref(spinning) : spinning;
  const percentRef =
    typeof percent === 'object' && percent !== null && 'value' in (percent as object)
      ? (percent as Ref<number | 'auto' | undefined>)
      : ref(percent as number | 'auto' | undefined);

  watchEffect(() => {
    const isAuto = percentRef.value === 'auto' || percentRef.value === undefined;
    if (isAuto && spinningRef.value) {
      mockPercent.value = 0;
      const timer = setInterval(() => {
        mockPercent.value = (() => {
          const prev = mockPercent.value;
          const restPTG = 100 - prev;
          for (let i = 0; i < STEP_BUCKETS.length; i += 1) {
            const [limit, stepPtg] = STEP_BUCKETS[i];
            if (prev <= limit) {
              return prev + restPTG * stepPtg;
            }
          }
          return prev;
        })();
      }, AUTO_INTERVAL);
      onWatcherCleanup(() => clearInterval(timer));
    }
  });

  const mergedPercent = ref<number | undefined>();
  const percentText = ref('0%');

  watchEffect(() => {
    const isAuto = percentRef.value === 'auto' || percentRef.value === undefined;
    if (isAuto) {
      mergedPercent.value = mockPercent.value;
      percentText.value = `${mockPercent.value.toFixed(0)}%`;
    } else {
      mergedPercent.value = percentRef.value as number;
      percentText.value = `${percentRef.value}%`;
    }
  });

  return [mergedPercent, percentText];
}
