"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, 
  Heart, 
  Shield, 
  Zap, 
  Users, 
  Star,
  QrCode, 
  MessageCircle, 
  Calculator, 
  Package, 
  HeartPulse,
  Play,
  Download,
  Globe
} from "lucide-react";

const FitFactorLP = () => {
  const searchParams = useSearchParams();
  const affiliateRef = searchParams.get('ref');
  const [quantity, setQuantity] = useState(3);
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');

  const content = {
    EN: {
      hero: {
        badge: "🩺 Trusted by Thousands of Families",
        title: "Restore Your Blood Flow: Natural Circulation Support",
        subtitle: "From clogged to smooth - Advanced herbal formula for chronic disease recovery and pain relief",
        cta: "View Products Now",
        how: "Learn How It Works",
        priceNote: "Starting from $50 SGD"
      },
      benefits: {
        title: "Why Choose FitFactorHerbal?",
        subtitle: "Trusted natural solution for blood circulation and health recovery",
        items: [
          { title: "Smooth Circulation", desc: "Improve blood flow to the entire body" },
          { title: "Immune Support", desc: "Support recovery from chronic illness" },
          { title: "Pain Relief", desc: "Relieve joint and muscle pain naturally" }
        ]
      },
      packages: [
        { name: "Basic Recovery", quantity: 3, price: 50, savings: 0, desc: "Starter therapy" },
        { name: "Intensive Recovery", quantity: 6, price: 90, savings: 10, desc: "2 months therapy + discount" },
        { name: "Comprehensive Recovery", quantity: 10, price: 140, savings: 25, desc: "3 months therapy + best discount" }
      ],
      cta: {
        title: "Start Your Recovery Journey Today",
        subtitle: "Join thousands who have felt the benefits of FitFactorHerbal",
        button: "Order Now",
        trust: "✅ Free Shipping | ✅ 30-Day Money Back | ✅ Free Consultation"
      }
    },
    ID: {
      hero: {
        badge: "🩺 Terpercaya Puluhan Ribu Keluarga",
        title: "Pulihkan Aliran Darah Anda: Dukungan Sirkulasi Alami",
        subtitle: "Dari tersumbat menjadi lancar - Formula herbal terdepan untuk pemulihan penyakit kronis dan nyeri",
        cta: "Lihat Produk Sekarang",
        how: "Pelajari Cara Kerja",
        priceNote: "Mulai dari Rp 600.000"
      },
      benefits: {
        title: "Mengapa Memilih FitFactorHerbal?",
        subtitle: "Solusi alami terpercaya untuk sirkulasi darah dan pemulihan kesehatan",
        items: [
          { title: "Sirkulasi Darah Lancar", desc: "Melancarkan peredaran darah ke seluruh tubuh" },
          { title: "Daya Tahan Tubuh", desc: "Mendukung proses pemulihan pasca Sakit Kronis" },
          { title: "Mengurangi Nyeri", desc: "Meredakan nyeri sendi dan otot secara alami" }
        ]
      },
      packages: [
        { name: "Paket Pemulihan Dasar", quantity: 3, price: 600000, savings: 0, desc: "Terapi awal" },
        { name: "Paket Pemulihan Intensif", quantity: 6, price: 1080000, savings: 120000, desc: "Terapi 2 bulan + diskon" },
        { name: "Paket Pemulihan Komprehensif", quantity: 10, price: 1700000, savings: 300000, desc: "Terapi 3 bulan + diskon besar" }
      ],
      cta: {
        title: "Mulai Perjalanan Pemulihan Anda Hari Ini",
        subtitle: "Bergabunglah dengan ribuan keluarga yang telah merasakan manfaat FitFactorHerbal",
        button: "Pesan Sekarang",
        trust: "✅ Gratis Ongkir | ✅ Garansi 30 Hari | ✅ Konsultasi Gratis"
      }
    }
  };

  const t = content[lang];
  const currentPackages = t.packages;
  const currency = lang === 'EN' ? 'SGD' : 'IDR';

  const scrollToCheckout = () => {
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePay = () => {
    const pkg = currentPackages.find(p => p.quantity === quantity) || currentPackages[0];
    const url = new URL("https://app.elvisiongroup.com/fitfactor");
    url.searchParams.set('amount', pkg.price.toString());
    url.searchParams.set('currency', currency);
    url.searchParams.set('quantity', pkg.quantity.toString());
    if (affiliateRef) {
      url.searchParams.set('ref', affiliateRef);
    }
    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-[50] flex gap-2">
        <button 
          onClick={() => setLang(lang === 'EN' ? 'ID' : 'EN')}
          className="bg-white/80 backdrop-blur-md border border-emerald-200 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold text-xs text-emerald-900 hover:bg-emerald-50 transition-all active:scale-95"
        >
          <Globe size={14} />
          {lang === 'EN' ? 'INDONESIA' : 'ENGLISH'}
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="container mx-auto px-4 text-center text-white">
          <Badge className="bg-orange-500 text-white mb-6 px-4 py-2 text-sm font-semibold">
            {t.hero.badge}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t.hero.title}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg px-8 py-6"
              onClick={scrollToCheckout}
            >
              {t.hero.cta}
              <ArrowRight className="ml-2" />
            </Button>
            
            <Button 
              size="lg"
              className="px-8 py-6 bg-gradient-to-r from-yellow-400 to-green-500 text-white hover:from-yellow-500 hover:to-green-600"
            >
              {t.hero.how}
            </Button>
          </div>
          
          <div className="text-2xl font-bold">
            <span className="text-orange-300">{t.hero.priceNote}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Benefits Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              {t.benefits.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.benefits.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {t.benefits.items.map((benefit, index) => {
              const Icon = [Heart, Shield, Zap][index];
              return (
                <Card key={index} className="text-center hover:scale-105 transition-all duration-300 border-2 border-emerald-100 shadow-lg bg-white">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Package Selection */}
        <section className="mb-16" id="checkout">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              {lang === 'EN' ? 'Health Recovery Packages' : 'Paket Pemulihan Kesehatan'}
            </h2>
            <p className="text-lg text-gray-600">
              {lang === 'EN' ? 'Choose the package that suits your recovery needs' : 'Pilih paket yang sesuai dengan kebutuhan pemulihan Anda'}
            </p>
          </div>

          <div className="grid gap-4 mb-8">
            {currentPackages.map((pkg, index) => (
              <Card key={index} className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 bg-white ${
                quantity === pkg.quantity ? 'border-emerald-500 shadow-lg' : 'border-emerald-100'
              }`} onClick={() => setQuantity(pkg.quantity)}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{pkg.name}</h3>
                      <p className="text-sm text-gray-600">{pkg.desc}</p>
                      <Badge className="mt-2 bg-emerald-500">{pkg.quantity} {lang === 'EN' ? 'bottles' : 'botol'}</Badge>
                    </div>
                    <div className="text-right">
                      {pkg.savings > 0 && (
                        <div className="text-sm text-orange-600 font-semibold">
                          {lang === 'EN' ? 'Save' : 'Hemat'} {lang === 'EN' ? '$' : 'Rp'} {pkg.savings.toLocaleString(lang === 'EN' ? 'en-US' : 'id-ID')}
                        </div>
                      )}
                      <div className="text-2xl font-bold text-emerald-600">
                        {lang === 'EN' ? '$' : 'Rp'} {pkg.price.toLocaleString(lang === 'EN' ? 'en-US' : 'id-ID')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <Card className="border-2 border-emerald-200 shadow-lg bg-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                {t.cta.title}
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                {t.cta.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg px-8 py-6"
                  onClick={handlePay}
                >
                  <Users className="mr-2" />
                  {t.cta.button} - {lang === 'EN' ? '$' : 'Rp'} {(currentPackages.find(p => p.quantity === quantity)?.price || currentPackages[0].price).toLocaleString(lang === 'EN' ? 'en-US' : 'id-ID')}
                </Button>
              </div>
              
              <p className="text-sm text-gray-600">
                {t.cta.trust}
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default FitFactorLP;
