import { useState, useMemo } from 'react';
import { QRPreview } from '@/components/QRPreview';
import { QRTypeSelector, QRType } from '@/components/QRTypeSelector';
import { QRStyleTabs, FrameStyle } from '@/components/QRStyleTabs';
import { BodyShape } from '@/components/BodyShapeSelector';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Import QR type icons
import urlIcon from '@/assets/qr-type-url.webp';
import textIcon from '@/assets/qr-type-text.webp';
import wifiIcon from '@/assets/qr-type-wifi.webp';
import emailIcon from '@/assets/qr-type-email.webp';
import smsIcon from '@/assets/qr-type-sms.webp';
import imageIcon from '@/assets/qr-type-image.webp';
import pdfIcon from '@/assets/qr-type-pdf.webp';
import mp3Icon from '@/assets/qr-type-mp3.webp';
import appIcon from '@/assets/qr-type-app.webp';

const qrTypeOptions: { id: QRType; label: string; image: string }[] = [
  { id: 'url', label: 'URL', image: urlIcon },
  { id: 'text', label: 'Text', image: textIcon },
  { id: 'wifi', label: 'Wi-Fi', image: wifiIcon },
  { id: 'email', label: 'E-mail', image: emailIcon },
  { id: 'sms', label: 'SMS', image: smsIcon },
  { id: 'image', label: 'Image', image: imageIcon },
  { id: 'pdf', label: 'PDF', image: pdfIcon },
  { id: 'mp3', label: 'MP3', image: mp3Icon },
  { id: 'app', label: 'App', image: appIcon },
];

