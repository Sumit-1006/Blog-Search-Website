import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// Meta function for setting the page metadata
export const meta: MetaFunction = ({ data }: { data: any }) => {
  return [
    { title: capitalizeFirstWord(data.photo.alt_description) },
    { name: "description", content: data.photo.description || data.photo.alt_description },
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

// Utility function to capitalize the first word
function capitalizeFirstWord(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

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
        <div className="w-full text-center space-y-6">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg p-4 bg-black/50 rounded-lg">
            {capitalizeFirstWord(photo.alt_description)}
          </h1>
          <div className="flex justify-center">
            <img
              src={photo.urls.regular}
              alt={photo.alt_description}
              className="w-full max-w-3xl h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-gray-700 w-full text-left">
            <p className="text-xl leading-relaxed">
              <strong className="text-2xl">{photo.description || photo.alt_description}</strong>
            </p>
            <p className="text-lg">
              <strong className="text-xl">Photographer:</strong> {photo.user.name}
            </p>
            {photo.location && (
              <p className="text-lg">
                <strong className="text-xl">Location:</strong> {photo.location.title || 'Unknown'}
              </p>
            )}
            {photo.tags.length > 0 && (
              <p className="text-lg">
                <strong className="text-xl">Tags:</strong> {photo.tags.map(tag => tag.title).join(', ')}
              </p>
            )}
            <br />
            <p className="text-xl ">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
              malesuada. Curabitur quis luctus nisl. Aliquam erat volutpat.
              Phasellus hendrerit dolor a urna feugiat, ut fermentum massa
              bibendum. Integer vel sem et urna sollicitudin facilisis at et
              libero. Nam tincidunt ligula nec magna gravida imperdiet. Donec
              tristique, quam nec elementum varius, nisi nisi pulvinar eros, id
              vehicula justo elit sed nulla.
            </p>
            <p className="text-xl">
              Integer eget diam nisi. Nulla facilisi. Nulla euismod lorem id
              mauris interdum, eget facilisis velit ultricies. Maecenas placerat
              turpis quis augue lacinia, sed pharetra magna dapibus. In sit amet
              mattis lectus. Phasellus euismod ligula sit amet lacus vulputate,
              eget vulputate justo fermentum. Mauris efficitur, arcu at
              scelerisque hendrerit, ex libero sollicitudin elit, et viverra
              libero libero et ligula.
            </p>
            <p className="text-xl">
              Donec a nisl sed libero egestas consectetur. Integer id felis et
              ipsum tincidunt condimentum. Pellentesque sit amet maximus arcu.
              Ut convallis purus in urna dapibus, nec congue nunc consectetur.
              Nam accumsan, arcu et tristique commodo, risus nulla vestibulum
              nulla, ac dignissim odio risus vel nulla. In ac leo venenatis,
              tempus massa non, bibendum sapien. Donec vulputate, tortor nec
              suscipit placerat, lorem justo feugiat elit, sit amet bibendum
              enim nulla a felis.
            </p>
            <p className="text-xl">
              Suspendisse id ligula sed justo consequat eleifend. Vivamus
              fringilla nisl vitae auctor pellentesque. Integer gravida dolor
              eget lectus vulputate, id laoreet augue sollicitudin. Sed
              vehicula urna sit amet elit hendrerit scelerisque. Sed a posuere
              lectus, eget dictum neque. Fusce convallis libero eget mi
              fringilla, et bibendum purus tempor. Vivamus vehicula, libero
              scelerisque pharetra tempor, sem sapien aliquam magna, ac pretium
              purus eros a nunc. Duis in nisi in metus pharetra feugiat.
            </p>
            <p className="text-xl">
              Praesent suscipit dui nec leo pulvinar, ac lacinia metus
              scelerisque. Vivamus facilisis tincidunt velit, non feugiat mi
              aliquet in. Sed sit amet scelerisque mi, nec malesuada sapien.
              Integer malesuada est at vestibulum tempor. Curabitur vehicula
              consequat odio, in viverra erat. Sed sollicitudin est id elit
              tristique scelerisque. Aliquam a ultrices elit. Aliquam erat
              volutpat. Curabitur consectetur odio ac sapien sollicitudin
              molestie. Nullam convallis nulla in velit bibendum, eget volutpat
              dolor lobortis. Etiam interdum interdum nunc, sit amet pretium
              felis fringilla a. Sed luctus volutpat urna vel tristique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
