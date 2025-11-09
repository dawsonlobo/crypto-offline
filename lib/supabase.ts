import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      wallets: {
        Row: {
          id: string;
          user_id: string;
          crypto_type: string;
          network: string;
          public_address: string;
          wallet_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          crypto_type: string;
          network: string;
          public_address: string;
          wallet_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          crypto_type?: string;
          network?: string;
          public_address?: string;
          wallet_name?: string | null;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          wallet_id: string | null;
          transaction_date: string;
          from_address: string;
          to_address: string;
          crypto_token: string;
          quantity: number;
          transaction_hash: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          wallet_id?: string | null;
          transaction_date?: string;
          from_address: string;
          to_address: string;
          crypto_token: string;
          quantity: number;
          transaction_hash?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          wallet_id?: string | null;
          transaction_date?: string;
          from_address?: string;
          to_address?: string;
          crypto_token?: string;
          quantity?: number;
          transaction_hash?: string | null;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
};
