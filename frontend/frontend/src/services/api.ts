const API_BASE = "https://localhost:5052/api";

export type Product = {
  id?: string; // Mongo ObjectId
  name: string;
  price: number;
  stock: number;
};

// helper pra tentar ler mensagem de erro do backend (se existir)
async function readError(res: Response) {
  try {
    const text = await res.text();
    return text ? ` - ${text}` : "";
  } catch {
    return "";
  }
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/Products`, { method: "GET" });

  if (!res.ok) {
    throw new Error(`Erro ao buscar produtos: ${res.status}${await readError(res)}`);
  }

  return res.json();
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  const res = await fetch(`${API_BASE}/Products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!res.ok) {
    throw new Error(`Erro ao criar produto: ${res.status}${await readError(res)}`);
  }

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

  if (!res.ok) {
    throw new Error(`Erro ao atualizar produto: ${res.status}${await readError(res)}`);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/Products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Erro ao deletar produto: ${res.status}${await readError(res)}`);
  }
}