
CREATE TABLE public.familias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_lider TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.convidados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  familia_id UUID NOT NULL REFERENCES public.familias(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  confirmado BOOLEAN NOT NULL DEFAULT false,
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.familias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.convidados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read familias" ON public.familias FOR SELECT USING (true);
CREATE POLICY "Allow public insert familias" ON public.familias FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update familias" ON public.familias FOR UPDATE USING (true);
CREATE POLICY "Allow public delete familias" ON public.familias FOR DELETE USING (true);

CREATE POLICY "Allow public read convidados" ON public.convidados FOR SELECT USING (true);
CREATE POLICY "Allow public insert convidados" ON public.convidados FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update convidados" ON public.convidados FOR UPDATE USING (true);
CREATE POLICY "Allow public delete convidados" ON public.convidados FOR DELETE USING (true);
