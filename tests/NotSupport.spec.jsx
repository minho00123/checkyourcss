import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NotSupport from "../src/renderer/src/components/NotSupport";

describe("NotSupport Components", () => {
  const mockCssData = {
    data: {
      "grid-template-columns": {
        stats: {
          chrome: {
            89: "y",
            90: "y",
          },
          firefox: {
            88: "y",
            89: "y",
          },
        },
      },
    },
  };

  const mockUserSelections = [
    { browser: "Chrome", version: "89" },
    { browser: "Firefox", version: "88" },
  ];

  const mockBrowsers = {
    Chrome: {
      versionsNotSupport: [],
      versionsPartiallySupport: [],
      versionsSupport: ["89", "90"],
      stat: "chrome",
    },
    Firefox: {
      versionsNotSupport: [],
      versionsPartiallySupport: [],
      versionsSupport: ["88", "89"],
      stat: "firefox",
    },
  };

  const mockCssInfo = [
    {
      cssProperties: ["grid-template-columns"],
      fileContent: "grid-template-columns: 1fr 1fr;",
      filePath: "/path/to/file",
    },
  ];

  it("Should rend NotSupport component correctly", () => {
    render(
      <NotSupport
        cssData={mockCssData}
        cssProperty="grid-template-columns"
        userSelections={mockUserSelections}
        browsers={mockBrowsers}
        cssInfo={mockCssInfo}
      />,
    );

    expect(screen.getByText(/is not supported/)).toBeInTheDocument();
  });

  it("Should display appropriate message for unsupported CSS properties", () => {
    render(
      <NotSupport
        cssData={mockCssData}
        cssProperty="grid-template-columns"
        userSelections={mockUserSelections}
        browsers={mockBrowsers}
        cssInfo={mockCssInfo}
      />,
    );

    expect(screen.getByText("grid-template-columns")).toBeInTheDocument();
    expect(screen.getByText("Chrome")).toBeInTheDocument();
    expect(screen.getByText("Firefox")).toBeInTheDocument();
  });
});
