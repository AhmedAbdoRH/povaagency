
-- Create collaboration_requests table
CREATE TABLE IF NOT EXISTS collaboration_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    selected_services JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE collaboration_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the contact form)
CREATE POLICY "Allow anonymous inserts" ON collaboration_requests
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to select (for admin dashboard)
CREATE POLICY "Allow authenticated selects" ON collaboration_requests
    FOR SELECT USING (auth.role() = 'authenticated');
