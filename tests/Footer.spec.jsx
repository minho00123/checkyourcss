import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "../src/renderer/src/components/Footer";

describe("Footer Components", () => {
  test("Should render Footer component correctly", () => {
    render(<Footer />);
    const footerElement = screen.getByTestId("footer");
    expect(footerElement).toBeInTheDocument();
  });

  test("Should cotain copyright mark", () => {
    render(<Footer />);
    expect(screen.getByText(/Copyright ©️2024 TeamTitans/)).toBeInTheDocument();
  });
});
