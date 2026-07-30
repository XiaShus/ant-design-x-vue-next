<script setup lang="tsx">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import './style/DebugPanel.css';

defineOptions({ name: 'AXXMarkdownDebugPanel' });

interface PerformanceSnapshot {
  timestamp: number;
  fps: number;
  memory: number;
}

interface Position {
  x: number;
  y: number;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

const CONSTANTS = {
  FPS_THRESHOLD: { GOOD: 55, WARNING: 40 },
  COLORS: { GOOD: '#52c41a', WARNING: '#faad14', DANGER: '#ff4d4f' },
  CHART: { WIDTH: 750, HEIGHT: 400, PADDING: 80 },
} as const;

const getInitialPosition = (): Position => {
  if (typeof window === 'undefined') {
    return { x: 12, y: 12 };
  }
  return {
    x: window.innerWidth - 220,
    y: window.innerHeight / 2 - 100,
  };
};

const getMemoryUsage = (): number => {
  const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
  return perf.memory ? Math.round(perf.memory.usedJSHeapSize / 1024 / 1024) : 0;
};

const formatMemory = (mb: number): string => {
  if (mb < 1) return `${Math.round(mb * 1024)} KB`;
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
  return `${mb.toFixed(2)} MB`;
};

const getFpsColor = (value: number): string => {
  if (value >= CONSTANTS.FPS_THRESHOLD.GOOD) return CONSTANTS.COLORS.GOOD;
  if (value >= CONSTANTS.FPS_THRESHOLD.WARNING) return CONSTANTS.COLORS.WARNING;
  return CONSTANTS.COLORS.DANGER;
};

const fps = ref(0);
const memory = ref(0);
const isRecording = ref(false);
const showModal = ref(false);
const records = ref<PerformanceSnapshot[]>([]);
const position = ref<Position>(getInitialPosition());
const isDragging = ref(false);

const recordingRef = ref<PerformanceSnapshot[]>([]);
const frameCountRef = ref(0);
const lastTimeRef = ref(0);
const animationRef = ref<number | undefined>(undefined);
const dragRef = ref<DragState>({
  isDragging: false,
  startX: 0,
  startY: 0,
  initialX: 0,
  initialY: 0,
});

const update = () => {
  const now = performance.now();
  const delta = now - lastTimeRef.value;

  frameCountRef.value++;
  if (delta >= 1000) {
    const currentFps = Math.round((frameCountRef.value * 1000) / delta);
    const currentMemory = getMemoryUsage();

    fps.value = currentFps;
    memory.value = currentMemory;

    if (isRecording.value) {
      recordingRef.value.push({
        timestamp: Date.now(),
        fps: currentFps,
        memory: currentMemory,
      });
    }

    frameCountRef.value = 0;
    lastTimeRef.value = now;
  }

  animationRef.value = requestAnimationFrame(update);
};

const handleMouseMove = (e: MouseEvent) => {
  if (!dragRef.value.isDragging) return;
  const dx = e.clientX - dragRef.value.startX;
  const dy = e.clientY - dragRef.value.startY;
  position.value = {
    x: dragRef.value.initialX + dx,
    y: dragRef.value.initialY + dy,
  };
};

const handleMouseUp = () => {
  dragRef.value.isDragging = false;
  isDragging.value = false;
};

onMounted(() => {
  if (typeof window === 'undefined') return;
  lastTimeRef.value = performance.now();
  animationRef.value = requestAnimationFrame(update);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
});

onUnmounted(() => {
  if (animationRef.value !== undefined) {
    cancelAnimationFrame(animationRef.value);
  }
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});

const toggleRecording = () => {
  if (isRecording.value) {
    isRecording.value = false;
    records.value = [...recordingRef.value];
    showModal.value = true;
  } else {
    recordingRef.value = [];
    isRecording.value = true;
  }
};

const handleMouseDown = (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest('.x-markdown-debug-action')) return;

  dragRef.value = {
    isDragging: true,
    startX: e.clientX,
    startY: e.clientY,
    initialX: position.value.x,
    initialY: position.value.y,
  };
  isDragging.value = true;
};

