'use client';

import type { ChangeEvent} from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserCircle, Upload, Trash2 } from 'lucide-react';

interface PhotoUploadProps {
  value?: string; // data URI
  onChange: (value?: string) => void;
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPreview(dataUri);
        onChange(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(undefined);
    onChange(undefined);
  };

  return (
    <div className="space-y-2">
      <div className="w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center ring-2 ring-primary/50 mx-auto">
        {preview ? (
          <Image src={preview} alt="Profile Preview" width={128} height={128} className="object-cover w-full h-full" data-ai-hint="professional portrait" />
        ) : (
          <UserCircle size={64} className="text-muted-foreground" />
        )}
      </div>
      <div className="flex gap-2 justify-center">
        <Button type="button" variant="outline" size="sm" asChild>
          <label htmlFor="photo-upload-input" className="cursor-pointer">
            <Upload className="mr-2 h-4 w-4" /> Upload
          </label>
        </Button>
        <Input
          id="photo-upload-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {preview && (
          <Button type="button" variant="destructive" size="sm" onClick={handleRemovePhoto}>
            <Trash2 className="mr-2 h-4 w-4" /> Remove
          </Button>
        )}
      </div>
    </div>
  );
}
