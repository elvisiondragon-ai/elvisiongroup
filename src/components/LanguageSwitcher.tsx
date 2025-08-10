import { useState, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [userLocation, setUserLocation] = useState<string | null>(null);

  // Detect user location for smart language switching
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try geolocation API first
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                // Use a geolocation service to get country
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                );
                const data = await response.json();
                setUserLocation(data.countryCode);
                
                // Auto-switch to Indonesian if user is in Indonesia and no language preference is set
                if (data.countryCode === 'ID' && !localStorage.getItem('preferred_language')) {
                  i18n.changeLanguage('id');
                }
              } catch (error) {
                console.error('Failed to get location from coordinates:', error);
              }
            },
            (error) => {
              console.error('Geolocation error:', error);
              // Fallback to browser language detection
              fallbackLanguageDetection();
            }
          );
        } else {
          fallbackLanguageDetection();
        }
      } catch (error) {
        console.error('Location detection failed:', error);
        fallbackLanguageDetection();
      }
    };

    const fallbackLanguageDetection = () => {
      // Use browser language as fallback
      const browserLang = navigator.language || navigator.languages[0];
      if (browserLang.startsWith('id') && !localStorage.getItem('preferred_language')) {
        i18n.changeLanguage('id');
      }
    };

    detectLocation();
  }, [i18n]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('preferred_language', lang);
  };

  const getCurrentLanguageLabel = () => {
    switch (i18n.language) {
      case 'id':
        return t('language.indonesian');
      case 'en':
        return t('language.english');
      default:
        return t('language.auto');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{getCurrentLanguageLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => changeLanguage('en')}
          className="flex items-center justify-between"
        >
          <span>{t('language.english')}</span>
          {i18n.language === 'en' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage('id')}
          className="flex items-center justify-between"
        >
          <span>{t('language.indonesian')}</span>
          {i18n.language === 'id' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;