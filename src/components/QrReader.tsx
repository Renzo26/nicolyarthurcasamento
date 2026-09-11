import { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";

interface QrReaderProps {
  onScan: (data: string) => void;
  onError: (message: string) => void;
}

/**
 * Câmera traseira lendo QR code. Liga ao montar e desliga ao desmontar —
 * quem usa controla a leitura montando/desmontando o componente.
 */
const QrReader = ({ onScan, onError }: QrReaderProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Callbacks em ref: o scanner é criado uma única vez, e um render do pai
  // não pode reiniciar a câmera.
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  onScanRef.current = onScan;
  onErrorRef.current = onError;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const scanner = new QrScanner(video, (result) => onScanRef.current(result.data), {
      preferredCamera: "environment",
      maxScansPerSecond: 8,
      returnDetailedScanResult: true,
    });

    scanner.start().catch(() => {
      // Sem HTTPS o navegador nem oferece a câmera — o erro de permissão
      // esconderia a causa real.
      onErrorRef.current(
        window.isSecureContext
          ? "Não foi possível abrir a câmera. Permita o acesso à câmera nas configurações do navegador."
          : "A câmera só funciona com o site aberto em https://.",
      );
    });

    return () => scanner.destroy();
  }, []);

  return <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />;
};

export default QrReader;
