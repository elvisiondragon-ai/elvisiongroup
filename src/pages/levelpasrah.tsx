import React from 'react';


import levelImage from '@/assets/LEVL.jpg';

const LevelPasrahPage = () => {
  return (
    <>
      <style>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        
        .container {
            max-width: 1200px;
            width: 100%;
        }
        
        .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .tree-container {
            display: flex;
            flex-direction: column;
            gap: 30px;
            position: relative;
        }
        
        .level {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transform: translateX(0);
            transition: all 0.3s ease;
            position: relative;
        }
        
        .level:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        
        .level-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            gap: 15px;
        }
        
        .level-number {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5em;
            font-weight: bold;
            color: white;
            flex-shrink: 0;
        }
        
        .level-title {
            font-size: 1.8em;
            font-weight: bold;
            color: #333;
        }
        
        .level-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .content-box {
            padding: 15px;
            border-radius: 10px;
            background: #f8f9fa;
            border-left: 4px solid;
        }
        
        .content-box h3 {
            margin-bottom: 8px;
            font-size: 1.1em;
            color: black;
        }
        
        .content-box p {
            color: #666;
            line-height: 1.6;
        }
        
        .money {
            font-size: 1.4em;
            font-weight: bold;
            color: #28a745;
        }
        
        /* Level specific colors */
        .level-1 .level-number { background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%); }
        .level-1 .content-box { border-left-color: #66a6ff; }
        
        .level-2 .level-number { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
        .level-2 .content-box { border-left-color: #fed6e3; }
        
        .level-3 .level-number { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }
        .level-3 .content-box { border-left-color: #fcb69f; }
        
        .level-4 .level-number { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
        .level-4 .content-box { border-left-color: #ff9a9e; }
        
        .level-5 .level-number { background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%); }
        .level-5 .content-box { border-left-color: #ffd89b; }
        .level-5 {
            background: linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%);
            border: 3px solid #ffd89b;
        }
        
        .arrow {
            text-align: center;
            font-size: 2em;
            color: white;
            opacity: 0.7;
            margin: -10px 0;
        }
        
        .insight {
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            margin-top: 30px;
            color: white;
            text-align: center;
        }
        
        .insight h3 {
            margin-bottom: 10px;
            font-size: 1.3em;
        }

        .header-image {
            max-width: 100%;
            height: auto;
            border-radius: 15px;
            margin-top: 20px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        
        /* Added styles from fokus-visi */
        .fokus-container {
            max-width: 900px;
            margin: 40px auto 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
        }
        .fokus-container .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: left;
        }
        .fokus-container h1 {
            font-size: 28px;
            margin-bottom: 15px;
        }
        .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        .section {
            margin-bottom: 35px;
            padding: 25px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 5px solid #667eea;
        }
        .section h2 {
            color: #667eea;
            font-size: 22px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }
        .section h2::before {
            content: "→";
            margin-right: 10px;
            font-weight: bold;
        }
        .wrong {
            background: #ffe6e6;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #dc3545;
            margin-bottom: 20px;
        }
        .wrong h3 {
            color: #dc3545;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        .wrong h3::before {
            content: "✗";
            margin-right: 10px;
            font-size: 24px;
        }
        .correct {
            background: #e6f7e6;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
        }
        .correct h3 {
            color: #28a745;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        .correct h3::before {
            content: "✓";
            margin-right: 10px;
            font-size: 24px;
        }
        ul {
            list-style: none;
            padding-left: 0;
        }
        ul li {
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
            color: black;
        }
        ul li::before {
            content: "•";
            position: absolute;
            left: 10px;
            color: #667eea;
            font-weight: bold;
        }
        .steps {
            counter-reset: step-counter;
        }
        .steps li {
            counter-increment: step-counter;
            padding-left: 35px;
        }
        .steps li::before {
            content: counter(step-counter) ".";
            position: absolute;
            left: 10px;
            color: #667eea;
            font-weight: bold;
        }
        .highlight {
            background: #fff3cd;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #ffc107;
            margin-top: 25px;
        }
        .highlight p {
            color: black;
        }
        .highlight strong {
            color: #856404;
            font-size: 18px;
        }
        .vision-levels {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 15px;
        }
        .level-box {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 2px solid #667eea;
        }
        .level-box h4 {
            color: #667eea;
            margin-bottom: 10px;
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 1.8em;
            }
            
            .level-content {
                grid-template-columns: 1fr;
            }

            .fokus-container {
                padding: 20px;
            }
            
            .vision-levels {
                grid-template-columns: 1fr;
            }
        }
      `}</style>
      <div className="container" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
            <div className="header">
                <h1>🌳 Pohon Kekuatan Pasrah</h1>
                <img src={levelImage} alt="Pohon Kekuatan Pasrah" className="header-image" />
                <p>Semakin Dalam Kepasrahan, Semakin Mudah Menarik Hal Besar</p>
            </div>
            
            <div className="tree-container">
                {/* Level 1 */}
                <div className="level level-1">
                    <div className="level-header">
                        <div className="level-number">1</div>
                        <div className="level-title">Ketenangan</div>
                    </div>
                    <div className="level-content">
                        <div className="content-box">
                            <h3>💭 State Emosional</h3>
                            <p>Mulai melepaskan kontrol. Hati mulai tenang dari kecemasan berlebihan.</p>
                        </div>
                        <div className="content-box">
                            <h3>💰 Rezeki</h3>
                            <p className="money">Rp 1.000.000</p>
                        </div>
                        <div className="content-box">
                            <h3>✨ Perubahan</h3>
                            <p>Pikiran tidak lagi dipenuhi kekhawatiran. Awal dari perjalanan.</p>
                        </div>
                    </div>
                </div>
                
                <div className="arrow">↓</div>
                
                {/* Level 2 */}
                <div className="level level-2">
                    <div className="level-header">
                        <div className="level-number">2</div>
                        <div className="level-title">Kenyamanan</div>
                    </div>
                    <div className="level-content">
                        <div className="content-box">
                            <h3>💭 State Emosional</h3>
                            <p>Merasa nyaman dengan ketidakpastian. Tidak lagi resah berlebihan.</p>
                        </div>
                        <div className="content-box">
                            <h3>💰 Rezeki</h3>
                            <p className="money">Rp 5.000.000</p>
                        </div>
                        <div className="content-box">
                            <h3>✨ Perubahan</h3>
                            <p>Tubuh rileks, tidur lebih nyenyak. Rezeki mulai meningkat 5x lipat.</p>
                        </div>
                    </div>
                </div>
                
                <div className="arrow">↓</div>
                
                {/* Level 3 */}
                <div className="level level-3">
                    <div className="level-header">
                        <div className="level-number">3</div>
                        <div className="level-title">Plong</div>
                    </div>
                    <div className="level-content">
                        <div className="content-box">
                            <h3>💭 State Emosional</h3>
                            <p>Lebih terasa plong. Terasa lapang dan bebas dari beban mental.</p>
                        </div>
                        <div className="content-box">
                            <h3>💰 Rezeki</h3>
                            <p className="money">Rp 50.000.000</p>
                        </div>
                        <div className="content-box">
                            <h3>✨ Perubahan</h3>
                            <p>Breakthrough! Beban hidup terasa ringan. Rezeki melompat 10x.</p>
                        </div>
                    </div>
                </div>
                
                <div className="arrow">↓</div>
                
                {/* Level 4 */}
                <div className="level level-4">
                    <div className="level-header">
                        <div className="level-number">4</div>
                        <div className="level-title">Mulai Bahagia</div>
                    </div>
                    <div className="level-content">
                        <div className="content-box">
                            <h3>💭 State Emosional</h3>
                            <p>Mulai terasa bahagia. Kebahagiaan sejati muncul dari dalam.</p>
                        </div>
                        <div className="content-box">
                            <h3>💰 Rezeki</h3>
                            <p className="money">Rp 100.000.000</p>
                        </div>
                        <div className="content-box">
                            <h3>✨ Perubahan</h3>
                            <p>Hidup mengalir dengan mudah. Sinkronisitas terjadi sering.</p>
                        </div>
                    </div>
                </div>
                
                <div className="arrow">↓</div>
                
                {/* Level 5 */}
                <div className="level level-5">
                    <div className="level-header">
                        <div className="level-number">5</div>
                        <div className="level-title">Bahagia Sempurna</div>
                    </div>
                    <div className="level-content">
                        <div className="content-box">
                            <h3>💭 State Emosional</h3>
                            <p>Benar-benar bahagia. Kepasrahan total & kedamaian abadi.</p>
                        </div>
                        <div className="content-box">
                            <h3>💰 Rezeki</h3>
                            <p className="money">Rp 500.000.000</p>
                        </div>
                        <div className="content-box">
                            <h3>✨ Perubahan</h3>
                            <p>Menarik hal besar dengan mudah. Manifestasi instant. Hidup dalam flow.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="insight">
                <h3>🔑 Kunci Utama</h3>
                <p>Kepasrahan bukan tentang menyerah, tapi tentang melepaskan kontrol dengan penuh kesadaran. Saat kita benar-benar pasrah, kita membuka ruang bagi alam semesta untuk memberikan yang terbaik. Paradoksnya: semakin kita melepas, semakin banyak yang datang.</p>
            </div>

            <div className="fokus-container">
                <div className="header">
                    <h1>📝 Catatan: Fokus & Visi</h1>
                    <div className="subtitle">
                        <p><strong>Fokus 1 titik:</strong> 100/100 dari Sadar ke 1 titik (Charge)</p>
                        <p><strong>Keadaan Normal:</strong> 7/100 dari Fokus, 93/100 Random</p>
                    </div>
                </div>

                <div className="section">
                    <h2>Perbandingan Cara Fokus</h2>
                    
                    <div className="wrong">
                        <h3>❌ SALAH</h3>
                        <p style={{ marginBottom: '10px', fontWeight: 'bold', color: 'black' }}>Fokus 1 Titik → Langsung ke Keinginan:</p>
                        <ul>
                            <li>Bahagia</li>
                            <li>Cinta</li>
                            <li>Uang</li>
                            <li>Dunia</li>
                        </ul>
                    </div>
                    
                    <div className="correct">
                        <h3>✓ BENAR</h3>
                        <p style={{ marginBottom: '10px', fontWeight: 'bold', color: 'black' }}>Fokus 1 Titik →</p>
                        <ul className="steps">
                            <li><strong>Pastikan 100/100 Sadar</strong></li>
                            <li><strong>Buat ke Pasrah Lv 3++</strong> sangat dalam agar 100/100 dari diri kita dengan senang hati fokus</li>
                            <li><strong>Visi yang dimurnikan atau Feel</strong> ke Keinginan:
                                <ul style={{ marginTop: '10px' }}>
                                    <li>Bahagia</li>
                                    <li>Cinta</li>
                                    <li>Uang</li>
                                    <li>Dunia</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="section">
                    <h2>Fokus 1 Titik → Murnikan Visi Pasrah</h2>
                    
                    <div className="vision-levels">
                        <div className="level-box">
                            <h4>Tahapan Pasrah</h4>
                            <ul>
                                <li>Pasrah Lv 1</li>
                                <li>Pasrah Lv 2</li>
                                <li>Pasrah Lv 3</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="highlight">
                    <strong>⚠️ ARTI Pemurnian VISI/FEEL:</strong>
                    <p style={{ marginTop: '10px' }}>
                        Visi yang IDENTIK tapi tidak dilihat → Dialihkan ke Realita
                    </p>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default LevelPasrahPage;
