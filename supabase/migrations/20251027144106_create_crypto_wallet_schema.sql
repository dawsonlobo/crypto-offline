/*
  # Crypto Wallet Database Schema

  1. New Tables
    - `wallets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `crypto_type` (text) - BTC, ETH, etc.
      - `network` (text) - Mainnet, Testnet, etc.
      - `public_address` (text)
      - `wallet_name` (text) - optional display name
      - `created_at` (timestamptz)
      
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `wallet_id` (uuid, references wallets)
      - `transaction_date` (timestamptz)
      - `from_address` (text)
      - `to_address` (text)
      - `crypto_token` (text)
      - `quantity` (numeric)
      - `transaction_hash` (text)
      - `status` (text) - pending, completed, failed
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  crypto_type text NOT NULL,
  network text NOT NULL,
  public_address text NOT NULL,
  wallet_name text,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wallet_id uuid REFERENCES wallets(id) ON DELETE CASCADE,
  transaction_date timestamptz DEFAULT now(),
  from_address text NOT NULL,
  to_address text NOT NULL,
  crypto_token text NOT NULL,
  quantity numeric NOT NULL,
  transaction_hash text,
  status text DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Wallets policies
CREATE POLICY "Users can view own wallets"
  ON wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own wallets"
  ON wallets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallets"
  ON wallets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wallets"
  ON wallets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);
