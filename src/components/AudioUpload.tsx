import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Music } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AudioUploadProps {
  onUploadComplete?: (audioTrack: any) => void;
}

export function AudioUpload({ onUploadComplete }: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check if it's an audio file
      if (!selectedFile.type.startsWith('audio/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an MP3 or other audio file",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, "")); // Remove extension
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a file and enter a title",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to upload audio files",
          variant: "destructive",
        });
        return;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(fileName);

      // Save track info to database
      const { data: trackData, error: trackError } = await supabase
        .from('audio_tracks')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          file_path: fileName,
          file_url: publicUrl,
          category: 'verse',
          created_by: user.id,
          is_public: true,
        })
        .select()
        .single();

      if (trackError) {
        throw trackError;
      }

      toast({
        title: "Upload successful!",
        description: `"${title}" has been uploaded successfully`,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('audio-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete(trackData);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-secondary border-border">
      <div className="space-y-4">
        <div className="text-center">
          <Music className="h-8 w-8 mx-auto text-primary mb-2" />
          <h3 className="text-lg font-semibold font-orbitron text-foreground">
            Upload Audio Track
          </h3>
          <p className="text-sm text-muted-foreground">
            Add your MP3 files for Verse of Secret Decree
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="audio-upload">Audio File (MP3, WAV, etc.)</Label>
            <Input
              id="audio-upload"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="mt-1"
            />
            {file && (
              <p className="text-xs text-muted-foreground mt-1">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter track title"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="mt-1"
              rows={3}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploading || !file || !title.trim()}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Audio
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}