/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { groceryApi } from "../api";

const mockJson = {
  count: 2,
  current_page: 1,
  total_pages: 1,
  next: "",
  previous: "",
  results: [
    { id: "1", name: "Milk", description: "Protien Rich Milk", quantity: 2, unit: "Packs", purchased: false },
    { id: "2", name: "Bread", description: "Brown Bread", quantity: 2, unit: "Packs", purchased: false },
  ],
};

describe("groceryApi", () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();

    // Mock window object
    vi.stubGlobal("window", {
      __RUNTIME_CONFIG__: {},
    });

    // Mock fetch
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockJson,
      })
    );
  });

  it("getItems throws when response not ok", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false });
    await expect(groceryApi.getItems(1)).rejects.toThrow("Failed to fetch items");
  });

  it("addItem posts JSON and returns json on success", async () => {
    const payload = { name: "Eggs", description: "", quantity: 12, unit: "Packs" } as any;
    const returned = { id: "1", ...payload, purchased: false };
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => returned });

    const res = await groceryApi.addItem(payload);

    expect(global.fetch).toHaveBeenCalled();
    const opts = (global.fetch as any).mock.calls[0][1];
    expect(opts.method).toBe("POST");
    expect(opts.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(opts.body)).toEqual(payload);
    expect(res).toEqual(returned);
  });

  it("updateItem sends PUT and returns json", async () => {
    const updates = { name: "New" } as any;
    const returned = { id: "1", name: "New", description: "", quantity: 1, unit: "Pieces", purchased: false };
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => returned });

    const res = await groceryApi.updateItem("1", updates);

    expect(global.fetch).toHaveBeenCalled();
    const opts = (global.fetch as any).mock.calls[0][1];
    expect(opts.method).toBe("PUT");
    expect(JSON.parse(opts.body)).toEqual(updates);
    expect(res).toEqual(returned);
  });

  it("flagPurchased sends PATCH and returns json", async () => {
    const updates = { purchased: true } as any;
    const returned = { id: "1", purchased: true } as any;
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => returned });

    const res = await groceryApi.flagPurchased("1", updates);

    expect(global.fetch).toHaveBeenCalled();
    const opts = (global.fetch as any).mock.calls[0][1];
    expect(opts.method).toBe("PATCH");
    expect(JSON.parse(opts.body)).toEqual(updates);
    expect(res).toEqual(returned);
  });

  it("deleteItem sends DELETE and throws on non-ok", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: true });
    await expect(groceryApi.deleteItem("1")).resolves.toBeUndefined();

    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false });
    await expect(groceryApi.deleteItem("1")).rejects.toThrow("Failed to delete item");
  });
});
