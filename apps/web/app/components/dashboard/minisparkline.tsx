'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MiniSparklineProps {
  data: number[];
  colour?: string;
}

const MiniSparkline = ({ data, colour = 'var(--cp-accent)' }: MiniSparklineProps) => {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        width: '72px',
        height: '24px',
        flexShrink: 0,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={colour}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </span>
  );
};

export default MiniSparkline;