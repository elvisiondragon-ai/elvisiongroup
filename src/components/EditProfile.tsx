import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save, X, User, Phone } from "lucide-react";

interface EditProfileProps {
  user: any;
  userProfile: any;
  onSave: () => void;
  onCancel: () => void;
}

export function EditProfile({ user, userProfile, onSave, onCancel }: EditProfileProps) {
  const [displayName, setDisplayName] = useState(userProfile?.display_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phone_number || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      setAvatarUrl(data.publicUrl);
      
      toast({
        title: "Success",
        description: "Profile picture uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      console.log('🔄 Starting save...');
      setSaving(true);

      // Validate phone number format before saving
      if (phoneNumber && !/^08[0-9]{8,13}$/.test(phoneNumber)) {
        console.log('❌ Phone validation failed');
        toast({
          title: "Error",
          description: "Phone number must start with 08 and be 10-15 digits total (08xxxxxxxxxx)",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      console.log('✅ Phone validation passed');

      // Skip auth update, just update profile
      console.log('🔄 Updating profile...');
      
      // Update or insert profile data
      const profileData = {
        user_id: user?.id,
        display_name: displayName,
        avatar_url: avatarUrl,
        user_email: email,
        phone_number: phoneNumber,
        updated_at: new Date().toISOString()
      };

      console.log('📝 Profile data:', profileData);

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, {
          onConflict: 'user_id'
        });

      if (profileError) {
        console.error('❌ Profile error:', profileError);
        throw profileError;
      }

      console.log('✅ Profile updated successfully');

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      onSave();
    } catch (error: any) {
      console.error('💥 Save error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      console.log('🏁 Save completed, setting saving to false');
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-orbitron text-foreground">
          Edit Profil
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Profile Picture Section */}
      <Card className="p-6 bg-gradient-secondary border-border">
        <div className="text-center space-y-4">
          <Avatar className="w-24 h-24 mx-auto border-2 border-primary glow-primary">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-orbitron">
              {displayName.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <Button
                variant="outline"
                disabled={uploading}
                className="border-border hover:border-primary"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Change Picture'}
                </span>
              </Button>
            </Label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </div>
      </Card>

      {/* Form Fields */}
      <Card className="p-6 bg-gradient-secondary border-border space-y-4">
        <div className="space-y-2">
          <Label htmlFor="display-name" className="text-foreground">
            Display Name
          </Label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(e) => {
              // Sanitize input to prevent XSS
              const sanitized = e.target.value.replace(/<[^>]*>?/gm, '').substring(0, 50);
              setDisplayName(sanitized);
            }}
            placeholder="Enter your display name"
            className="bg-background border-border focus:border-primary"
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              // Basic email validation and sanitization
              const sanitized = e.target.value.replace(/[<>]/g, '').toLowerCase();
              setEmail(sanitized);
            }}
            placeholder="Enter your email address"
            className="bg-background border-border focus:border-primary"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone-number" className="text-foreground">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone-number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                // Phone number validation and sanitization - must start with 08
                let sanitized = e.target.value.replace(/[^0-9]/g, '');
                // Ensure it starts with 08
                if (sanitized.length > 0 && !sanitized.startsWith('08')) {
                  sanitized = '08' + sanitized.replace(/^0+/, '');
                }
                // Limit to 15 characters max (08 + 13 digits)
                if (sanitized.length > 15) {
                  sanitized = sanitized.substring(0, 15);
                }
                setPhoneNumber(sanitized);
              }}
              placeholder="08123456789"
              className="pl-10 bg-background border-border focus:border-primary"
              maxLength={15}
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground glow-primary transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>

        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-border hover:border-primary transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}