import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";

interface RoleSelectionProps {
  onRoleSelect: (role: 'ignis' | 'genesis') => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<'ignis' | 'genesis' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/fbd7b86c-d8ea-447e-87ad-d67254074e61.png" 
              alt="eL Vision Group Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold font-orbitron bg-gradient-primary bg-clip-text text-transparent mb-4">
            What are you?
          </h1>
          <p className="text-muted-foreground text-lg">
            Pilih peran Anda dalam perjalanan spiritual
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* eL Vision Ignis */}
          <Card 
            className={`p-8 cursor-pointer transition-all duration-300 border-2 hover:scale-105 ${
              selectedRole === 'ignis' 
                ? 'border-primary bg-gradient-primary/10 shadow-glow' 
                : 'border-border bg-gradient-secondary hover:border-primary/50'
            }`}
            onClick={() => setSelectedRole('ignis')}
          >
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-gradient-primary/20">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold font-orbitron text-foreground mb-3">
                  eL Vision Ignis
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pembakar api spiritual yang memurnikan jiwa melalui transformasi dalam. 
                  Fokus pada pembersihan energi negatif dan pencerahan spiritual.
                </p>
              </div>
              
              <div className="pt-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Spiritual Purification</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Energy Cleansing</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Inner Transformation</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* eL Vision Genesis */}
          <Card 
            className={`p-8 cursor-pointer transition-all duration-300 border-2 hover:scale-105 ${
              selectedRole === 'genesis' 
                ? 'border-primary bg-gradient-primary/10 shadow-glow' 
                : 'border-border bg-gradient-secondary hover:border-primary/50'
            }`}
            onClick={() => setSelectedRole('genesis')}
          >
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-gradient-primary/20">
                  <Zap className="w-12 h-12 text-primary" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold font-orbitron text-foreground mb-3">
                  eL Vision Genesis
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pencipa awal kehidupan baru yang menciptakan realitas melalui visi dan manifestasi. 
                  Fokus pada penciptaan dan realisasi potensi diri.
                </p>
              </div>
              
              <div className="pt-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Reality Creation</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Vision Manifestation</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Potential Realization</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="px-8 py-3 text-lg font-medium bg-gradient-primary hover:opacity-90 text-primary-foreground disabled:opacity-50"
            size="lg"
          >
            {selectedRole ? `Lanjutkan sebagai ${selectedRole === 'ignis' ? 'eL Vision Ignis' : 'eL Vision Genesis'}` : 'Pilih peran Anda'}
          </Button>
        </div>
      </div>
    </div>
  );
}