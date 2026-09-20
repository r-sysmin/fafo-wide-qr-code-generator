import { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { FrameStyle } from './QRStyleTabs';
import { BodyShape } from './BodyShapeSelector';
import { QRInputFields } from './QRInputFields';
import { QRType } from './QRTypeSelector';
import QRCodeStyling, { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';

interface QRPreviewProps {
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
  qrValue: string;
  fgColor: string;
  bgColor: string;
  bgGradient?: string | null;
  frameStyle: FrameStyle;
  logo: string | null;
  bodyShape?: BodyShape;
  downloadSize?: number;
}

const frameStyleClasses: Record<FrameStyle, string> = {
  'square': 'rounded-none',
  'rounded-sm': 'rounded-lg',
  'rounded-md': 'rounded-2xl',
  'rounded-lg': 'rounded-3xl',
  'rounded-left': 'rounded-l-3xl rounded-r-none',
  'rounded-right': 'rounded-r-3xl rounded-l-none',
  'pill-h': 'rounded-full',
  'pill-v': 'rounded-full',
  'circle': 'rounded-full',
};

// Map BodyShape to qr-code-styling dot types
const bodyShapeToDotType: Record<BodyShape, DotType> = {
  'square': 'square',
  'dots': 'dots',
  'rounded': 'rounded',
  'classy': 'classy',
  'sharp': 'classy-rounded',
};

const bodyShapeToCornerSquareType: Record<BodyShape, CornerSquareType> = {
  'square': 'square',
  'dots': 'dot',
  'rounded': 'extra-rounded',
  'classy': 'extra-rounded',
  'sharp': 'square',
};

const bodyShapeToCornerDotType: Record<BodyShape, CornerDotType> = {
  'square': 'square',
  'dots': 'dot',
  'rounded': 'dot',
  'classy': 'dot',
  'sharp': 'square',
};

export function QRPreview({
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
  qrValue,
  fgColor,
  bgColor,
  bgGradient,
  frameStyle,
  logo,
  bodyShape = 'square',
  downloadSize = 300,
}: QRPreviewProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrSize, setQrSize] = useState(220);
  const { toast } = useToast();

  const displayValue = qrValue || 'https://qrcraft.app';
  const hasContent = Boolean(qrValue && qrValue.trim().length > 0);

  // Initialize QR code
  useEffect(() => {
    qrCodeRef.current = new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      data: displayValue,
      dotsOptions: {
        color: fgColor,
        type: bodyShapeToDotType[bodyShape],
      },
      cornersSquareOptions: {
        color: fgColor,
        type: bodyShapeToCornerSquareType[bodyShape],
      },
      cornersDotOptions: {
        color: fgColor,
        type: bodyShapeToCornerDotType[bodyShape],
      },
      backgroundOptions: {
        color: 'transparent',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10,
      },
      image: logo || undefined,
      qrOptions: {
        errorCorrectionLevel: 'H',
      },
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCodeRef.current.append(qrRef.current);
    }
  }, []);

  // Update QR code when props change
  useEffect(() => {
    if (qrCodeRef.current) {
      qrCodeRef.current.update({
        width: qrSize,
        height: qrSize,
        data: displayValue,
        dotsOptions: {
          color: fgColor,
          type: bodyShapeToDotType[bodyShape],
        },
        cornersSquareOptions: {
          color: fgColor,
          type: bodyShapeToCornerSquareType[bodyShape],
        },
        cornersDotOptions: {
          color: fgColor,
          type: bodyShapeToCornerDotType[bodyShape],
        },
        backgroundOptions: {
          color: 'transparent',
        },
        image: logo || undefined,
      });
    }
  }, [displayValue, fgColor, bgColor, bodyShape, qrSize, logo]);

  // Update size on container resize
  useEffect(() => {
    let rafId: number;
    
    const updateSize = () => {
      // Use requestAnimationFrame to batch layout reads and avoid forced reflow
      rafId = requestAnimationFrame(() => {
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          const availableWidth = containerWidth - 64;
          setQrSize(Math.max(150, availableWidth));
        }
      });
    };

    updateSize();
    
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      updateSize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const downloadQR = useCallback(() => {
    if (qrCodeRef.current) {
      // Create a new QR code instance with the download size
      const downloadQRCode = new QRCodeStyling({
        width: downloadSize,
        height: downloadSize,
        data: displayValue,
        dotsOptions: {
          color: fgColor,
          type: bodyShapeToDotType[bodyShape],
        },
        cornersSquareOptions: {
          color: fgColor,
          type: bodyShapeToCornerSquareType[bodyShape],
        },
        cornersDotOptions: {
          color: fgColor,
          type: bodyShapeToCornerDotType[bodyShape],
        },
        backgroundOptions: {
          color: bgColor || '#FFFFFF',
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 10,
        },
        image: logo || undefined,
        qrOptions: {
          errorCorrectionLevel: 'H',
        },
      });
      
      downloadQRCode.download({
        name: 'qrcode',
        extension: 'png',
      });
      toast({
        title: "Downloaded!",
        description: `Your QR code has been saved as ${downloadSize}x${downloadSize}px PNG.`,
      });
    }
  }, [toast, downloadSize, displayValue, fgColor, bgColor, bodyShape, logo]);

  const copyToClipboard = useCallback(async () => {
    if (qrCodeRef.current) {
      try {
        // Safari requires a Promise to be passed to ClipboardItem, not a resolved Blob
        const makeImagePromise = async (): Promise<Blob> => {
          const rawData = await qrCodeRef.current!.getRawData('png');
          if (rawData && rawData instanceof Blob) {
            return rawData;
          }
          throw new Error('Failed to generate image');
        };

        // Use the promise directly for Safari compatibility
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': makeImagePromise() })
        ]);
        
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Copied!",
          description: "QR code copied to clipboard.",
        });
      } catch (err) {
        // Fallback: Try to copy the URL/text value instead
        try {
          await navigator.clipboard.writeText(displayValue);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          toast({
            title: "Copied!",
            description: "QR code link copied to clipboard.",
          });
        } catch {
          toast({
            title: "Copy not supported",
            description: "Your browser doesn't support copying images. Try downloading instead.",
            variant: "destructive",
          });
        }
      }
    }
  }, [toast, displayValue]);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-6 w-full">
      {/* QR Code Display */}
      <div 
        className={cn(
          "w-full p-8 bg-card shadow-lg transition-all duration-300",
          frameStyleClasses[frameStyle]
        )}
        style={{ 
          backgroundColor: bgColor,
          background: bgGradient || bgColor,
        }}
      >
        <div ref={qrRef} className="relative animate-scale-in flex justify-center" />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1">
          {/* Glow effect */}
          <div className={cn(
            "absolute inset-0 rounded-full blur-lg translate-y-1 transition-opacity",
            hasContent ? "opacity-40" : "opacity-0"
          )} style={{ background: 'linear-gradient(91deg, #8FA2F5 0%, #587FED 36.54%, #587FED 67.26%, #8FA2F5 100%)' }} />
          <Button
            onClick={downloadQR}
            disabled={!hasContent}
            className={cn(
              "relative w-full h-12 rounded-full font-medium text-base border-0 shadow-none transition-all",
              hasContent 
                ? "text-white hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            style={hasContent ? { background: 'linear-gradient(91deg, #8FA2F5 0%, #587FED 36.54%, #587FED 67.26%, #8FA2F5 100%)' } : undefined}
          >
            Download QR code
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          disabled={!hasContent}
          className={cn(
            "h-10 w-10 rounded-full border-0 bg-transparent",
            hasContent ? "hover:bg-secondary/50" : "cursor-not-allowed opacity-50"
          )}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>

      {/* Input Fields */}
      <div className="w-full">
        <QRInputFields
          qrType={qrType}
          value={value}
          onValueChange={onValueChange}
          wifiSSID={wifiSSID}
          onWifiSSIDChange={onWifiSSIDChange}
          wifiPassword={wifiPassword}
          onWifiPasswordChange={onWifiPasswordChange}
          wifiEncryption={wifiEncryption}
          onWifiEncryptionChange={onWifiEncryptionChange}
          emailAddress={emailAddress}
          onEmailAddressChange={onEmailAddressChange}
          emailSubject={emailSubject}
          onEmailSubjectChange={onEmailSubjectChange}
          emailBody={emailBody}
          onEmailBodyChange={onEmailBodyChange}
          smsPhone={smsPhone}
          onSmsPhoneChange={onSmsPhoneChange}
          smsMessage={smsMessage}
          onSmsMessageChange={onSmsMessageChange}
        />
      </div>
    </div>
  );
}
