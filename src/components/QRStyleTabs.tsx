import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { QRType } from './QRTypeSelector';
import { FileUploadInput } from './FileUploadInput';
import { ThemePresets, themePresets, ThemePreset } from './ThemePresets';
import { BodyShapeSelector, BodyShape } from './BodyShapeSelector';
import { ColorPicker } from './ColorPicker';
import { SizeSelector } from './SizeSelector';

export type FrameStyle = 'square' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-left' | 'rounded-right' | 'pill-h' | 'pill-v' | 'circle';

interface QRStyleTabsProps {
  qrType: QRType;
  value: string;
  onValueChange: (value: string) => void;
  wifiSSID: string;
  onWifiSSIDChange: (ssid: string) => void;
  wifiPassword: string;
  onWifiPasswordChange: (password: string) => void;
  wifiEncryption: 'WPA' | 'WEP' | 'nopass';
  onWifiEncryptionChange: (encryption: 'WPA' | 'WEP' | 'nopass') => void;
  emailAddress: string;
  onEmailAddressChange: (email: string) => void;
  emailSubject: string;
  onEmailSubjectChange: (subject: string) => void;
  emailBody: string;
  onEmailBodyChange: (body: string) => void;
  smsPhone: string;
  onSmsPhoneChange: (phone: string) => void;
  smsMessage: string;
  onSmsMessageChange: (message: string) => void;
  frameStyle: FrameStyle;
  onFrameStyleChange: (style: FrameStyle) => void;
  fgColor: string;
  onFgColorChange: (color: string) => void;
  bgColor: string;
  onBgColorChange: (color: string) => void;
  bgGradient?: string | null;
  onBgGradientChange?: (gradient: string | null) => void;
  logo: string | null;
  onLogoChange: (logo: string | null) => void;
  bodyShape?: BodyShape;
  onBodyShapeChange?: (shape: BodyShape) => void;
  qrSize?: number;
  onQrSizeChange?: (size: number) => void;
}

const frameStyles: { id: FrameStyle; preview: string }[] = [
  { id: 'square', preview: 'rounded-none' },
  { id: 'rounded-sm', preview: 'rounded-sm' },
  { id: 'rounded-md', preview: 'rounded-md' },
  { id: 'rounded-lg', preview: 'rounded-lg' },
  { id: 'rounded-left', preview: 'rounded-l-lg rounded-r-none' },
  { id: 'rounded-right', preview: 'rounded-r-lg rounded-l-none' },
  { id: 'pill-h', preview: 'rounded-full' },
  { id: 'pill-v', preview: 'rounded-full' },
  { id: 'circle', preview: 'rounded-full' },
];

