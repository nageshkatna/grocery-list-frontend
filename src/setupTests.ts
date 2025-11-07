import "@testing-library/jest-dom";
import fetch from "node-fetch";

// attach to global
(globalThis as any).fetch = fetch;
