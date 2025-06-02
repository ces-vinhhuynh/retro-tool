'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HealthCheck } from '@/features/health-check/types/health-check';
import { Template } from '@/features/health-check/types/templates';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthCheck: HealthCheck;
  template?: Template | null;
}

const WelcomeModal = ({
  isOpen,
  onClose,
  healthCheck,
  template,
}: WelcomeModalProps) => {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const [sessionLink, setSessionLink] = useState('');

  useEffect(() => {
    // Use the current URL as the session link
    if (typeof window !== 'undefined') {
      setSessionLink(window.location.origin + pathname);
    }
  }, [pathname]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Welcome to {healthCheck.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="mb-2 text-xl font-bold">About This Session</h3>
            <p className="text-gray-600">
              This session uses the{' '}
              <span className="font-medium">
                {template?.name || 'Team Morale Assessment'}
              </span>{' '}
              template to gather feedback about your team&apos;s health and
              dynamics.
            </p>
          </div>

          <div className="bg-ces-orange-50 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-start">
              <div className="md:w-2/5">
                <h4 className="mb-2 text-lg font-medium">Scan to Join</h4>
                <div className="inline-block rounded-md bg-white p-4">
                  {/* Real QR code that encodes the current URL */}
                  {sessionLink && (
                    <QRCode
                      value={sessionLink}
                      size={192}
                      style={{
                        height: 'auto',
                        maxWidth: '100%',
                        width: '100%',
                      }}
                      viewBox={`0 0 256 256`}
                    />
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-0 md:w-3/5 md:pl-4">
                <h4 className="mb-2 text-lg font-medium">
                  Share With Your Team
                </h4>
                <p className="mb-2 text-sm">
                  Invite participants by sharing this link:
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={sessionLink}
                    readOnly
                    className="flex-1 rounded-md border bg-white p-2 text-sm"
                  />
                  <Button onClick={handleCopy} variant="outline" size="sm">
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
