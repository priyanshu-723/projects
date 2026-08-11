// src/components/Card.jsx

import Rating from "@mui/material/Rating";

export default function Products({ product }) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm w-full rounded-xl overflow-hidden dark:bg-neutral-800 dark:border-neutral-700 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Image Container with background fill for visual consistency */}
        <div className="aspect-[1.2] w-full flex items-center justify-center bg-slate-50 dark:bg-neutral-800 rounded-lg overflow-hidden">
          <img
            src={product.thumbnail || (product.images && product.images[0])}
            className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
            alt={product.title}
          />
        </div>

        <div className="mt-4 flex-grow flex flex-col justify-between">
          <div>
            <h3
              className="text-slate-900 text-base font-semibold dark:text-slate-50 line-clamp-2 min-h-[1.5rem]"
              title={product.title}
            >
              {product.title}
            </h3>

            <div className="mt-2 flex items-center gap-2">
              <Rating
                name="half-rating-read"
                defaultValue={product.rating}
                precision={0.1}
                readOnly
                size="small"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {product.rating}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-700 flex justify-between items-center gap-2">
            <span className="text-lg text-slate-900 font-bold dark:text-slate-50">
              ${product.price}
            </span>
            <button className="py-2 px-4 text-xs sm:text-sm rounded-md font-semibold cursor-pointer text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
