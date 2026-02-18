import { Card } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Arif - Pro User",
    text: "Defying the Odds: How I Used the Mind Method to Overcome Brain Cancer",
    rating: 5,
    type: "video",
    videoIndex: 0
  },
  {
    name: "eL Vision - Health",
    text: "The Science of Healing: How eL Vision Realigned My Mind and Body",
    rating: 5,
    type: "video",
    videoIndex: 1
  },
  {
    name: "The Children",
    text: "Building a Foundation of Joy: Teaching My Children the Power of Gratitude",
    rating: 5,
    type: "video",
    videoIndex: 2
  },
  {
    name: "Felicia",
    text: "Finding My Stillness: My Journey from Constant Anxiety to Lasting Peace",
    rating: 5,
    type: "video",
    videoIndex: 3
  },
  {
    name: "Habib Umar Assegaf",
    text: "Spiritual Elevation: A Testimony of Faith and Mental Clarity",
    rating: 5,
    type: "video",
    videoIndex: 4
  },
  {
    name: "Pak AGUS SH., MH.",
    text: "Professional Excellence & Inner Balance: A High-Achiever’s Perspective",
    rating: 5,
    type: "video",
    videoIndex: 5
  },
  {
    name: "Dr. Gumilar",
    text: "A Medical Endorsement: Why Mindset is the Ultimate Key to Recovery",
    rating: 5,
    type: "video",
    videoIndex: 6
  },
  {
    name: "eL Vision - Magnet",
    text: "The Root of the Solution: How I Stopped Managing Problems and Started Solving Them",
    rating: 5,
    type: "video",
    videoIndex: 7
  },
  {
    name: "Lena",
    text: "Manifesting Abundance: Moving from Scarcity to Being Chased by Prosperity",
    rating: 5,
    type: "video",
    videoIndex: 8
  },
  {
    name: "Gen Z",
    text: "The Ultimate Mental Edge: Why This is the Modern Life Hack We’ve Been Searching For",
    rating: 5,
    type: "video",
    videoIndex: 9
  },
  {
    name: "Hadi - Pro User",
    text: "eL Vision Group bukan sekadar aplikasi - ini adalah teknologi spiritual yang mengubah kebiasaan digital menjadi kehidupan yang tercerahkan. Benar-benar mengubah cara manusia berhubungan dengan teknologi dan pertumbuhan batin.",
    rating: 5,
    type: "text"
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
  mediaAudit: { handleOpenOrPlay: (params: any) => void; } | null;
  user: any;
}

// Map testimonial names to their video URLs
const videoMap: Record<string, { url: string; title: string }> = {
  "Arif - Pro User": {
    url: "https://www.youtube.com/embed/9L28-k3FAig",
    title: "Defying the Odds: How I Used the Mind Method to Overcome Brain Cancer"
  },
  "eL Vision - Health": {
    url: "https://www.youtube.com/embed/-xsxQ6cUP7M",
    title: "The Science of Healing: How eL Vision Realigned My Mind and Body"
  },
  "The Children": {
    url: "https://www.youtube.com/embed/1ZNFxjPdFr8",
    title: "Building a Foundation of Joy: Teaching My Children the Power of Gratitude"
  },
  "Felicia": {
    url: "https://www.youtube.com/embed/Rs_UDalr8q8",
    title: "Finding My Stillness: My Journey from Constant Anxiety to Lasting Peace"
  },
  "Habib Umar Assegaf": {
    url: "https://www.youtube.com/embed/jD6XlkCL4sI",
    title: "Spiritual Elevation: A Testimony of Faith and Mental Clarity"
  },
  "Pak AGUS SH., MH.": {
    url: "https://www.youtube.com/embed/kVgfxHX_GeY",
    title: "Professional Excellence & Inner Balance: A High-Achiever’s Perspective"
  },
  "Dr. Gumilar": {
    url: "https://www.youtube.com/embed/U6NsL9RL9rY",
    title: "A Medical Endorsement: Why Mindset is the Ultimate Key to Recovery"
  },
  "eL Vision - Magnet": {
    url: "https://www.youtube.com/embed/cPwGC0NW8s4",
    title: "The Root of the Solution: How I Stopped Managing Problems and Started Solving Them"
  },
  "Lena": {
    url: "https://www.youtube.com/embed/-9u7v6vT5ds",
    title: "Manifesting Abundance: Moving from Scarcity to Being Chased by Prosperity"
  },
  "Gen Z": {
    url: "https://www.youtube.com/embed/wQv7mHlE-5o",
    title: "The Ultimate Mental Edge: Why This is the Modern Life Hack We’ve Been Searching For"
  }
};

export function Testimonials({ onVideoClick, mediaAudit, user }: TestimonialsProps) {
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
              if (testimonial.type === "video") {
                const video = videoMap[testimonial.name];
                
                if (video) {
                  if (mediaAudit && user) {
                    mediaAudit.handleOpenOrPlay({
                      object_name: video.title,
                      user_email: user.email
                    });
                  }
                  onVideoClick(testimonial.videoIndex || 0, video.url, video.title);
                }
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