const Index = () => {
  // QR Type
  const [qrType, setQrType] = useState<QRType>('url');
  
  // Separate values for each type
  const [urlValue, setUrlValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [imageValue, setImageValue] = useState('');
  const [pdfValue, setPdfValue] = useState('');
  const [mp3Value, setMp3Value] = useState('');
  const [appValue, setAppValue] = useState('');
  
  // WiFi specific
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  
  // Email specific
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  // SMS specific
  const [smsPhone, setSmsPhone] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  
  // Styling
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('rounded-md');
  const [fgColor, setFgColor] = useState('#3d3225');
  const [bgColor, setBgColor] = useState('#faf6f0');
  const [bgGradient, setBgGradient] = useState<string | null>('linear-gradient(135deg, #faf6f0 0%, #f5ede3 50%, #ebe4d8 100%)');
  const [logo, setLogo] = useState<string | null>(null);
  const [bodyShape, setBodyShape] = useState<BodyShape>('square');
  const [qrSize, setQrSize] = useState(500);

  // Get current value based on type
  const currentValue = useMemo(() => {
    switch (qrType) {
      case 'url': return urlValue;
      case 'text': return textValue;
      case 'image': return imageValue;
      case 'pdf': return pdfValue;
      case 'mp3': return mp3Value;
      case 'app': return appValue;
      default: return '';
    }
  }, [qrType, urlValue, textValue, imageValue, pdfValue, mp3Value, appValue]);

  // Set value based on current type
  const setCurrentValue = (newValue: string) => {
    switch (qrType) {
      case 'url': setUrlValue(newValue); break;
      case 'text': setTextValue(newValue); break;
      case 'image': setImageValue(newValue); break;
      case 'pdf': setPdfValue(newValue); break;
      case 'mp3': setMp3Value(newValue); break;
      case 'app': setAppValue(newValue); break;
    }
  };

  // Generate QR value based on type
  const qrValue = useMemo(() => {
    switch (qrType) {
      case 'url': return urlValue;
      case 'text': return textValue;
      case 'image': return imageValue;
      case 'pdf': return pdfValue;
      case 'mp3': return mp3Value;
      case 'app': return appValue;
      case 'wifi':
        if (!wifiSSID) return '';
        return `WIFI:T:${wifiEncryption};S:${wifiSSID};P:${wifiPassword};;`;
      case 'email':
        if (!emailAddress) return '';
        let emailStr = `mailto:${emailAddress}`;
        const params: string[] = [];
        if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`);
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`);
        if (params.length > 0) emailStr += `?${params.join('&')}`;
        return emailStr;
      case 'sms':
        if (!smsPhone) return '';
        let smsStr = `sms:${smsPhone}`;
        if (smsMessage) smsStr += `?body=${encodeURIComponent(smsMessage)}`;
        return smsStr;
      default:
        return '';
    }
  }, [qrType, urlValue, textValue, imageValue, pdfValue, mp3Value, appValue, wifiSSID, wifiPassword, wifiEncryption, emailAddress, emailSubject, emailBody, smsPhone, smsMessage]);

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full max-w-full">
      {/* Left Sidebar - QR Type Selector */}
      <aside className="w-72 bg-background pt-8 pl-4 pr-2 hidden lg:block flex-shrink-0">
        <ScrollArea className="h-[calc(100vh-2rem)] pr-2">
          <QRTypeSelector
            selectedType={qrType}
            onTypeChange={setQrType}
          />
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Mobile QR Type Selector - Dropdown */}
        <div className="lg:hidden p-4 border-b border-border bg-background w-full max-w-full overflow-hidden">
          <h2 className="text-[20px] font-medium text-[#171717] leading-[120%] mb-3">Select QR type</h2>
          <Select value={qrType} onValueChange={(value) => setQrType(value as QRType)}>
            <SelectTrigger className="w-full h-14 rounded-xl bg-background border-border focus:ring-0 focus:ring-offset-0 focus:outline-none focus:border-[#D4D4D4]">
              <SelectValue>
                {(() => {
                  const selected = qrTypeOptions.find(opt => opt.id === qrType);
                  return selected ? (
                    <div className="flex items-center gap-3">
                      <img 
                        src={selected.image} 
                        alt={selected.label} 
                        className="w-10 h-7 rounded object-cover"
                      />
                      <span className="font-medium">{selected.label}</span>
                    </div>
                  ) : 'Select type';
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {qrTypeOptions.map((type) => (
                <SelectItem key={type.id} value={type.id} className="h-14 py-2">
                  <div className="flex items-center gap-3">
                    <img 
                      src={type.image} 
                      alt={type.label} 
                      className="w-10 h-7 rounded object-cover"
                    />
                    <span className="font-medium">{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Center - QR Preview */}
        <main className="flex-1 flex flex-col items-center pt-4 lg:pt-2 px-4 sm:px-6 pb-8 min-w-0 max-w-full overflow-hidden">
          <div className="w-full max-w-md bg-card rounded-3xl p-4 sm:p-6 border border-border" style={{ boxShadow: '0 14px 8px 0 rgba(64, 64, 64, 0.04), 0 6px 6px 0 rgba(64, 64, 64, 0.07), 0 2px 3px 0 rgba(64, 64, 64, 0.08)' }}>
            <h2 className="text-[20px] font-medium text-[#171717] leading-[120%] mb-4">Live preview</h2>
            <QRPreview
              qrType={qrType}
              value={currentValue}
              onValueChange={setCurrentValue}
              wifiSSID={wifiSSID}
              onWifiSSIDChange={setWifiSSID}
              wifiPassword={wifiPassword}
              onWifiPasswordChange={setWifiPassword}
              wifiEncryption={wifiEncryption}
              onWifiEncryptionChange={setWifiEncryption}
              emailAddress={emailAddress}
              onEmailAddressChange={setEmailAddress}
              emailSubject={emailSubject}
              onEmailSubjectChange={setEmailSubject}
              emailBody={emailBody}
              onEmailBodyChange={setEmailBody}
              smsPhone={smsPhone}
              onSmsPhoneChange={setSmsPhone}
              smsMessage={smsMessage}
              onSmsMessageChange={setSmsMessage}
              qrValue={qrValue}
              fgColor={fgColor}
              bgColor={bgColor}
              bgGradient={bgGradient}
              frameStyle={frameStyle}
              logo={logo}
              bodyShape={bodyShape}
              downloadSize={qrSize}
            />
          </div>
        </main>

        {/* Right - Style Panel */}
        <aside className="w-full lg:w-[400px] xl:w-[440px] bg-background pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8 flex-shrink-0 overflow-y-auto overflow-x-hidden pb-8 max-w-full">
          <QRStyleTabs
            qrType={qrType}
            value={currentValue}
            onValueChange={setCurrentValue}
            wifiSSID={wifiSSID}
            onWifiSSIDChange={setWifiSSID}
            wifiPassword={wifiPassword}
            onWifiPasswordChange={setWifiPassword}
            wifiEncryption={wifiEncryption}
            onWifiEncryptionChange={setWifiEncryption}
            emailAddress={emailAddress}
            onEmailAddressChange={setEmailAddress}
            emailSubject={emailSubject}
            onEmailSubjectChange={setEmailSubject}
            emailBody={emailBody}
            onEmailBodyChange={setEmailBody}
            smsPhone={smsPhone}
            onSmsPhoneChange={setSmsPhone}
            smsMessage={smsMessage}
            onSmsMessageChange={setSmsMessage}
            frameStyle={frameStyle}
            onFrameStyleChange={setFrameStyle}
            fgColor={fgColor}
            onFgColorChange={setFgColor}
            bgColor={bgColor}
            onBgColorChange={setBgColor}
            bgGradient={bgGradient}
            onBgGradientChange={setBgGradient}
            logo={logo}
            onLogoChange={setLogo}
            bodyShape={bodyShape}
            onBodyShapeChange={setBodyShape}
            qrSize={qrSize}
            onQrSizeChange={setQrSize}
          />
        </aside>
      </div>
    </div>
  );
};

export default Index;
