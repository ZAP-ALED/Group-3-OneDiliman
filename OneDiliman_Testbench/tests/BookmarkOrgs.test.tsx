import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import DashboardPage from "../src/pages/Dashboard/DashboardPage";

describe("tags", () => {
  it("Check Bookmark Orgs", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    waitFor(() => expect(screen.getByText(/Starred Orgs/i)).toBeInTheDocument);
    waitFor(() => expect(screen.getByText(/UP ACM/i)).toBeInTheDocument);

  });
});