export function QRStyleTabs({
  qrType,
  value,
  onValueChange,
  wifiSSID,
  onWifiSSIDChange,
  wifiPassword,
  onWifiPasswordChange,
  wifiEncryption,
  onWifiEncryptionChange,
  emailAddress,
  onEmailAddressChange,
  emailSubject,
  onEmailSubjectChange,
  emailBody,
  onEmailBodyChange,
  smsPhone,
  onSmsPhoneChange,
  smsMessage,
  onSmsMessageChange,
  frameStyle,
  onFrameStyleChange,
  fgColor,
  onFgColorChange,
  bgColor,
  onBgColorChange,
  bgGradient,
  onBgGradientChange,
  logo,
  onLogoChange,
  bodyShape,
  onBodyShapeChange,
  qrSize,
  onQrSizeChange,
}: QRStyleTabsProps) {
  const [selectedTheme, setSelectedTheme] = useState('paper');

  const handleThemeChange = (theme: ThemePreset) => {
    setSelectedTheme(theme.id);
    onFgColorChange(theme.fgColor);
    onBgColorChange(theme.bgColor);
    onBgGradientChange?.(theme.bgGradient || null);
  };

  const clearThemeSelection = () => {
    setSelectedTheme('');
  };

  const handleManualFgColorChange = (color: string) => {
    clearThemeSelection();
    onFgColorChange(color);
  };

  const handleManualBgColorChange = (color: string) => {
    clearThemeSelection();
    onBgColorChange(color);
    onBgGradientChange?.(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onLogoChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const inputClassName = "h-12 rounded-xl bg-background border-border input-field";
  const textareaClassName = "w-full p-3 rounded-xl bg-background border border-border resize-none focus:outline-none focus:ring-2 focus:ring-ring input-field";

  const renderInputFields = () => {
    switch (qrType) {
      case 'url':
        return (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Enter your link here</Label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              className={inputClassName}
            />
            <p className="text-sm text-muted-foreground">Your QR code will generate automatically</p>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Enter your text</Label>
            <textarea
              placeholder="Enter any text content..."
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              className={cn(textareaClassName, "h-24")}
            />
          </div>
        );
      case 'wifi':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Network Name (SSID)</Label>
              <Input
                type="text"
                placeholder="My WiFi Network"
                value={wifiSSID}
                onChange={(e) => onWifiSSIDChange(e.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Password</Label>
              <Input
                type="password"
                placeholder="WiFi password"
                value={wifiPassword}
                onChange={(e) => onWifiPasswordChange(e.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Encryption</Label>
              <div className="flex gap-2">
                {(['WPA', 'WEP', 'nopass'] as const).map((enc) => (
                  <button
                    key={enc}
                    onClick={() => onWifiEncryptionChange(enc)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      wifiEncryption === enc
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    )}
                  >
                    {enc === 'nopass' ? 'None' : enc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Email Address</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={emailAddress}
                onChange={(e) => onEmailAddressChange(e.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Subject (optional)</Label>
              <Input
                type="text"
                placeholder="Email subject"
                value={emailSubject}
                onChange={(e) => onEmailSubjectChange(e.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Body (optional)</Label>
              <textarea
                placeholder="Email body..."
                value={emailBody}
                onChange={(e) => onEmailBodyChange(e.target.value)}
                className={cn(textareaClassName, "h-20")}
              />
            </div>
          </div>
        );
      case 'sms':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Phone Number</Label>
              <Input
                type="tel"
                placeholder="+1234567890"
                value={smsPhone}
                onChange={(e) => onSmsPhoneChange(e.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Message (optional)</Label>
              <textarea
                placeholder="Your message..."
                value={smsMessage}
                onChange={(e) => onSmsMessageChange(e.target.value)}
                className={cn(textareaClassName, "h-20")}
              />
            </div>
          </div>
        );
      case 'image':
        return (
          <FileUploadInput
            type="image"
            value={value}
            onValueChange={onValueChange}
          />
        );
      case 'pdf':
        return (
          <FileUploadInput
            type="pdf"
            value={value}
            onValueChange={onValueChange}
          />
        );
      case 'mp3':
        return (
          <FileUploadInput
            type="mp3"
            value={value}
            onValueChange={onValueChange}
          />
        );
      case 'app':
        return (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">App Store or Play Store URL</Label>
            <Input
              type="url"
              placeholder="https://apps.apple.com/... or https://play.google.com/..."
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              className={inputClassName}
            />
            <p className="text-sm text-muted-foreground">Link to your app on App Store or Google Play</p>
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Enter content</Label>
            <Input
              type="text"
              placeholder="Enter content..."
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              className={inputClassName}
            />
            <p className="text-sm text-muted-foreground">Your QR code will generate automatically</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">

      {/* Style Section */}
      <div className="space-y-6">
        <h2 className="text-[20px] font-medium text-[#171717] leading-[120%]">Style your QR</h2>
        
        {/* Theme Presets */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Theme</p>
          <ThemePresets
            selectedTheme={selectedTheme}
            onThemeChange={handleThemeChange}
          />
        </div>

        {/* Body Shape */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Pattern</p>
          <BodyShapeSelector
            selectedShape={bodyShape || 'square'}
            onShapeChange={(shape) => onBodyShapeChange?.(shape)}
          />
        </div>

        {/* Color Picker */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Colors</p>
          <ColorPicker
            fgColor={fgColor}
            bgColor={bgColor}
            onFgColorChange={handleManualFgColorChange}
            onBgColorChange={handleManualBgColorChange}
            onBgGradientClear={() => {
              clearThemeSelection();
              onBgGradientChange?.(null);
            }}
          />
        </div>

        {/* Size Selector */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Download Size</p>
          <SizeSelector
            value={qrSize || 500}
            onChange={(size) => onQrSizeChange?.(size)}
          />
        </div>
      </div>
    </div>
  );
}
