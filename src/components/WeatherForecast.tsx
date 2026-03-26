import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, Calendar, Thermometer, Droplets, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const rainfallData = [
  { month: 'Jan', rain: 45, temp: 28 },
  { month: 'Feb', rain: 52, temp: 29 },
  { month: 'Mar', rain: 120, temp: 27 },
  { month: 'Apr', rain: 180, temp: 25 },
  { month: 'May', rain: 150, temp: 24 },
  { month: 'Jun', rain: 40, temp: 23 },
  { month: 'Jul', rain: 20, temp: 22 },
  { month: 'Aug', rain: 30, temp: 24 },
  { month: 'Sep', rain: 90, temp: 26 },
  { month: 'Oct', rain: 140, temp: 27 },
  { month: 'Nov', rain: 110, temp: 28 },
  { month: 'Dec', rain: 60, temp: 28 },
];

interface QuarterData {
  quarter: string;
  status: string;
  suitability: number;
  planting: string[];
  harvesting: string[];
  advice: string;
  color: string;
}

export const WeatherForecast: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<QuarterData[]>([]);

  useEffect(() => {
    const generateForecast = async () => {
      try {
        const model = "gemini-3-flash-preview";
        const prompt = "Generate a quarterly agricultural weather forecast for a tropical region. For each quarter (Q1-Q4), provide: status (e.g. Rainy Season), suitability score (0-100), 2-3 crops for planting, 2-3 crops for harvesting, and a brief advisory. Return as JSON array of objects: { quarter: string, status: string, suitability: number, planting: string[], harvesting: string[], advice: string, color: string (hex) }";
        
        const response = await ai.models.generateContent({
          model,
          contents: [{ parts: [{ text: prompt }] }],
          config: { responseMimeType: "application/json" }
        });

        const data = JSON.parse(response.text || '[]');
        setForecast(data);
      } catch (error) {
        console.error("Failed to fetch forecast:", error);
        // Fallback data
        setForecast([
          { quarter: 'Q1', status: 'Short Rains', suitability: 75, planting: ['Maize', 'Beans'], harvesting: ['Coffee'], advice: 'Prepare land for long rains.', color: '#10b981' },
          { quarter: 'Q2', status: 'Long Rains', suitability: 90, planting: ['Rice', 'Potatoes'], harvesting: ['Wheat'], advice: 'Peak planting season. Ensure drainage.', color: '#3b82f6' },
          { quarter: 'Q3', status: 'Dry Season', suitability: 40, planting: ['None'], harvesting: ['Maize', 'Beans'], advice: 'Focus on harvesting and storage.', color: '#f59e0b' },
          { quarter: 'Q4', status: 'Short Rains', suitability: 65, planting: ['Vegetables'], harvesting: ['Potatoes'], advice: 'Good for quick-maturing crops.', color: '#ef4444' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    generateForecast();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 animate-pulse">Generating AI Weather Insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400">
            <Thermometer size={24} />
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider">Avg Temperature</p>
            <h3 className="text-2xl font-bold text-white">26°C</h3>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-400">
            <Droplets size={24} />
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider">Soil Moisture</p>
            <h3 className="text-2xl font-bold text-white">68%</h3>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex items-center gap-4">
          <div className="p-4 bg-amber-500/20 rounded-2xl text-amber-400">
            <Wind size={24} />
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider">Wind Speed</p>
            <h3 className="text-2xl font-bold text-white">12 km/h</h3>
          </div>
        </div>
      </div>

      {/* Main Forecast Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quarterly Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {forecast.map((q, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] relative overflow-hidden group hover:bg-white/10 transition-all"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[3rem] -mr-8 -mt-8 transition-all group-hover:scale-110" />
              
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-black text-white/20 uppercase tracking-widest">{q.quarter}</span>
                <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center relative">
                  <svg className="w-10 h-10 -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={100}
                      strokeDashoffset={100 - q.suitability}
                      className="text-emerald-500"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-white">{q.suitability}%</span>
                </div>
              </div>

              <h4 className="text-xl font-bold text-white mb-1">{q.status}</h4>
              <p className="text-white/40 text-xs mb-4">{q.advice}</p>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="mt-1 p-1 bg-emerald-500/20 rounded text-emerald-400">
                    <CheckCircle2 size={12} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold">Planting</p>
                    <p className="text-xs text-white/80">{q.planting.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-1 p-1 bg-blue-500/20 rounded text-blue-400">
                    <Calendar size={12} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold">Harvesting</p>
                    <p className="text-xs text-white/80">{q.harvesting.join(', ')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rainfall Trend Chart */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white">Rainfall Trend</h3>
              <p className="text-white/40 text-sm">Annual precipitation forecast (mm)</p>
            </div>
            <CloudRain className="text-blue-400" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainfallData}>
                <defs>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="rain" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRain)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
            <Info className="text-emerald-400 shrink-0" size={20} />
            <p className="text-xs text-white/60">
              <span className="text-white font-bold">Pro Tip:</span> Q2 shows peak rainfall. Ideal for rice and high-moisture crops. Ensure irrigation systems are ready for the Q3 dry spell.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
