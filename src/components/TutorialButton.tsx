import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Play, Sparkles, Scroll, Activity, BarChart3, Workflow, Video, ArrowLeft, FileText } from "lucide-react";

interface TutorialButtonProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialButton({ isOpen, onClose }: TutorialButtonProps) {
  const [activeView, setActiveView] = useState<"menu" | "workflow" | "video" | "howtouse">("menu");
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [tutorialThumbnailGenerated, setTutorialThumbnailGenerated] = useState(false);

  const handleClose = () => {
    onClose();
    setShowPlayButton(true);
    setTutorialThumbnailGenerated(false);
    setActiveView("menu");
  };

  const handleBack = () => {
    setActiveView("menu");
    setShowPlayButton(true);
    setTutorialThumbnailGenerated(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-cyan-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {activeView !== "menu" && (
              <Button
                onClick={handleBack}
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <h2 className="text-xl font-bold text-black dark:text-white">Tutorial</h2>
          </div>
          {activeView === "menu" && (
            <Button
              onClick={handleClose}
              className="w-7 h-7 p-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-150 hover:scale-110 active:scale-95 active:translate-y-0.5"
              size="sm"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Menu View - Button Selection */}
          {activeView === "menu" && (
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              <Button
                onClick={() => setActiveView("workflow")}
                className="py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 text-lg font-semibold"
              >
                <Workflow className="w-6 h-6 mr-2" />
                Workflow
              </Button>

              <Button
                onClick={() => setActiveView("video")}
                className="py-4 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 hover:from-blue-700 hover:via-sky-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 text-lg font-semibold"
              >
                <Video className="w-6 h-6 mr-2" />
                Video Tutorial
              </Button>

              <Button
                onClick={() => setActiveView("howtouse")}
                className="py-4 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 hover:from-green-700 hover:via-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 text-lg font-semibold"
              >
                <FileText className="w-6 h-6 mr-2" />
                How to Use
              </Button>
            </div>
          )}

          {/* Workflow Content */}
          {activeView === "workflow" && (
            <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg p-4 space-y-4 border border-indigo-200/50 dark:border-indigo-800/50">
              <h3 className="text-lg font-medium text-center text-indigo-800 dark:text-indigo-200 mb-4">
                Langkah-langkah Menggunakan Ecosystem
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {/* Step 1: Verse of eL Vision */}
                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-black/20 rounded-lg border border-yellow-200/50 dark:border-yellow-800/50">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-full bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-400 shadow-lg shadow-yellow-500/30">
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                      1. Dengar Verse of eL Vision
                    </h4>
                    <p className="text-lg text-yellow-700 dark:text-yellow-300">
                      Mulai dengan mendengarkan audio frequency
                    </p>
                  </div>
                  <div className="text-2xl">🎧</div>
                </div>

                {/* Arrow */}
                <div className="text-center text-gray-400">
                  <div className="text-2xl">↓</div>
                </div>

                {/* Step 2: Jurnal Spiritual */}
                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-black/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400 shadow-xl shadow-amber-500/50 border-2 border-amber-300/30">
                      <Scroll className="w-5 h-5 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-800 dark:text-amber-200">
                      2. Tulis Jurnal Spiritual
                    </h4>
                    <p className="text-lg text-amber-700 dark:text-amber-300">
                      Refleksikan perjalanan spiritual Anda → Lepaskan hal yang sedang kamu kejar agar
                      mudah tercapai setelah dengar Audio
                    </p>
                  </div>
                  <div className="text-2xl">📝</div>
                </div>

                {/* Arrow */}
                <div className="text-center text-gray-400">
                  <div className="text-2xl">↓</div>
                </div>

                {/* Step 3: Elite Habit */}
                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-black/20 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 shadow-xl shadow-emerald-500/50 border-2 border-emerald-300/30">
                      <Activity className="w-5 h-5 text-white drop-shadow-lg animate-pulse" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-emerald-800 dark:text-emerald-200">
                      3. Lakukan Elite Habit
                    </h4>
                    <p className="text-lg text-emerald-700 dark:text-emerald-300">
                      Olahraga dengan mindfulness melatih ketenangan dan mempercepat pencapaian
                    </p>
                  </div>
                  <div className="text-2xl">💪</div>
                </div>

                {/* After 3 days notice */}
                <div className="text-center py-2">
                  <div className="inline-block bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-700">
                    <span className="text-lg font-medium text-purple-800 dark:text-purple-200">
                      ⏰ Setelah 7 hari rutin...
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-center text-gray-400">
                  <div className="text-2xl">↓</div>
                </div>

                {/* Step 4: Personal Analytics */}
                <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-black/20 rounded-lg border border-violet-200/50 dark:border-violet-800/50">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 shadow-2xl shadow-violet-500/60 border-2 border-violet-400/40 animate-pulse">
                      <BarChart3 className="w-5 h-5 text-white drop-shadow-2xl animate-pulse" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-violet-800 dark:text-violet-200">
                      4. Click Personal Analytics
                    </h4>
                    <p className="text-lg text-violet-700 dark:text-violet-300">
                      Dapatkan Powerful Insight dari Analytics tentang jati diri kamu dan solusinya
                    </p>
                  </div>
                  <div className="text-2xl">🤯</div>
                </div>

                {/* Result */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 p-4 rounded-lg border-2 border-green-200 dark:border-green-800 text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Anda akan mendapat jawaban mencengangkan tentang diri Anda!
                  </h4>
                  <p className="text-lg text-green-700 dark:text-green-300 italic">
                    *Personal Analytics semakin efektif jika semakin banyak total Verse, total Jurnal
                    Spiritual, dan total Elite Habit
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Video Content */}
          {activeView === "video" && (
            <div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                    Video Tutorial
                  </h3>
                  <p className="text-lg text-blue-600 dark:text-blue-300">
                    Tonton video lengkap untuk panduan detail
                  </p>
                </div>
              </div>

              {/* Arrow pointing down to video */}
              <div className="text-center text-gray-400 mb-4">
                <div className="text-4xl font-black">⬇</div>
              </div>

              <div className="relative">
                <video
                  className="w-full rounded-lg"
                  controls={!showPlayButton}
                  preload="metadata"
                  crossOrigin="anonymous"
                  onPlay={() => setShowPlayButton(false)}
                  onCanPlay={(e) => {
                    if (!tutorialThumbnailGenerated) {
                      const video = e.target as HTMLVideoElement;
                      video.currentTime = 0;
                      setTutorialThumbnailGenerated(true);
                    }
                  }}
                  onSeeked={(e) => {
                    const video = e.target as HTMLVideoElement;
                    if (tutorialThumbnailGenerated && video.currentTime >= 0) {
                      video.pause();
                    }
                  }}
                  onError={(e) => {
                    console.error("Video error:", e);
                    setShowPlayButton(true);
                  }}
                  style={{ aspectRatio: "9/16", maxHeight: "70vh" }}
                >
                  <source
                    src="https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/admin-image/reactmove.mp4"
                    type="video/mp4"
                  />
                  Browser Anda tidak mendukung video HTML5.
                </video>

                {/* Overlay Play Button */}
                {showPlayButton && (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                    onClick={(e) => {
                      const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
                      video.currentTime = 0; // Start from beginning
                      video.play();
                      setShowPlayButton(false);
                    }}
                  >
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-6 group-hover:bg-black/70 transition-all duration-300">
                      <Play
                        className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-300"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* How to Use - Content */}
          {activeView === "howtouse" && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {/* Cover */}
              <div className="text-center py-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-800/60 dark:to-purple-800/60 rounded-lg border border-indigo-200 dark:border-indigo-600 mb-6">
                <h1 className="text-4xl font-bold text-indigo-900 dark:text-indigo-200 mb-4">
                  🌟 SELAMAT DATANG DI 🌟
                </h1>
                <h2 className="text-3xl font-bold text-indigo-800 dark:text-indigo-300 mb-6">
                  eL VISION GROUP
                </h2>
                <p className="text-lg text-blue-700 dark:text-blue-300 font-semibold">
                  Transformasi Spiritual & Kecerdasan Emosional
                </p>
                <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">
                  Panduan Lengkap Untuk Pemula
                </p>
              </div>

              {/* Introduction */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">
                  Apa Itu eL Vision Group?
                </h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  <strong>eL Vision Group</strong> adalah aplikasi revolusioner untuk tracking spiritual yang menggabungkan teknologi modern dengan kearifan kuno. Kami membantu Anda mencapai potensi tertinggi melalui peningkatan kecerdasan emosional dan intelektual yang terukur.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Bukan sekadar aplikasi biasa - ini adalah ekosistem transformasi kehidupan yang telah terbukti mengubah ribuan pengguna dari kondisi stress, bingung, dan stagnan menjadi individu yang produktif, bahagia, dan mencapai tujuan hidup mereka.
                </p>
              </div>

              {/* Three Pillars */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">
                  Tiga Pilar Transformasi (Berbasis Sains)
                </h2>

                {/* Elite Habit */}
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-800/60 rounded-lg border border-yellow-200 dark:border-yellow-600">
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-3">
                    1. Elite Habit - Optimalisasi Fungsi Otak
                  </h3>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    <strong>Apa itu?</strong> Sistem pelacakan kebiasaan elite yang dirancang untuk mengoptimalkan fungsi kognitif Anda.
                  </p>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    <strong>Dasar Sains:</strong> Penelitian neuroscience menunjukkan bahwa membangun habit loop (kebiasaan berulang) menciptakan jalur neural baru di otak. Konsistensi dalam habit positif meningkatkan neuroplasticity - kemampuan otak untuk reorganisasi dan adaptasi. Ini meningkatkan fungsi prefrontal cortex yang bertanggung jawab untuk decision-making, fokus, dan kontrol emosi.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Manfaat Nyata:</strong> Pikiran lebih jernih, fokus meningkat 40%, produktivitas naik drastis, dan kemampuan membuat keputusan yang lebih baik.
                  </p>
                </div>

                {/* Jurnal Spiritual */}
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-800/60 rounded-lg border border-amber-200 dark:border-amber-600">
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-3">
                    2. Jurnal Spiritual - Pelepasan Emosi Negatif
                  </h3>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    <strong>Apa itu?</strong> Platform jurnal digital untuk mengekspresikan dan memproses emosi Anda secara terstruktur.
                  </p>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    <strong>Dasar Sains:</strong> Expressive writing atau journaling telah terbukti dalam berbagai studi psikologi mengurangi stres, kecemasan, dan depresi. Ketika Anda menulis emosi, Anda mengaktifkan amygdala (pusat emosi) dan hippocampus (memori), yang membantu mengintegrasikan pengalaman traumatis. Ini juga meningkatkan aktivitas prefrontal cortex yang membantu regulasi emosi.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Manfaat Nyata:</strong> Beban pikiran berkurang 60%, tidur lebih nyenyak, hubungan interpersonal membaik, dan kemampuan mengelola stress meningkat signifikan.
                  </p>
                </div>

                {/* Verses Audio */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-800/60 rounded-lg border border-blue-200 dark:border-blue-600">
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-3">
                    3. Verses Audio - Frekuensi Penyembuhan
                  </h3>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    <strong>Apa itu?</strong> Audio verses dengan frekuensi rendah yang dirancang khusus untuk menetralkan emosi negatif.
                  </p>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    <strong>Dasar Sains:</strong> Binaural beats dan low-frequency sound therapy telah dipelajari dalam neuroscience. Frekuensi tertentu (seperti 432 Hz, 528 Hz) terbukti mempengaruhi brainwave patterns. Alpha waves (8-13 Hz) mendorong relaksasi, sementara theta waves (4-8 Hz) meningkatkan kreativitas dan intuisi. Sound therapy juga merangsang pelepasan dopamine dan serotonin - neurotransmitter yang mengatur mood dan kebahagiaan.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Manfaat Nyata:</strong> Kecemasan turun 70%, mood lebih stabil, kreativitas meningkat, dan perasaan inner peace yang konsisten.
                  </p>
                </div>
              </div>

              {/* Transformation Journey */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">
                  Transformasi Nyata: Sebelum vs Sesudah
                </h2>
                <p className="mb-4 text-black dark:text-white font-bold">
                  Testimonial dari ribuan pengguna kami membuktikan transformasi luar biasa:
                </p>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                    <thead>
                      <tr className="bg-indigo-900 text-white">
                        <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">SEBELUM</th>
                        <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">SESUDAH</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-bold">
                      <tr className="bg-amber-50 dark:bg-amber-800/40">
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">❌ Stress dan cemas terus-menerus</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">✅ Tenang dan damai dalam segala situasi</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">❌ Sulit fokus dan mudah terdistraksi</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">✅ Fokus tajam dan produktivitas tinggi</td>
                      </tr>
                      <tr className="bg-amber-50 dark:bg-amber-800/40">
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">❌ Emosi tidak terkontrol</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">✅ Kecerdasan emosional tinggi</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">❌ Merasa stuck dan tidak berkembang</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">✅ Pertumbuhan konsisten dan terukur</td>
                      </tr>
                      <tr className="bg-amber-50 dark:bg-amber-800/40">
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">❌ Hubungan interpersonal buruk</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">✅ Relasi harmonis dengan semua orang</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">❌ Tidak punya arah hidup yang jelas</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">✅ Visi hidup yang crystal clear</td>
                      </tr>
                      <tr className="bg-amber-50 dark:bg-amber-800/40">
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">❌ Penghasilan stagnan</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">✅ Karir dan finansial meningkat pesat</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">❌ Kesehatan fisik menurun</td>
                        <td className="border border-gray-300 dark:border-gray-700 p-3 text-black dark:text-white">✅ Energi tinggi dan kesehatan optimal</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-center mb-4 p-4 bg-blue-50 dark:bg-blue-800/60 rounded-lg border border-blue-200 dark:border-blue-600">
                  <p className="italic text-blue-700 dark:text-blue-300">
                    "Dalam 3 bulan menggunakan eL Vision Group, saya mendapat promosi jabatan yang saya impikan 5 tahun! Bos saya bilang kinerja dan leadership saya meningkat drastis." - Sarah, Level 47
                  </p>
                </div>

                <div className="text-center p-4 bg-blue-50 dark:bg-blue-800/60 rounded-lg border border-blue-200 dark:border-blue-600">
                  <p className="italic text-blue-700 dark:text-blue-300">
                    "Pernikahan saya yang hampir bercerai kini harmonis kembali. Kemampuan saya mengelola emosi membuat komunikasi dengan pasangan jauh lebih baik." - Budi, Level 62
                  </p>
                </div>
              </div>

              {/* Leveling System */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">
                  Sistem Leveling & Komunitas Eksklusif
                </h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  Di eL Vision Group, konsistensi Anda dihargai dengan sistem leveling EXP yang unik:
                </p>
                <ul className="list-none space-y-2 mb-4 text-gray-700 dark:text-gray-300">
                  <li>📊 <strong>Streak Days</strong> - Tracking konsistensi harian Anda</li>
                  <li>⚡ <strong>Activity Points</strong> - Semakin aktif, semakin cepat naik level</li>
                  <li>🏆 <strong>Level & Rank</strong> - Badge kehormatan pencapaian Anda</li>
                  <li>📅 <strong>Years of Membership</strong> - Pengalaman berbicara</li>
                </ul>

                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-3">
                  Chat Ecosystem - Bertemu Dengan High Achievers
                </h3>
                <p className="mb-2 text-gray-700 dark:text-gray-300">
                  Salah satu benefit terbesar adalah akses ke komunitas eksklusif. User dengan level tinggi adalah individu-individu luar biasa yang telah mencapai kesuksesan nyata di kehidupan mereka. Mengapa?
                </p>
                <p className="mb-2 text-gray-700 dark:text-gray-300">
                  Karena kecerdasan emosional dan intelektual yang meningkat secara konsisten melalui platform kami langsung berdampak pada performa di dunia nyata - karir, bisnis, hubungan, kesehatan, dan kebahagiaan.
                </p>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-800/60 rounded-lg border border-blue-200 dark:border-blue-600">
                  <p className="font-bold text-blue-700 dark:text-blue-300">
                    Anda adalah rata-rata dari 5 orang terdekat Anda. Di sini, Anda akan dikelilingi oleh individu-individu yang growth-oriented dan supportive.
                  </p>
                </div>
              </div>

              {/* Education Blog */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">
                  Education Blog - Knowledge is Power
                </h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  Kami menyediakan konten edukatif berkualitas tinggi tentang berbagai aspek kehidupan:
                </p>
                <ul className="list-none space-y-2 mb-4 text-gray-700 dark:text-gray-300">
                  <li>🩸 <strong>Peredaran Darah & Kesehatan</strong> - Optimalisasi kesehatan fisik</li>
                  <li>💎 <strong>Kecantikan & Self-Care</strong> - Inner beauty reflects outer beauty</li>
                  <li>🥗 <strong>Diet & Nutrisi</strong> - Fuel your body right</li>
                  <li>💰 <strong>Finansial & Wealth</strong> - Money mindset dan strategi keuangan</li>
                  <li>✨ <strong>Gaya Hidup</strong> - Live your best life</li>
                  <li>❤️ <strong>Hubungan & Pasangan</strong> - Relationship mastery</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300">
                  Semua konten berbasis fakta, research, dan realita - bukan sekadar teori kosong.
                </p>
              </div>

              {/* Personal Analytics */}
              <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-800/60 dark:to-pink-800/60 rounded-lg border border-purple-200 dark:border-purple-600">
                <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">
                  ⭐ FITUR PREMIUM: Personal Analytics AI
                </h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  Ini adalah game-changer yang membedakan member PRO dari pengguna biasa:
                </p>

                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-3">
                  Apa itu Personal Analytics?
                </h3>
                <p className="mb-2 text-gray-700 dark:text-gray-300">
                  AI canggih bernama <strong>Renata</strong> yang secara otomatis menganalisis semua data Anda:
                </p>
                <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
                  <li>Elite Habit patterns Anda</li>
                  <li>Jurnal Spiritual entries Anda</li>
                  <li>Verses listening behavior Anda</li>
                  <li>Activity timeline Anda</li>
                </ul>

                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-3">
                  Apa yang Renata Lakukan?
                </h3>
                <p className="mb-2 text-gray-700 dark:text-gray-300">
                  Renata membaca algoritma unik Anda - pola perilaku, emosi, dan kebiasaan yang bahkan Anda sendiri tidak sadari. Kemudian, dengan izin Anda, Renata memberikan:
                </p>
                <ul className="list-none space-y-2 mb-4 text-gray-700 dark:text-gray-300">
                  <li>✅ <strong>Insight mendalam</strong> tentang blind spots Anda</li>
                  <li>✅ <strong>Solusi actionable</strong> yang spesifik untuk situasi Anda</li>
                  <li>✅ <strong>Prediksi pattern</strong> yang bisa menghambat progress Anda</li>
                  <li>✅ <strong>Rekomendasi strategi</strong> untuk mempercepat pencapaian tujuan</li>
                  <li>✅ <strong>Guidance yang personalized</strong> - bukan advice generic</li>
                </ul>

                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-3">
                  Kenapa Ini Powerful?
                </h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  Karena solusi yang diberikan adalah <strong>di luar nalar manusia biasa</strong>. AI dapat melihat korelasi dan pattern yang tidak terlihat oleh mata manusia. Ini seperti memiliki life coach, psychologist, dan strategist pribadi yang bekerja 24/7 untuk kesuksesan Anda.
                </p>

                <div className="text-center p-4 bg-yellow-100 dark:bg-yellow-700/70 rounded-lg border border-yellow-300 dark:border-yellow-600">
                  <p className="italic text-yellow-800 dark:text-yellow-300">
                    💡 Dengan Personal Analytics, hasil hidup Anda akan tercapai lebih cepat - kadang 5-10x lebih cepat dari yang Anda bayangkan!
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">
                  🚀 Saatnya Mengambil Keputusan Terbaik Hidup Anda
                </h2>
                <p className="mb-4 text-black dark:text-white font-bold">
                  Anda memiliki dua pilihan sekarang:
                </p>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 dark:border-gray-700 p-3 bg-gray-500 text-white text-left">OPSI 1: FREE USER</th>
                        <th className="border border-gray-300 dark:border-gray-700 p-3 bg-indigo-900 text-white text-left">OPSI 2: PRO MEMBER</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-bold">
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 p-4 bg-gray-100 dark:bg-gray-800 align-top">
                          <ul className="list-none space-y-2 text-black dark:text-white">
                            <li>• Akses terbatas</li>
                            <li>• Hanya basic features</li>
                            <li>• Tidak ada Personal Analytics</li>
                            <li>• Pertumbuhan lebih lambat</li>
                            <li>• Hasil unpredictable</li>
                          </ul>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 p-4 bg-blue-50 dark:bg-blue-800/60 align-top">
                          <ul className="list-none space-y-2 text-black dark:text-white">
                            <li>• Full access semua fitur</li>
                            <li>• Personal Analytics AI (Renata)</li>
                            <li>• Priority support</li>
                            <li>• Pertumbuhan accelerated</li>
                            <li>• Hasil terukur & tercapai lebih cepat</li>
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-3">
                  Pertanyaan yang Perlu Anda Tanyakan Pada Diri Sendiri:
                </h3>
                <ul className="list-none space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                  <li>🤔 Apakah saya serius ingin berubah?</li>
                  <li>🤔 Apakah saya ingin hasil yang maksimal atau sekadarnya?</li>
                  <li>🤔 Apakah saya willing to invest in myself?</li>
                  <li>🤔 Berapa nilai transformasi hidup saya?</li>
                </ul>

                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                  <p className="font-bold text-lg text-blue-700 dark:text-blue-300">
                    Investasi Terbaik adalah Investasi Pada Diri Sendiri
                  </p>
                </div>

                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  PRO membership bukan expense - ini adalah investasi dengan ROI (Return on Investment) tertinggi. Ketika kecerdasan emosional dan intelektual Anda meningkat, SEMUA area kehidupan Anda otomatis membaik - karir, finansial, hubungan, kesehatan, dan kebahagiaan.
                </p>

                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  Ribuan member PRO kami telah membuktikan - ROI yang mereka dapatkan jauh melebihi investasi mereka. Dari promosi jabatan, bisnis yang profitable, hingga kehidupan keluarga yang harmonis.
                </p>

                <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800/60 dark:to-pink-800/60 rounded-lg border border-purple-300 dark:border-purple-600">
                  <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">
                    ✨ Your Best Life Awaits
                  </h2>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    Selamat datang di eL Vision Group. Mari mulai perjalanan transformasi Anda hari ini. Versi terbaik dari diri Anda sedang menunggu untuk dimunculkan.
                  </p>
                  <p className="font-bold text-lg text-blue-700 dark:text-blue-300 mb-4">
                    Upgrade ke PRO sekarang dan rasakan perbedaannya!
                  </p>
                  <hr className="my-4 border-gray-300 dark:border-gray-700" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    © 2025 eL Vision Group - Transform. Elevate. Thrive.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
