
import { createClient } from "@supabase/supabase-js";

// Ці змінні середовища будуть доступні після створення проєкту в Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Створюємо клієнт тільки якщо є ключі, інакше повертаємо null або mock
// Це дозволяє сайту працювати навіть без налаштованого Supabase (в режимі демо)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
