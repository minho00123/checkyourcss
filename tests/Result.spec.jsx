import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Result from "../src/renderer/src/components/Result";

describe("Result Component", () => {
  const mockCssInfo = [
    {
      cssProperties: ["grid-template-columns"],
      fileContent: "grid-template-columns: 1fr 1fr;",
      filePath: "/path/to/file",
    },
  ];
  const mockUserSelections = [
    { browser: "Chrome", version: "89" },
    { browser: "Firefox", version: "88" },
  ];
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
  const mockCssCompatibilityResult = [
    {
      property: "grid-template-columns",
      compatibility: "y",
    },
    {
      property: "subgrid",
      compatibility: "a #1",
    },
    {
      property: "gap",
      compatibility: "n",
    },
    {
      property: "aspect-ratio",
      compatibility: "a #2",
    },
    {
      property: "transform",
      compatibility: "y",
    },
    {
      property: "variables",
      compatibility: "y",
    },
  ];

  it("Should render Result correctly", async () => {
    render(
      <Result
        isPerfect={true}
        cssInfo={mockCssInfo}
        userSelections={mockUserSelections}
        cssData={mockCssData}
        browsers={mockBrowsers}
        cssCompatibilityResult={mockCssCompatibilityResult}
      />,
    );
    expect(screen.getByText(/Perfect!/i)).toBeTruthy();
  });

  it("Should indicate partially supported or unsupported CSS properties when they exist", async () => {
    render(
      <Result
        isPerfect={false}
        cssInfo={mockCssInfo}
        userSelections={mockUserSelections}
        cssData={mockCssData}
        browsers={mockBrowsers}
        cssCompatibilityResult={mockCssCompatibilityResult}
      />,
    );
    const notSupportedElements = screen.getAllByText(/Not Supported/i);

    expect(notSupportedElements.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Partial Supported/i).length).toBeGreaterThan(0);
  });
});
