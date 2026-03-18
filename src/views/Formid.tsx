"use client";

import React, { useState } from 'react';

const Formid: React.FC = () => {
  const [formData, setFormData] = useState({
    pendapatan: '',
    posisi: '',
    posisiLainnya: '',
    program: '',
    programLainnya: '',
    kesiapan: '',
    outputGoal: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    let message = 'Kak Renata saya sudah isi survey 1:1 VIP:\n\n';
    message += `Berapa kisaran pendapatan Anda saat ini?\n- ${formData.pendapatan}\n\n`;
    
    let posisi = formData.posisi;
    if (posisi === 'Lainnya') {
      posisi += `: ${formData.posisiLainnya}`;
    }
    message += `Apa posisi atau tanggung jawab utama Anda dalam pekerjaan?\n- ${posisi}\n\n`;

    let program = formData.program;
    if (program === 'Lainnya') {
      program += `: ${formData.programLainnya}`;
    }
    message += `Apa yang Anda cari dari program ini?\n- ${program}\n\n`;
    
    message += `Seberapa siap Anda mencoba 2 minggu program gratis ini yang hasilnya dapat dirasakan instan?\n- ${formData.kesiapan}\n\n`;
    message += `**VIP 1:1 adalah program eksklusif untuk profesional berpenghasilan tinggi dengan tekanan dan tanggung jawab besar.**\n`;
    message += `Setelah program ini, output goal apa yang Anda harapkan?\n- ${formData.outputGoal}`;

    const whatsappUrl = `https://wa.me/62895325633487?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  };

  return (
    <div className="bg-background text-foreground font-exo p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Survey 1:1 VIP</h1>
        
        <div className="space-y-8">
          {/* Pertanyaan 1 */}
          <div>
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Berapa kisaran pendapatan Anda saat ini?</h2>
            <div className="space-y-3">
              {['Di bawah 30 juta/bulan', '30–50 juta/bulan', '50–100 juta/bulan', 'Di atas 100 juta/bulan'].map(option => (
                <label key={option} className="flex items-center bg-card p-4 rounded-lg border border-border cursor-pointer hover:bg-muted">
                  <input type="radio" name="pendapatan" value={option} onChange={e => handleRadioChange('pendapatan', e.target.value)} className="form-radio h-5 w-5 text-primary bg-card border-border focus:ring-primary" />
                  <span className="ml-4 text-lg">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pertanyaan 2 */}
          <div>
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Apa posisi atau tanggung jawab utama Anda dalam pekerjaan?</h2>
            <div className="space-y-3">
              {['Founder / Business Owner', 'C-Level (CEO, COO, CTO, CFO)', 'Senior Manager', 'Profesional Berpenghasilan Tinggi', 'Lainnya'].map(option => (
                <div key={option}>
                  <label className="flex items-center bg-card p-4 rounded-lg border border-border cursor-pointer hover:bg-muted">
                    <input type="radio" name="posisi" value={option} onChange={e => handleRadioChange('posisi', e.target.value)} className="form-radio h-5 w-5 text-primary bg-card border-border focus:ring-primary" />
                    <span className="ml-4 text-lg">{option}</span>
                  </label>
                  {option === 'Lainnya' && formData.posisi === 'Lainnya' && (
                    <input type="text" name="posisiLainnya" onChange={handleInputChange} placeholder="Sebutkan posisi Anda" className="mt-2 w-full bg-card border-border p-3 rounded-lg focus:ring-primary focus:border-primary cyber-input" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pertanyaan 3 */}
          <div>
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Apa yang Anda cari dari program ini?</h2>
            <div className="space-y-3">
              {['Pikiran lebih jernih & stabil', 'Pengurangan stres secara cepat', 'Ketajaman dalam pengambilan keputusan', 'Ketenangan batin untuk performa tinggi', 'Lainnya'].map(option => (
                <div key={option}>
                  <label className="flex items-center bg-card p-4 rounded-lg border border-border cursor-pointer hover:bg-muted">
                    <input type="radio" name="program" value={option} onChange={e => handleRadioChange('program', e.target.value)} className="form-radio h-5 w-5 text-primary bg-card border-border focus:ring-primary" />
                    <span className="ml-4 text-lg">{option}</span>
                  </label>
                  {option === 'Lainnya' && formData.program === 'Lainnya' && (
                    <input type="text" name="programLainnya" onChange={handleInputChange} placeholder="Sebutkan apa yang Anda cari" className="mt-2 w-full bg-card border-border p-3 rounded-lg focus:ring-primary focus:border-primary cyber-input" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pertanyaan 4 */}
          <div>
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Seberapa siap Anda mencoba 2 minggu program gratis ini yang hasilnya dapat dirasakan instan?</h2>
            <div className="space-y-3">
              {['Sangat siap', 'Siap', 'Pertimbangkan dulu'].map(option => (
                <label key={option} className="flex items-center bg-card p-4 rounded-lg border border-border cursor-pointer hover:bg-muted">
                  <input type="radio" name="kesiapan" value={option} onChange={e => handleRadioChange('kesiapan', e.target.value)} className="form-radio h-5 w-5 text-primary bg-card border-border focus:ring-primary" />
                  <span className="ml-4 text-lg">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pertanyaan 5 (Essay) */}
          <div>
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              <span className="font-bold">VIP 1:1 adalah program eksklusif untuk profesional berpenghasilan tinggi dengan tekanan dan tanggung jawab besar.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-4">Setelah program ini, output goal apa yang Anda harapkan?</p>
            <textarea
              name="outputGoal"
              onChange={handleInputChange}
              rows={6}
              className="w-full bg-card border-border p-3 rounded-lg focus:ring-primary focus:border-primary cyber-input"
              placeholder="Jawab esai di sini..."
            ></textarea>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-8 bg-primary text-primary-foreground font-bold py-4 px-6 rounded-lg hover:bg-primary-glow transition-all duration-300 glow-primary text-xl"
        >
          Kirim Jawaban & Lanjutkan ke WhatsApp
        </button>
      </div>
    </div>
  );
};

export default Formid;
