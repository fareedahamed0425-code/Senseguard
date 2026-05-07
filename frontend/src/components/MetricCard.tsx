import React from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: number;
  status?: 'success' | 'warning' | 'critical';
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, value, unit, icon, status = 'success' 
}) => {
  const statusColors = {
    success: 'text-success border-success/20',
    warning: 'text-warning border-warning/20',
    critical: 'text-critical border-critical/20',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-white/60 text-sm font-medium uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg bg-white/5 ${statusColors[status]}`}>
          {icon}
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-white tracking-tight">
          {typeof value === 'number' ? value.toFixed(1) : value}
        </span>
        <span className="text-white/40 text-lg font-medium">{unit}</span>
      </div>
      
      <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Number(value))}%` }}
          className={`h-full ${status === 'success' ? 'bg-accent' : status === 'warning' ? 'bg-warning' : 'bg-critical'}`}
        />
      </div>
    </motion.div>
  );
};
