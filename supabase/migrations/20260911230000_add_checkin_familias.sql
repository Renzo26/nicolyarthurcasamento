-- Momento em que a família passou pela portaria (lido pelo QR code).
-- NULL = ainda não entrou.
ALTER TABLE public.familias ADD COLUMN checkin_em TIMESTAMP WITH TIME ZONE;
