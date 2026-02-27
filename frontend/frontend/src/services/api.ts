const API_BASE = "https://localhost:5052/api";

export type Product = {
  id?: string; // Mongo ObjectId
  name: string;
  price: number;
  stock: number;
};

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/Products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error(`Erro ao deletar: ${res.status}`);
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/Products`);
  if (!res.ok) throw new Error("Erro ao buscar produtos");
  return res.json();
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  const res = await fetch(`${API_BASE}/Products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Erro ao criar produto");
  return res.json();
}

export async function updateProduct(
  id: string,
  product: Omit<Product, "id">
): Promise<void> {
  const res = await fetch(`${API_BASE}/Products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!res.ok) throw new Error(`Erro ao atualizar produto: ${res.status}`);
}