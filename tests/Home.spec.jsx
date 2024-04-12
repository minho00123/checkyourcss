import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../src/renderer/src/components/Home";

describe("Home Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should include 'Drop your project here.' text", () => {
    render(<Home />);
    expect(screen.getByText(/Drop your project here./i)).toBeInTheDocument();
  });

  it("CSS 프레임워크 타입 선택 시 상태가 업데이트되어야 함", () => {
    render(<Home />);

    const radio = screen.getByLabelText("Tailwind CSS");
    fireEvent.click(radio);

    expect(radio).toBeChecked();
  });
});
