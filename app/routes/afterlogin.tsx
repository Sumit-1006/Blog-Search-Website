// afterlogin.tsx

import { useState } from 'react';
import { Form, useActionData } from '@remix-run/react';
import { getSupabase } from '~/supabaseclient'; // Adjust path as per your structure
import { ActionFunction } from '@remix-run/node';
import { Link, useNavigate } from 'react-router-dom';

export const action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const imageUrl = formData.get('image-url') as string;
  const heading = formData.get('heading') as string;
  const content = formData.get('content') as string;

  console.log('Form Data:', { imageUrl, heading, content });

  const supabase = getSupabase();
  const { error } = await supabase.from('posts').insert([
    { image_url: imageUrl, heading, content },
  ]);

  if (error) {
    console.error('Supabase Insert Error:', error.message);
    return { status: 500, json: { error: error.message } };
  }

  console.log('Data successfully inserted');
  return { status: 200, json: { success: 'New Blog Added' } };
};

export default function AfterLogin() {
  const [message, setMessage] = useState<string | null>(null);
  const actionData = useActionData();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out error:', error.message);
    } else {
      navigate('/'); // Redirect to the home page
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const imageUrl = formData.get('image-url') as string;
    const heading = formData.get('heading') as string;
    const content = formData.get('content') as string;

    // Make a request to the action (afterlogin.tsx)
    const response = await fetch('/__app/afterlogin.tsx', {
      method: 'POST',
      body: JSON.stringify({ image_url: imageUrl, heading, content }),
    });

    if (!response.ok) {
      console.error('Error adding data:', await response.text());
      setMessage('Error adding data. Please try again.');
      return;
    }

    const data = await response.json();
    setMessage(data.success); // Set success message
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 relative">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: `url('/image (1).png')` }}
      />
      <Link
        to="/"
        className="absolute top-4 right-4 px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded z-20"
        onClick={handleSignOut}
      >
        Sign Out
      </Link>
      {message && (
        <div className="fixed top-0 left-0 w-full bg-green-200 text-green-800 font-bold text-4xl text-center py-4">
          {message}
        </div>
      )}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen">
        <div className="max-w-4xl w-full p-6 bg-white bg-opacity-70 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Enter the New Data</h2>
          <Form method="post" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-4">
                <label htmlFor="image-url" className="text-lg">Image URL</label>
                <input id="image-url" name="image-url" placeholder="Enter image URL" className="w-full px-4 py-2 text-lg bg-white bg-opacity-70 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-4">
                <label htmlFor="heading" className="text-lg">Heading</label>
                <input id="heading" name="heading" placeholder="Enter heading" className="w-full px-4 py-2 text-lg bg-white bg-opacity-70 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-4">
                <label htmlFor="content" className="text-lg">Content</label>
                <textarea id="content" name="content" placeholder="Enter content" rows={5} className="w-full px-4 py-2 text-lg bg-white bg-opacity-70 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-6 py-3 text-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Add Data</button>
            </div>
          </Form>
          {actionData?.error && <p className="text-red-600 mt-4">{actionData.error}</p>}
        </div>
      </div>
    </div>
  );
}
