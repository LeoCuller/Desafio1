import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "./services/api";
import type { Product } from "./services/api";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // função para carregar produtos
  async function load() {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (e: any) {
      setError(e?.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Produtos</h1>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "red" }}>Erro: {error}</p>}

      {!loading && !error && (
        <ul>
          {products.map((p) => (
            <li
              key={p.id}
              style={{ display: "flex", gap: 10, alignItems: "center" }}
            >
              <span style={{ flex: 1 }}>
                <strong>{p.name}</strong> — R$ {p.price} (Estoque: {p.stock})
              </span>

              <button
                onClick={async () => {
                  if (!p.id) return;
                  await deleteProduct(p.id);
                  await load(); // recarrega a lista
                }}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}