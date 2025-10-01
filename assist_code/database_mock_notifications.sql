-- Create mock notification system controlled by database

-- Create function to generate mock verse notifications
CREATE OR REPLACE FUNCTION public.generate_mock_verse_notification()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  mock_names TEXT[] := ARRAY[
    'Gustian', 'Dr. Hendro Wijaya', 'Mega Sari', 'Dani Pratama', 'Lina Maharani', 'Budi Hartono',
    'Fitri Handayani', 'Made Bangli', 'Putri Wahyudi', 'Tian Leeeee', 'Agustinus', 'Suyin Bekasi',
    'Sari Kusuma', 'Ahmad Santoso', 'Dewi Anggraini, A.Md.Keb', 'Rina Puspita', 'Dr. Maya Sari'
  ];
  
  mock_verses TEXT[] := ARRAY[
    'Verse 1 - The Space Hill',
    'Verse 2 - Lucid Beach', 
    'Verse 3 - Syukur Meditation',
    'Verse 4 - Prosperity Stream',
    'Verse 5 - Vitality Vortex',
    'Verse 8 - Love Magnet',
    'Guided to Inner Silence',
    'eL Vision Delta Breathing'
  ];
  
  random_name TEXT;
  random_verse TEXT;
  random_verse_id INTEGER;
BEGIN
  -- Pick random name and verse
  random_name := mock_names[floor(random() * array_length(mock_names, 1)) + 1];
  random_verse := mock_verses[floor(random() * array_length(mock_verses, 1)) + 1];
  random_verse_id := floor(random() * 20) + 1; -- Random verse ID 1-20
  
  -- Insert mock notification into verse_notif table
  INSERT INTO public.verse_notif (user_id, display_name, verse_title, verse_id)
  VALUES (gen_random_uuid(), random_name, random_verse, random_verse_id);
  
  RAISE NOTICE 'Mock notification generated: % - %', random_name, random_verse;
END;
$$;

-- Test the function
SELECT public.generate_mock_verse_notification();