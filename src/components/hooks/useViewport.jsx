import { useContext } from "react";
import { ViewportContext } from "../context/ViewportContext";

export function useViewport() {
  const ctx = useContext(ViewportContext);
  return ctx;
}
