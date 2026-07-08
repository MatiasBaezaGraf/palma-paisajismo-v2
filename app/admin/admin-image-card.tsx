import { type HomeImageRow, type ProjectTypeRow } from "../lib/content";
import { AdminUploadForm } from "./admin-upload-form";

type ImageCardItem = HomeImageRow | ProjectTypeRow;

export function AdminImageCard({
  item,
  action,
  hiddenName,
  hiddenValue,
}: {
  item: ImageCardItem;
  action: (formData: FormData) => Promise<void>;
  hiddenName: "slot" | "slug";
  hiddenValue: string;
}) {
  return (
    <AdminUploadForm
      key={`${hiddenValue}-${item.image_path}-${item.image_alt}-${item.updated_at}`}
      item={item}
      action={action}
      hiddenName={hiddenName}
      hiddenValue={hiddenValue}
    />
  );
}
