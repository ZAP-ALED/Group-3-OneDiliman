import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardPage from "../src/pages/Dashboard/DashboardPage";

describe("tags", () => {
  it("Orgs should have tags", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    waitFor(
      () => expect(screen.getByText(/non-secretarian/i)).toBeInTheDocument
    );
    waitFor(() => expect(screen.getByText(/academic/i)).toBeInTheDocument);
    waitFor(() => expect(screen.getByText(/gaming/i)).toBeInTheDocument);
    waitFor(
      () => expect(screen.getByText(/socio-academic/i)).toBeInTheDocument
    );
    waitFor(
      () =>
        expect(screen.getByText(/UP Center for Student Innovations/i))
          .toBeInTheDocument
    );
  });
});
