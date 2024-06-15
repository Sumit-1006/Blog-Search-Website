import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// Meta function for setting the page metadata
export const meta: MetaFunction = ({ data }: { data: any }) => {
  return [
    { title: data.photo.alt_description },
    { name: "description", content: data.photo.alt_description },
  ];
};

// Loader function to fetch the photo details
export const loader: LoaderFunction = async ({ params }) => {
  const { photoId } = params;

  const response = await fetch(`https://api.unsplash.com/photos/${photoId}`, {
    headers: {
      Authorization: 'Client-ID Sahsc_dhXRNry03wAoExe_vHRMHKuNa6JT8_KFn3mOA',
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching photo: ${response.statusText}`);
  }

  const photo = await response.json();
  return json({ photo });
};

// Detail component
export default function Detail() {
  const { photo } = useLoaderData();

  return (
    <div className="relative w-full min-h-screen bg-gray-200">
      <img
        src="/image (1).png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover filter blur-sm"
      />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl w-full space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg p-4 bg-black/50 rounded-lg">
            {photo.alt_description}
          </h1>
          <img
            src={photo.urls.regular}
            alt={photo.alt_description}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <div className="bg-white p-6 rounded-lg shadow-lg text-gray-700">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
              malesuada. Curabitur quis luctus nisl. Aliquam erat volutpat.
              Phasellus hendrerit dolor a urna feugiat, ut fermentum massa
              bibendum. Integer vel sem et urna sollicitudin facilisis at et
              libero. Nam tincidunt ligula nec magna gravida imperdiet. Donec
              tristique, quam nec elementum varius, nisi nisi pulvinar eros, id
              vehicula justo elit sed nulla.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
