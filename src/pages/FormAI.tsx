import React, { useState } from 'react';

const FormAI: React.FC = () => {
  const [formData, setFormData] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: ''
  });

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Here you would typically send the survey data to a backend
    console.log('Survey Data:', formData);
    alert('Survey Submitted! Check console for data.');
  };

  return (
    <div className="bg-background text-foreground font-exo p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">🎯 5-Question Smart Survey</h1>
        
        <div className="space-y-8">
          {/* Question 1 */}
          <div>
            <h2 className="text-xl font-semibold text-card-foreground mb-4">1. Apakah bisnis Anda sudah punya website yang aktif dan menghasilkan?</h2>
            <div className="space-y-3">
              {['Sudah', 'Ada tapi tidak efektif', 'Belum'].map(option => (
                <label key={option} className="flex items-center bg-card p-4 rounded-lg border border-border cursor-pointer hover:bg-muted">
                  <input type="radio" name="q1" value={option} checked={formData.q1 === option} onChange={e => handleRadioChange('q1', e.target.value)} className="form-radio h-5 w-5 text-primary bg-card border-border focus:ring-primary" />
                  <span className="ml-4 text-lg">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div>
            <h2 className="text-xl font-semibold text-card-foreground mb-4">2. Apakah Anda membutuhkan sistem otomatis seperti auto-reply / AI untuk membantu chat dan operasional?</h2>
            <div className="space-y-3">
              {['Sangat perlu', 'Perlu', 'Tidak perlu'].map(option => (
                <label key={option} className="flex items-center bg-card p-4 rounded-lg border border-border cursor-pointer hover:bg-muted">
                  <input type="radio" name="q2" value={option} checked={formData.q2 === option} onChange={e => handleRadioChange('q2', e.target.value)} className="form-radio h-5 w-5 text-primary bg-card border-border focus:ring-primary" />
                  <span className="ml-4 text-lg">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 3 */}
          <div>
            <h2 className="text-xl font-semibold text-card-foreground mb-4">3. Apakah Anda memerlukan video profesional untuk iklan atau branding?</h2>
            <div className="space-y-3">
              {['Ya', 'Mungkin', 'Tidak'].map(option => (
                <label key={option} className="flex items-center bg-card p-4 rounded-lg border border-border cursor-pointer hover:bg-muted">
                  <input type="radio" name="q3" value={option} checked={formData.q3 === option} onChange={e => handleRadioChange('q3', e.target.value)} className="form-radio h-5 w-5 text-primary bg-card border-border focus:ring-primary" />
                  <span className="ml-4 text-lg">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 4 */}
          <div>
            <h2 className="text-xl font-semibold text-card-foreground mb-4">4. Prioritas utama Anda saat ini apa?</h2>
            <div className="space-y-3">
              {['Website', 'Automasi/AI', 'Video marketing', 'Branding', 'Kombinasi'].map(option => (
                <label key={option} className="flex items-center bg-card p-4 rounded-lg border border-border cursor-pointer hover:bg-muted">
                  <input type="radio" name="q4" value={option} checked={formData.q4 === option} onChange={e => handleRadioChange('q4', e.target.value)} className="form-radio h-5 w-5 text-primary bg-card border-border focus:ring-primary" />
                  <span className="ml-4 text-lg">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 5 */}
          <div>
            <h2 className="text-xl font-semibold text-card-foreground mb-4">5. Maukah anda mencoba DEMO Website dengan Chat otomatis AI sehingga bisa menghandle lebih dari ribuan pelanggan tanpa terganggu ?</h2>
            <div className="space-y-3">
              {['Siap', 'Siap setelah konsultasi', 'Belum siap'].map(option => (
                <label key={option} className="flex items-center bg-card p-4 rounded-lg border border-border cursor-pointer hover:bg-muted">
                  <input type="radio" name="q5" value={option} checked={formData.q5 === option} onChange={e => handleRadioChange('q5', e.target.value)} className="form-radio h-5 w-5 text-primary bg-card border-border focus:ring-primary" />
                  <span className="ml-4 text-lg">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-8 bg-primary text-primary-foreground font-bold py-4 px-6 rounded-lg hover:bg-primary-glow transition-all duration-300 glow-primary text-xl"
        >
          Submit Survey
        </button>
      </div>
    </div>
  );
};

export default FormAI;