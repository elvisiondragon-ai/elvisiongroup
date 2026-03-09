-- Create reflections table for spiritual journal
CREATE TABLE public.reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question TEXT NOT NULL,
  reflection TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own reflections" 
ON public.reflections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reflections" 
ON public.reflections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections" 
ON public.reflections 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reflections" 
ON public.reflections 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_reflections_updated_at
BEFORE UPDATE ON public.reflections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();