const chartModel = computed(() => {
  const list = records.value;
  if (!list.length) return null;

  const { WIDTH, HEIGHT, PADDING } = CONSTANTS.CHART;
  const chartWidth = WIDTH - PADDING * 2;
  const chartHeight = HEIGHT - PADDING * 2;

  const startTime = list[0]?.timestamp ?? 0;
  const endTime = list[list.length - 1]?.timestamp ?? 0;
  const duration = endTime - startTime || 1;

  const maxFps = Math.max(...list.map((r) => r.fps), 60);
  const maxMemory = Math.max(...list.map((r) => r.memory), 0) * 1.1;

  const avgFps = list.reduce((sum, r) => sum + r.fps, 0) / list.length;
  const avgMemory = list.reduce((sum, r) => sum + r.memory, 0) / list.length;
  const minFps = Math.min(...list.map((r) => r.fps));
  const maxFpsValue = Math.max(...list.map((r) => r.fps));

  const createPoints = (key: 'fps' | 'memory', max: number) =>
    list
      .map((r) => {
        const x = PADDING + ((r.timestamp - startTime) / duration) * chartWidth;
        const y = PADDING + chartHeight - (r[key] / max) * chartHeight;
        return `${x},${y}`;
      })
      .join(' ');

  return {
    WIDTH,
    HEIGHT,
    PADDING,
    chartWidth,
    chartHeight,
    duration,
    maxFps,
    maxMemory,
    avgFps,
    avgMemory,
    minFps,
    maxFpsValue,
    fpsPoints: createPoints('fps', maxFps),
    memoryPoints: createPoints('memory', maxMemory),
  };
});

