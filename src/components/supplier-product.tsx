import { supplier_products, supplier_products_rels } from "@/payload-generated-schema";
import { eq } from "@payloadcms/db-vercel-postgres/drizzle";
import { UIFieldServerComponent, UIFieldServerProps } from "payload";
import SupplierProductSelect from "./supplier-product-select";

const CustomServerButton: UIFieldServerComponent = async (
  props: UIFieldServerProps,
) => {
  const { id, payload } = props;

  // Récupérer tous les utilisateurs avec leur statut pour cet événement (LEFT JOIN)
  const supplierProductAssociated = await payload.db.drizzle
    .select({
      name: supplier_products.name,
      id: supplier_products.id,
    })
    .from(supplier_products)
    .innerJoin(supplier_products_rels, eq(supplier_products_rels.parent, supplier_products.id))
    .where(eq(supplier_products_rels.suppliersID, id?.toString() ?? "cccccccc-ee82-4aec-8626-fd2ca1baa30c"));

  const supplierProducts = await payload.db.drizzle
    .select({
      name: supplier_products.name,
      id: supplier_products.id,
    })
    .from(supplier_products)

  return (
    <div style={{ marginBottom: '20px' }}>
      <SupplierProductSelect supplierProductAssociated={supplierProductAssociated} supplierProducts={supplierProducts} />
    </div>
  );
};

export default CustomServerButton;
