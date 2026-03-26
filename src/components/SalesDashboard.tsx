import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line
} from 'recharts';
import { TrendingUp, DollarSign, Package, Truck, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../firebase';

const data = [
  { name: 'Jan', sales: 4000, target: 2400 },
  { name: 'Feb', sales: 3000, target: 1398 },
  { name: 'Mar', sales: 2000, target: 9800 },
  { name: 'Apr', sales: 2780, target: 3908 },
  { name: 'May', sales: 1890, target: 4800 },
  { name: 'Jun', sales: 2390, target: 3800 },
];

const pieData = [
  { name: 'Grains', value: 400 },
  { name: 'Vegetables', value: 300 },
  { name: 'Fruits', value: 300 },
  { name: 'Seeds', value: 200 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export const SalesDashboard: React.FC = () => {
  return (
    <div className="space-y-8 p-4">
      {/* Top Stats - Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$45,231', icon: DollarSign, color: 'emerald', trend: '+12.5%' },
          { label: 'Active Orders', value: '156', icon: Package, color: 'blue', trend: '+5.2%' },
          { label: 'Deliveries', value: '89', icon: Truck, color: 'amber', trend: '+8.1%' },
          { label: 'Target Met', value: '82%', icon: Target, color: 'rose', trend: '+2.4%' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-500/20 text-${stat.color}-400`}>
                <stat.icon size={24} />
              </div>
              <span className="text-emerald-400 text-xs font-bold px-2 py-1 bg-emerald-500/10 rounded-full">
                {stat.trend}
              </span>
            </div>
            <p className="text-white/40 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seasonal Sales Chart */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white">{auth.currentUser?.displayName}'s Seasonal Sales</h3>
              <p className="text-white/40 text-sm">Monthly revenue vs target trends</p>
            </div>
            <TrendingUp className="text-emerald-400" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution - Circular Progress Style */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center">
          <h3 className="text-2xl font-bold text-white mb-2">Category Split</h3>
          <p className="text-white/40 text-sm mb-8">Revenue by crop type</p>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white">1.2k</span>
              <span className="text-white/40 text-xs uppercase tracking-widest">Total Units</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-6">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-white/60 text-xs">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
