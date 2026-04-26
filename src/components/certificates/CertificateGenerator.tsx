'use client';

import React from 'react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';

interface CertificateProps {
    certificateData: {
        user_name: string;
        course_title: string;
        issued_date: string;
        verification_id: string;
        completion_percentage?: number;
    };
    onShare?: () => void;
    onDownload?: () => void;
}

export default function CertificateGenerator({ certificateData, onShare, onDownload }: CertificateProps) {
    const [qrCodeURL, setQRCodeURL] = React.useState('');

    React.useEffect(() => {
        // Generate QR code for verification
        const verificationURL = `https://PathPilot.in/verify/${certificateData.verification_id}`;
        QRCode.toDataURL(verificationURL, { width: 150 }).then(setQRCodeURL);
    }, [certificateData.verification_id]);

    const handleDownload = () => {
        // TODO: Add PDF generation in future
        if (onDownload) onDownload();
        alert('Download feature coming soon! For now, you can take a screenshot.');
    };

    const handleLinkedInShare = () => {
        const text = `I just completed ${certificateData.course_title} on Path Pilot! 🎓`;
        const url = `https://PathPilot.in/verify/${certificateData.verification_id}`;
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
            '_blank'
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Certificate Preview */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                {/* Decorative Border */}
                <div className="absolute inset-4 border-4 border-yellow-400/50 rounded-xl"></div>

                {/* Content */}
                <div className="relative p-16 text-center">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="text-6xl mb-4">🎓</div>
                        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                            Certificate of Completion
                        </h1>
                        <div className="w-32 h-1 bg-yellow-400 mx-auto"></div>
                    </div>

                    {/* Body */}
                    <div className="mb-8">
                        <p className="text-xl text-white/90 mb-4">This certifies that</p>
                        <h2 className="text-5xl font-bold text-yellow-300 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                            {certificateData.user_name}
                        </h2>
                        <p className="text-xl text-white/90 mb-2">has successfully completed</p>
                        <h3 className="text-3xl font-semibold text-white mb-6">
                            {certificateData.course_title}
                        </h3>
                        {certificateData.completion_percentage && (
                            <p className="text-lg text-white/80">
                                with a completion rate of <strong>{certificateData.completion_percentage}%</strong>
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-12">
                        <div className="text-left">
                            <p className="text-white/80">Issued on</p>
                            <p className="text-xl font-semibold text-white">
                                {new Date(certificateData.issued_date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>

                        <div className="text-center">
                            {qrCodeURL && <img src={qrCodeURL} alt="Verification QR" className="w-24 h-24 mx-auto" />}
                            <p className="text-xs text-white/60 mt-2">Scan to verify</p>
                        </div>

                        <div className="text-right">
                            <div className="border-t-2 border-white/50 pt-2 px-4">
                                <p className="font-bold text-white">Path Pilot</p>
                            </div>
                            <p className="text-sm text-white/80">Authorized Signature</p>
                        </div>
                    </div>

                    {/* Verification ID */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-white/60">
                            Verification ID: <span className="font-mono">{certificateData.verification_id}</span>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 justify-center">
                <button
                    onClick={handleDownload}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all hover:shadow-lg hover:shadow-purple-500/50"
                >
                    📥 Download PDF
                </button>
                <button
                    onClick={handleLinkedInShare}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/50"
                >
                    🔗 Share on LinkedIn
                </button>
                <button
                    onClick={onShare}
                    className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/30"
                >
                    🔗 Copy Link
                </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl text-center">
                <p className="text-blue-200 text-sm">
                    ✅ You can download and share this certificate with anyone!
                </p>
            </div>
        </div>
    );
}
