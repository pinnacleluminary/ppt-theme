import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  Tooltip
} from 'recharts';
import { ChartData, ThemeColors } from './ChartTypes';

interface ChartDisplayProps {
  chartData: ChartData;
  themeColors: ThemeColors;
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({ chartData, themeColors }) => {
  const { type, data, title } = chartData;
  const chartColors = [
    themeColors.accent1,
    themeColors.accent2,
    themeColors.accent3,
    themeColors.accent4,
    themeColors.accent5,
    themeColors.accent6
  ];

  const renderChart = () => {
    switch (type) {
      case 'bar':
        default:
        return (
          <BarChart data={data}>
            <XAxis dataKey="name" stroke={themeColors.textDark1} />
            <YAxis stroke={themeColors.textDark1} />
            <Tooltip />
            <Legend />
            {['series1', 'series2', 'series3'].map((series, index) => (
              <Bar
                key={series}
                dataKey={series}
                name={`Series ${index + 1}`}
                fill={chartColors[index]}
                stackId="stack"
              />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data}>
            <XAxis dataKey="name" stroke={themeColors.textDark1} />
            <YAxis stroke={themeColors.textDark1} />
            <Tooltip />
            <Legend />
            {['series1', 'series2', 'series3'].map((series, index) => (
              <Line
                key={series}
                type="monotone"
                dataKey={series}
                name={`Series ${index + 1}`}
                stroke={chartColors[index]}
                strokeWidth={2}
                dot={{ fill: chartColors[index] }}
              />
            ))}
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        );

    }
  };

  return (
    <div className="chart-container">
      <h5 className="text-center mb-3" style={{ color: themeColors.textDark1 }}>
        {title}
      </h5>
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer>{renderChart()}</ResponsiveContainer>
      </div>
    </div>
  );
};