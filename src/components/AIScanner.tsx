import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface ScannerProps {
  type: 'seed' | 'crop';
  onResult: (result: any) => void;
}

export const AIScanner: React.FC<ScannerProps> = ({ type, onResult }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyzeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    try {
      const model = "gemini-3-flash-preview";
      const prompt = type === 'seed' 
        ? "Analyze this seed image. Grade its quality as 'Good', 'Medium', or 'Bad'. List features like shape, color, and texture. Provide a brief recommendation. Return JSON format: { quality: string, confidence: number, features: string[], recommendation: string }"
        : "Analyze this crop/leaf image. Detect if it is 'Healthy' or 'Affected'. Look for leaf size, holes, mosaic patterns, and color. Provide severity, possible causes for the symptoms, and recommendation. Return JSON format: { status: string, issues: string[], causes: string[], severity: string, recommendation: string }";

      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } }
            ]
          }
        ],
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{}');
      setResult(data);
      onResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white capitalize">{type} Scanner</h3>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full transition-all shadow-lg shadow-emerald-500/20"
        >
          <Camera size={24} />
        </button>
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleCapture}
        />
      </div>

      <div className="relative aspect-square rounded-2xl bg-black/20 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-8">
            <Upload className="mx-auto mb-4 text-white/20" size={48} />
            <p className="text-white/40 text-sm">Take a photo or upload an image to start analysis</p>
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-emerald-400 mb-4" size={48} />
            <p className="text-emerald-400 font-medium animate-pulse">Analyzing with AI...</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {result && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className={cn(
              "p-4 rounded-2xl flex items-start gap-4",
              (result.quality === 'Good' || result.status === 'Healthy') ? "bg-emerald-500/10 border border-emerald-500/20" : 
              (result.quality === 'Bad' || result.severity === 'High') ? "bg-rose-500/10 border border-rose-500/20" :
              "bg-amber-500/10 border border-amber-500/20"
            )}>
              {(result.quality === 'Good' || result.status === 'Healthy') ? <CheckCircle className="text-emerald-400 shrink-0" /> : 
               (result.quality === 'Bad' || result.severity === 'High') ? <XCircle className="text-rose-400 shrink-0" /> :
               <AlertCircle className="text-amber-400 shrink-0" />}
              
              <div>
                <h4 className="font-bold text-white text-lg">
                  {type === 'seed' ? `Quality: ${result.quality}` : `Status: ${result.status}`}
                </h4>
                <p className="text-white/60 text-sm mt-1">{result.recommendation}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(result.features || result.issues || []).map((item: string, i: number) => (
                <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-white/80">
                  <span className="text-emerald-400 mr-1">●</span> {item}
                </div>
              ))}
            </div>

            {result.causes && result.causes.length > 0 && (
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <h5 className="text-xs font-bold text-white/40 uppercase mb-2">Possible Causes</h5>
                <ul className="space-y-1">
                  {result.causes.map((cause: string, i: number) => (
                    <li key={i} className="text-xs text-white/70 flex items-center gap-2">
                      <div className="w-1 h-1 bg-rose-400 rounded-full" />
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
