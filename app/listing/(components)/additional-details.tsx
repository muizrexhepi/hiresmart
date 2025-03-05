interface DetailItem {
  label: string;
  value: string | undefined;
  fullWidth?: boolean;
}

interface AdditionalDetailsProps {
  details: DetailItem[];
}

export function AdditionalDetails({ details }: AdditionalDetailsProps) {
  if (!details.length) return null;

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Additional Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {details.map((detail, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              detail.fullWidth ? "md:col-span-2" : ""
            } p-3 bg-gray-50 rounded-md`}
          >
            <span className="text-gray-500 text-sm">{detail.label}</span>
            <span className="font-medium">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