defineRender(() => {
  const chart = chartModel.value;

  return (
    <>
      <div
        class="x-markdown-debug-panel"
        style={{
          left: `${position.value.x}px`,
          top: `${position.value.y}px`,
          cursor: isDragging.value ? 'grabbing' : 'grab',
        }}
        onMousedown={handleMouseDown}
      >
        <div class="x-markdown-debug-row">
          <span class="x-markdown-debug-label">FPS</span>
          <span class="x-markdown-debug-value" style={{ color: getFpsColor(fps.value) }}>
            {fps.value}
          </span>
        </div>
        <div class="x-markdown-debug-row">
          <span class="x-markdown-debug-label">Memory</span>
          <span class="x-markdown-debug-value">{formatMemory(memory.value)}</span>
        </div>
        <div class="x-markdown-debug-actions">
          <button
            type="button"
            class={[
              'x-markdown-debug-action',
              'x-markdown-debug-record-btn',
              isRecording.value ? 'recording' : '',
            ]}
            onClick={toggleRecording}
          >
            {isRecording.value ? 'Stop' : 'Record'}
          </button>
          {records.value.length > 0 && !isRecording.value ? (
            <button
              type="button"
              class="x-markdown-debug-action"
              onClick={() => {
                showModal.value = true;
              }}
            >
              View
            </button>
          ) : null}
        </div>
      </div>

      {showModal.value && chart ? (
        <div
          class="x-markdown-debug-modal-overlay"
          onClick={() => {
            showModal.value = false;
          }}
        >
          <div
            class="x-markdown-debug-modal"
            onClick={(e: MouseEvent) => e.stopPropagation()}
          >
            <div class="x-markdown-debug-modal-header">
              <span style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>
                Performance Recording
              </span>
              <button
                type="button"
                class="x-markdown-debug-close-btn"
                onClick={() => {
                  showModal.value = false;
                }}
              >
                x
              </button>
            </div>
            <div class="x-markdown-debug-modal-content">
              <div class="x-markdown-debug-stats-summary">
                <div class="x-markdown-debug-stat-item">
                  <div class="x-markdown-debug-stat-label">Duration</div>
                  <div class="x-markdown-debug-stat-value">
                    {(chart.duration / 1000).toFixed(2)}s
                  </div>
                </div>
                <div class="x-markdown-debug-stat-item">
                  <div class="x-markdown-debug-stat-label">FPS Avg</div>
                  <div
                    class="x-markdown-debug-stat-value"
                    style={{ color: getFpsColor(chart.avgFps) }}
                  >
                    {chart.avgFps.toFixed(1)}
                  </div>
                </div>
                <div class="x-markdown-debug-stat-item">
                  <div class="x-markdown-debug-stat-label">FPS Range</div>
                  <div class="x-markdown-debug-stat-value">
                    {chart.minFps} - {chart.maxFpsValue}
                  </div>
                </div>
                <div class="x-markdown-debug-stat-item">
                  <div class="x-markdown-debug-stat-label">Memory Avg</div>
                  <div class="x-markdown-debug-stat-value">
                    {formatMemory(chart.avgMemory)}
                  </div>
                </div>
              </div>

              <svg
                width={chart.WIDTH}
                height={chart.HEIGHT}
                class="x-markdown-debug-chart-full"
                role="img"
                aria-label="Performance chart showing FPS and memory usage over time"
              >
                <title>Performance Chart</title>
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                  <g key={String(ratio)}>
                    <line
                      x1={chart.PADDING}
                      y1={chart.PADDING + chart.chartHeight * ratio}
                      x2={chart.WIDTH - chart.PADDING}
                      y2={chart.PADDING + chart.chartHeight * ratio}
                      stroke="rgba(255,255,255,0.1)"
                      stroke-width="1"
                    />
                    <line
                      x1={chart.PADDING + chart.chartWidth * ratio}
                      y1={chart.PADDING}
                      x2={chart.PADDING + chart.chartWidth * ratio}
                      y2={chart.HEIGHT - chart.PADDING}
                      stroke="rgba(255,255,255,0.1)"
                      stroke-width="1"
                    />
                  </g>
                ))}

                <polyline
                  points={chart.fpsPoints}
                  fill="none"
                  stroke={CONSTANTS.COLORS.GOOD}
                  stroke-width="2"
                  class="fps-line"
                />
                <polyline
                  points={chart.memoryPoints}
                  fill="none"
                  stroke="#1890ff"
                  stroke-width="2"
                  class="memory-line"
                />

                <text
                  x={chart.PADDING - 10}
                  y={chart.PADDING}
                  fill={CONSTANTS.COLORS.GOOD}
                  font-size="12"
                  text-anchor="end"
                >
                  {chart.maxFps.toFixed(0)}
                </text>
                <text
                  x={chart.PADDING - 10}
                  y={chart.HEIGHT - chart.PADDING}
                  fill={CONSTANTS.COLORS.GOOD}
                  font-size="12"
                  text-anchor="end"
                >
                  0
                </text>
                <text
                  x={chart.PADDING - 10}
                  y={chart.PADDING - 15}
                  fill={CONSTANTS.COLORS.GOOD}
                  font-size="14"
                  font-weight="bold"
                  text-anchor="end"
                >
                  FPS
                </text>

                <text
                  x={chart.WIDTH - chart.PADDING + 10}
                  y={chart.PADDING + 20}
                  fill="#1890ff"
                  font-size="12"
                  text-anchor="start"
                >
                  {formatMemory(chart.maxMemory)}
                </text>
                <text
                  x={chart.WIDTH - chart.PADDING + 10}
                  y={chart.HEIGHT - chart.PADDING}
                  fill="#1890ff"
                  font-size="12"
                  text-anchor="start"
                >
                  {formatMemory(0)}
                </text>
                <text
                  x={chart.WIDTH - chart.PADDING + 10}
                  y={chart.PADDING + 5}
                  fill="#1890ff"
                  font-size="14"
                  font-weight="bold"
                  text-anchor="start"
                >
                  Memory
                </text>

                <text
                  x={chart.PADDING}
                  y={chart.HEIGHT - chart.PADDING + 20}
                  fill="rgba(255,255,255,0.6)"
                  font-size="12"
                  text-anchor="middle"
                >
                  0s
                </text>
                <text
                  x={chart.WIDTH - chart.PADDING}
                  y={chart.HEIGHT - chart.PADDING + 20}
                  fill="rgba(255,255,255,0.6)"
                  font-size="12"
                  text-anchor="middle"
                >
                  {(chart.duration / 1000).toFixed(1)}s
                </text>
              </svg>

              <div class="x-markdown-debug-legend">
                <div class="x-markdown-debug-legend-item">
                  <span
                    class="x-markdown-debug-legend-color"
                    style={{ backgroundColor: CONSTANTS.COLORS.GOOD }}
                  />
                  <span>FPS</span>
                </div>
                <div class="x-markdown-debug-legend-item">
                  <span
                    class="x-markdown-debug-legend-color"
                    style={{ backgroundColor: '#1890ff' }}
                  />
                  <span>Memory</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
});
</script>
