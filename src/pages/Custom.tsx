
import React, { useState } from 'react';

const Custom: React.FC = () => {
  const [formData, setFormData] = useState({
    pilihanDurasi: '',
    biayaFleksibel: '',
    esai: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    let message = 'Kak Renata, kami dari yayasan/badan amal dan tertarik dengan program khusus:\n\n';
    message += `Pilihan Durasi Program:\n- ${formData.pilihanDurasi}\n\n`;
    message += `Biaya Fleksibel yang Diajukan (per bulan):\n- ${formData.biayaFleksibel}\n\n`;
    message += `Essai Harapan & Tujuan:\n- ${formData.esai}`;

    const whatsappUrl = `https://wa.me/62895325633487?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  };

  return (
    <div className="bg-background text-foreground font-exo p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Survey Khusus Yayasan/Badan Amal</h1>
        
        <div className="space-y-8">
          {/* Pertanyaan 1: Pilihan Durasi */}
          <div>
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Pilih durasi program yang paling sesuai untuk yayasan/badan amal Anda:</h2>
            <div className="space-y-3">
              {['6 Bulan', '1 Tahun'].map(option => (
                <label key={option} className="flex items-center bg-card p-4 rounded-lg border border-border cursor-pointer hover:bg-muted">
                  <input type="radio" name="pilihanDurasi" value={option} onChange={e => handleRadioChange('pilihanDurasi', e.target.value)} className="form-radio h-5 w-5 text-primary bg-card border-border focus:ring-primary" />
                  <span className="ml-4 text-lg">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pertanyaan 2: Biaya Fleksibel */}
          <div>
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Untuk Yayasan/Badan Amal, biaya fleksibel senyaman mungkin.</h2>
            <p className="text-lg text-muted-foreground mb-4">Silakan ajukan biaya per bulan yang paling sesuai dengan anggaran Anda.</p>
            <input
              type="text"
              name="biayaFleksibel"
              value={formData.biayaFleksibel}
              onChange={handleInputChange}
              placeholder="Contoh: Rp 1.000.000 / bulan"
              className="w-full bg-card border-border p-3 rounded-lg focus:ring-primary focus:border-primary cyber-input"
            />
          </div>

          {/* Pertanyaan 3: Essai */}
          <div>
            <h2 className="text-xl font-semibold text-card-foreground mb-2">
              Jelaskan harapan dan tujuan yang ingin dicapai melalui program ini.
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Sebagai referensi, program intensif personal biasanya senilai <span className="font-bold text-primary">$100/sesi</span>, dengan total <span className="font-bold text-primary">$800/bulan</span> untuk 8 sesi. Kami memahami kebutuhan yayasan dan memberikan fleksibilitas penuh.
            </p>
            <textarea
              name="esai"
              value={formData.esai}
              onChange={handleInputChange}
              rows={8}
              className="w-full bg-card border-border p-3 rounded-lg focus:ring-primary focus:border-primary cyber-input"
              placeholder="Tuliskan jawaban Anda di sini..."
            ></textarea>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-8 bg-primary text-primary-foreground font-bold py-4 px-6 rounded-lg hover:bg-primary-glow transition-all duration-300 glow-primary text-xl"
        >
          Kirim Pengajuan & Lanjutkan ke WhatsApp
        </button>
      </div>
    </div>
  );
};

export default Custom;
