import { Card } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Arif - Pro User",
    text: "Berkali kali Lipat rezeki berdatangan setelah rutin mendengarkan Verse of eL Vision secara rutin. pertolongan dari Allah. Luar Biasa !",
    rating: 5,
    type: "video",
    videoIndex: 0
  },
  {
    name: "Hadi - Pro User",
    text: "eL Vision Group bukan sekadar aplikasi - ini adalah teknologi spiritual yang mengubah kebiasaan digital menjadi kehidupan yang tercerahkan. Benar-benar mengubah cara manusia berhubungan dengan teknologi dan pertumbuhan batin.",
    rating: 5,
    type: "text"
  },
  {
    name: "Kiki",
    text: "Pengalaman luar biasa dengan eL Vision Group. Transformasi spiritual yang nyata dan profound.",
    rating: 5,
    type: "video",
    videoIndex: 0 // kikireact.mp4
  },
  {
    name: "Seno",
    text: "Merasakan perubahan frekuensi yang sangat jelas. Aplikasi ini benar-benar mengubah hidup saya.",
    rating: 5,
    type: "video",
    videoIndex: 1 // senoreact.mp4
  },
  {
    name: "Dr. Gumilar S.Pd., M.M., CH, CHt, pNNLP",
    text: "Sebagai doktor, saya skeptis awalnya. Tapi hasil yang saya rasakan tidak bisa dibantah.",
    rating: 5,
    type: "video",
    videoIndex: 2 // DRVIDEO_WA.mp4
  },
  {
    name: "Fel",
    text: "Spiritual technology yang benar-benar bekerja. Meditasi dan frequency healing sangat efektif.",
    rating: 5,
    type: "video",
    videoIndex: 3 // FELVIDEO_WA.mp4
  },
  {
    name: "Lena",
    text: "Mantap Pol cukup ikutin yang mudah rezeki malah datang sendiri guys",
    rating: 5,
    type: "video",
    videoIndex: 6 // LENA_WA.mp4 (index 6 in mediaFiles array)
  },
  {
    name: "Agus Mulyadi S.H., M.H.",
    text: "Menggunakan eL vision Group sejak 2018 hingga hari ini, selalu menjadi pemandu hidup yang lebih kaya akan makna dan memudahkan.",
    rating: 5,
    type: "video",
    videoIndex: 7 // Will need to find the correct index
  },
  {
    name: "Umi",
    text: "Transformasi luar biasa sejak bergabung dengan eL Vision Group. Hidup menjadi lebih bermakna dan terarah.",
    rating: 5,
    type: "video",
    videoIndex: 8 // UMIVIDEO_WA.mp4
  },
  {
    name: "Vio",
    text: "Sebelumnya sering overthinking untuk sesuatu yang gak perlu, sangat merugikan secara finansial dan mental, ikut eL Vision Group semua jadi lebih ringan dan relax menghadapi hidup",
    rating: 5,
    type: "video",
    videoIndex: 7 // VIOVIDEO_WA.mp4
  },
  {
    name: "Habib",
    text: "Alhamdulillah begini cara bersyukur saat tubuh lebih segar menerima hidup, rezeki jadi berdatangan, coba sendiri wahai umat",
    rating: 5,
    type: "video",
    videoIndex: 4 // HABIBVIDEO_WA.mp4 (index 4 in mediaFiles array)
  },
  {
    name: "Putri - Tier Ignis 🔥",
    text: "15 tahun mencari, akhirnya menemukan solusi di eL Vision Group. Gratitude!",
    rating: 5,
    type: "text"
  }
];

interface TestimonialsProps {
  onVideoClick: (videoIndex: number, videoUrl: string, videoTitle: string) => void;
}

// Map testimonial names to their video URLs
const videoMap: Record<string, { url: string; title: string }> = {
  "Arif - Pro User": {
    url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/arif.mp4",
    title: "Pengalaman Arif"
  },
  "Kiki": {
    url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/kikireact.mp4",
    title: "Pengalaman Kiki"
  },
  "Seno": {
    url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/senoreact.mp4",
    title: "Pengalaman Seno"
  },
  "Dr. Gumilar S.Pd., M.M., CH, CHt, pNNLP": {
    url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/DRVIDEO_WA.mp4",
    title: "Pengalaman Dr. Gumilar"
  },
  "Fel": {
    url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/FELVIDEO_WA.mp4",
    title: "Pengalaman Fel"
  },
  "Lena": {
    url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/LENA_WA.mp4",
    title: "Pengalaman Lena"
  },
  "Agus Mulyadi S.H., M.H.": {
    url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/AGUS_WA.mp4",
    title: "Pengalaman Agus Mulyadi"
  },
  "Umi": {
    url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/UMIVIDEO_WA.mp4",
    title: "Pengalaman Umi"
  },
  "Vio": {
    url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/VIOVIDEO_WA.mp4",
    title: "Pengalaman Vio"
  },
  "Habib": {
    url: "https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/testi/HABIBVIDEO_WA.mp4",
    title: "Pengalaman Habib"
  }
};

export function Testimonials({ onVideoClick }: TestimonialsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold font-exo text-center">
        Testimonials
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className={`p-4 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 ${testimonial.type === "video" ? "cursor-pointer" : ""}`}
            onClick={() => {
              if (testimonial.type === "video" && videoMap[testimonial.name]) {
                const video = videoMap[testimonial.name];
                onVideoClick(testimonial.videoIndex || 0, video.url, video.title);
              }
            }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500">
                <Quote className="w-4 h-4 text-white" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground italic">
                  "{testimonial.text}"
                </p>

                {testimonial.type === "video" && (
                  <div className="flex items-center gap-1 mt-2 hover:text-red-400 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-xs text-red-500 font-medium">Video Testimoni - Klik untuk menonton</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Lebih dari 1000+ anggota telah merasakan transformasi dengan eL Vision Group
        </p>
      </div>
    </div>
  );
}