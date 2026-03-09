import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Sparkles, Download, Image as ImageIcon, User, X, Zap, Crown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function CreatorPage() {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [model, setModel] = useState("standard");

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };

  const removeProductImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProductImage(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarImage(e.target.files[0]);
    }
  };

  const removeAvatarImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAvatarImage(null);
  };

  const handleGenerate = async () => {
    if (!productImage) {
      toast.error("Please upload a product image first.");
      return;
    }

    setLoading(true);
    setResultUrl(null);
    setGeneratedPrompt(null);

    try {
      const formData = new FormData();
      formData.append('product', productImage);
      if (avatarImage) {
        formData.append('avatar', avatarImage);
      }
      formData.append('prompt', prompt || "Make it look professional and aesthetic");
      
      const selectedModel = model === 'pro' ? 'google/gemini-3-pro-image-preview' : 'google/gemini-2.5-flash-image';
      formData.append('model', selectedModel);

      const { data, error } = await supabase.functions.invoke('creator-api', {
        body: formData,
      });

      if (error) throw error;
      
      if (data.success) {
        setResultUrl(data.resultUrl);
        setGeneratedPrompt(data.prompt);
        toast.success("Image generated successfully!");
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }

    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || "Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resultUrl) return;
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `el-vision-creator-${Date.now()}.webp`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Download started!");
    } catch (e) {
      console.error(e);
      toast.error("Download failed, try right-clicking the image.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            eL Vision Image Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Transform your product photos into professional masterpieces instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Configuration
              </CardTitle>
              <CardDescription className="text-gray-400">
                Upload your assets and describe your vision.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Product Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  Product Image (Required)
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-purple-500 transition-colors cursor-pointer relative group h-64 flex flex-col items-center justify-center overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProductChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {productImage ? (
                    <div className="relative h-full w-full">
                       <img 
                        src={URL.createObjectURL(productImage)} 
                        alt="Preview" 
                        className="h-full w-full object-contain rounded-md"
                      />
                      <div className="absolute top-2 right-2 z-20">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full shadow-md hover:bg-red-600"
                          onClick={removeProductImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md pointer-events-none">
                        <p className="text-white text-sm font-medium">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                      <Upload className="w-10 h-10 mb-3 text-gray-500" />
                      <p className="text-sm font-medium text-gray-300">Click or drag product image</p>
                      <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WEBP</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Avatar Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  Avatar/Model (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-purple-500 transition-colors cursor-pointer relative group h-40 flex flex-col items-center justify-center overflow-hidden">
                   <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {avatarImage ? (
                     <div className="relative h-full w-full">
                       <img 
                        src={URL.createObjectURL(avatarImage)} 
                        alt="Avatar Preview" 
                        className="h-full w-full object-contain rounded-md"
                      />
                       <div className="absolute top-2 right-2 z-20">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full shadow-md hover:bg-red-600"
                          onClick={removeAvatarImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md pointer-events-none">
                        <p className="text-white text-sm">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                      <User className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-xs font-medium text-gray-300">Upload person (Optional)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Model Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300">Model Selection</Label>
                <RadioGroup defaultValue="standard" value={model} onValueChange={setModel} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="standard" id="standard" className="peer sr-only" />
                    <Label
                      htmlFor="standard"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-600 bg-gray-900 p-4 hover:bg-gray-800 hover:text-white peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-950/20 [&:has([data-state=checked])]:border-purple-500 cursor-pointer transition-all"
                    >
                      <Zap className="mb-3 h-6 w-6 text-yellow-400" />
                      <div className="text-center">
                        <div className="font-semibold text-white">Standard</div>
                        <div className="text-xs text-gray-400 mt-1">Fast Generation</div>
                      </div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="pro" id="pro" className="peer sr-only" />
                    <Label
                      htmlFor="pro"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-gray-600 bg-gray-900 p-4 hover:bg-gray-800 hover:text-white peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-pink-950/20 [&:has([data-state=checked])]:border-pink-500 cursor-pointer transition-all"
                    >
                      <Crown className="mb-3 h-6 w-6 text-pink-400" />
                      <div className="text-center">
                        <div className="font-semibold text-white">Pro</div>
                        <div className="text-xs text-gray-400 mt-1">High Quality</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Prompt */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Instructions
                </label>
                <Textarea 
                  placeholder="e.g. Make it look like a luxury advertisement on a marble table with soft sunset lighting..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-gray-900 border-gray-700 min-h-[100px] text-white placeholder:text-gray-500"
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={loading || !productImage}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg shadow-lg shadow-purple-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>

            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">Result</CardTitle>
              <CardDescription className="text-gray-400">
                Your AI-enhanced product image will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-gray-900/50 rounded-lg m-6 border border-gray-700/50 relative overflow-hidden group">
              
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                  <p className="text-purple-400 animate-pulse font-medium">Analyzing & Creating...</p>
                </div>
              )}

              {resultUrl ? (
                <>
                  <img 
                    src={resultUrl} 
                    alt="Generated Result" 
                    className="w-full h-full object-contain rounded-md shadow-2xl"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      onClick={handleDownload}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 p-8">
                  <div className="w-20 h-20 border-4 border-dashed border-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 opacity-20 text-purple-500" />
                  </div>
                  <p>Ready to create something amazing?</p>
                </div>
              )}
            </CardContent>
            {generatedPrompt && (
                <div className="p-4 bg-black/20 text-xs text-gray-500 border-t border-gray-700">
                    <p className="font-semibold mb-1">AI Enhanced Prompt:</p>
                    {generatedPrompt}
                </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}
