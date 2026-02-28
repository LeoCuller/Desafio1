import { useEffect, useState } from "react";
import { getProducts, deleteProduct, updateProduct } from "./services/api";
import type { Product } from "./services/api";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");

  // ações
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
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

  function startEdit(p: Product) {
    setError(null);
    setEditingId(p.id ?? null);
    setEditName(p.name);
    setEditPrice(String(p.price));
    setEditStock(String(p.stock));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
    setEditStock("");
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return setError("Nome é obrigatório");

    const price = Number(editPrice);
    const stock = Number(editStock);

    if (Number.isNaN(price) || price <= 0) return setError("Preço inválido");
    if (Number.isNaN(stock) || stock < 0) return setError("Estoque inválido");

    try {
      setError(null);
      setSaving(true);
      await updateProduct(id, { name: editName.trim(), price, stock });
      cancelEdit();
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setError(null);
      setDeletingId(id);
      await deleteProduct(id);

      // se deletou o que estava editando, sai do modo edição
      if (editingId === id) cancelEdit();

      await load();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao deletar");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Produtos</h1>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "red" }}>Erro: {error}</p>}

      {!loading && (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {products.map((p) => (
            <li
              key={p.id}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              {editingId === p.id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nome"
                    style={{ padding: 8, flex: 1 }}
                    disabled={saving}
                  />

                  <input
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="Preço"
                    style={{ padding: 8, width: 140 }}
                    disabled={saving}
                  />

                  <input
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    placeholder="Estoque"
                    style={{ padding: 8, width: 140 }}
                    disabled={saving}
                  />

                  <button
                    onClick={async () => {
                      if (!p.id) return;
                      await saveEdit(p.id);
                    }}
                    disabled={saving}
                  >
                    {saving ? "Salvando..." : "Salvar"}
                  </button>

                  <button onClick={cancelEdit} disabled={saving}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <strong>{p.name}</strong> — R$ {p.price} (Estoque: {p.stock})
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                      ID: {p.id}
                    </div>
                  </div>

                  <button onClick={() => startEdit(p)} disabled={saving || deletingId !== null}>
                    Editar
                  </button>
                  <button
                    onClick={async () => {
                      if (!p.id) return;
                      await handleDelete(p.id);
                    }}
                    disabled={saving || deletingId === p.id}
                  >
                    {deletingId === p.id ? "Excluindo..." : "Excluir"}
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {!loading && products.length === 0 && (
        <p>Nenhum produto cadastrado ainda.</p>
      )}
    </div>
  );
}